import { StudentProfile } from "@prisma/client";
import prisma from "@/lib/prisma";



export interface RankingData {
  studentId: string;
  name: string;
  displayName: string;
  level: string;
  points: number;
  awardsCount: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  performancesCount: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
  avatarUrl?: string | null;
}

export async function calculateStudentRankings(): Promise<RankingData[]> {
  // Fetch active and public students with their verified awards and performances
  const students = await prisma.studentProfile.findMany({
    where: { activeStatus: true, isPublic: true },
    include: {
      user: true,
      awards: {
        where: { verified: true }
      },
      performances: true
    }
  });

  // Fetch ranking weights
  const settings = await prisma.rankingSettings.findMany();
  const pointsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.points;
    return acc;
  }, {} as Record<string, number>);

  // Default fallbacks if settings aren't seeded correctly
  const getPoints = (key: string, defaultVal: number) => pointsMap[key] ?? defaultVal;

  const rankedStudents = students.map(student => {
    let totalPoints = 0;
    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;

    // Calculate points from awards
    student.awards.forEach(award => {
      if (award.position === '1st Place' || award.position === 'Gold') {
        totalPoints += getPoints('1st Place', 100);
        goldCount++;
      } else if (award.position === '2nd Place' || award.position === 'Silver') {
        totalPoints += getPoints('2nd Place', 70);
        silverCount++;
      } else if (award.position === '3rd Place' || award.position === 'Bronze') {
        totalPoints += getPoints('3rd Place', 50);
        bronzeCount++;
      } else if (award.position === 'Participation') {
        totalPoints += getPoints('Participation', 20);
      } else {
        totalPoints += getPoints('Special Achievement', 100);
      }
    });

    // Calculate points from performances
    const performancesCount = student.performances.length;
    totalPoints += (performancesCount * getPoints('Academy Performance', 30));

    return {
      studentId: student.id,
      name: student.user.name || 'Unknown',
      displayName: student.displayName || student.user.name || 'Unknown',
      level: student.level,
      points: totalPoints,
      awardsCount: student.awards.length,
      goldCount,
      silverCount,
      bronzeCount,
      performancesCount,
      currentRank: student.currentRank,
      previousRank: student.previousRank,
      previousPoints: student.achievementPoints,
      avatarUrl: student.user.image,
    };
  });

  // Sort students by points (descending). Tie-breaker: goldCount, then total awards.
  rankedStudents.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goldCount !== a.goldCount) return b.goldCount - a.goldCount;
    return b.awardsCount - a.awardsCount;
  });

  // Assign ranks and update DB concurrently
  const finalRankings: RankingData[] = [];
  const updatePromises = [];

  for (let i = 0; i < rankedStudents.length; i++) {
    const student = rankedStudents[i];
    const newRank = i + 1;
    
    // Determine trend based on previous rank
    let trend: 'up' | 'down' | 'same' = 'same';
    if (student.currentRank) {
      if (newRank < student.currentRank) trend = 'up';
      else if (newRank > student.currentRank) trend = 'down';
    }

    finalRankings.push({
      studentId: student.studentId,
      name: student.name,
      displayName: student.displayName,
      level: student.level,
      points: student.points,
      awardsCount: student.awardsCount,
      goldCount: student.goldCount,
      silverCount: student.silverCount,
      bronzeCount: student.bronzeCount,
      performancesCount: student.performancesCount,
      rank: newRank,
      trend,
      avatarUrl: student.avatarUrl,
    });

    // Only update DB if rank or points have changed to save write operations
    if (student.currentRank !== newRank || student.points !== student.previousPoints) {
       updatePromises.push(
         prisma.studentProfile.update({
           where: { id: student.studentId },
           data: {
             previousRank: student.currentRank || newRank,
             currentRank: newRank,
             achievementPoints: student.points,
           }
         })
       );
    }
  }

  // Execute updates immediately to prevent unhandled promise rejections in serverless environments
  if (updatePromises.length > 0) {
    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating rankings:', error);
    }
  }

  return finalRankings;
}
