import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';



async function main() {
  console.log('Seeding database with expanded data...');

  // 1. Create Ranking Settings
  const settings = [
    { key: '1st Place', points: 100 },
    { key: '2nd Place', points: 70 },
    { key: '3rd Place', points: 50 },
    { key: 'Participation', points: 20 },
    { key: 'Academy Performance', points: 30 },
    { key: 'Exam Completion', points: 50 },
    { key: 'Special Achievement', points: 100 },
  ];

  for (const setting of settings) {
    await prisma.rankingSettings.upsert({
      where: { key: setting.key },
      update: { points: setting.points },
      create: { key: setting.key, points: setting.points },
    });
  }

  // 2. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@natyakshethram.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@natyakshethram.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 3. Create Students
  const student1Pass = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'ananya@example.com' },
    update: {},
    create: {
      name: 'Ananya R',
      email: 'ananya@example.com',
      password: student1Pass,
      role: 'STUDENT',
      studentProfile: {
        create: {
          displayName: 'Ananya',
          joiningYear: 2020,
          level: 'Advanced Level',
          achievementPoints: 1250,
          currentRank: 1,
          previousRank: 2,
          bio: 'Dedicated student focusing on complex Margam pieces.',
          activeStatus: true,
          isPublic: true,
          arangetramStatus: 'Preparing',
        },
      },
    },
    include: { studentProfile: true },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'keerthana@example.com' },
    update: {},
    create: {
      name: 'Keerthana S',
      email: 'keerthana@example.com',
      password: student1Pass,
      role: 'STUDENT',
      studentProfile: {
        create: {
          displayName: 'Keerthana',
          joiningYear: 2021,
          level: 'Senior Level',
          achievementPoints: 1120,
          currentRank: 2,
          previousRank: 2,
          activeStatus: true,
          isPublic: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'harini@example.com' },
    update: {},
    create: {
      name: 'Harini M',
      email: 'harini@example.com',
      password: student1Pass,
      role: 'STUDENT',
      studentProfile: {
        create: {
          displayName: 'Harini',
          joiningYear: 2022,
          level: 'Intermediate Level',
          achievementPoints: 980,
          currentRank: 3,
          previousRank: 4,
          activeStatus: true,
          isPublic: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  if (student1.studentProfile && student2.studentProfile && student3.studentProfile) {
    // 4. Create Verified Awards
    await prisma.award.create({
      data: {
        title: 'Best Classical Dance Performance',
        studentId: student1.studentProfile.id,
        competition: 'Natyanjali Festival',
        organization: 'Natyanjali Trust',
        year: 2026,
        date: new Date('2026-03-15T00:00:00Z'),
        position: '1st Place',
        category: 'Solo',
        competitionLevel: 'State',
        description: 'Awarded for exceptional Abhinaya and footwork.',
        verified: true,
      },
    });

    await prisma.award.create({
      data: {
        title: 'Outstanding Abhinaya Award',
        studentId: student2.studentProfile.id,
        competition: 'All India Dance Competition',
        year: 2025,
        date: new Date('2025-11-10T00:00:00Z'),
        position: '2nd Place',
        category: 'Solo',
        competitionLevel: 'National',
        verified: true,
      },
    });

    // Unverified award
    await prisma.award.create({
      data: {
        title: 'Participation in Cultural Fest',
        studentId: student3.studentProfile.id,
        competition: 'City Cultural Fest',
        year: 2026,
        position: 'Participation',
        category: 'Group',
        competitionLevel: 'District',
        verified: false,
      },
    });

    // 5. Create Performances
    const performance1 = await prisma.performance.create({
      data: {
        title: 'Annual Day Showcase 2026',
        date: new Date('2026-09-20T18:00:00Z'),
        location: 'Kamarajar Arangam, Chennai',
        description: 'The spectacular annual showcase featuring all academy students.',
        type: 'Annual Day',
        photos: '[]',
        featured: true,
      },
    });

    await prisma.studentPerformance.create({
      data: {
        studentId: student1.studentProfile.id,
        performanceId: performance1.id,
      }
    });

    await prisma.studentPerformance.create({
      data: {
        studentId: student2.studentProfile.id,
        performanceId: performance1.id,
      }
    });
    
    // 6. Create Events
    await prisma.event.create({
      data: {
        title: 'Bharatanatyam Workshop',
        date: new Date('2026-10-05T00:00:00Z'),
        time: '10:00 AM - 4:00 PM',
        location: 'Academy Main Hall',
        description: 'An intensive workshop on advanced Adavus and Abhinaya.',
        published: true,
        featured: true,
      }
    });
    
    // 7. Create Testimonials
    await prisma.testimonial.create({
      data: {
        name: 'Priya K.',
        role: 'Parent',
        content: 'Training here has transformed my daughter\'s confidence and discipline while helping her deeply connect with Bharatanatyam.',
        published: true,
      }
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
