"use server";

import prisma from "@/lib/prisma";
import { calculateStudentRankings } from '@/lib/rankingEngine';
import { revalidatePath } from 'next/cache';



export async function forceRecalculateRankings() {
  try {
    await calculateStudentRankings();
    
    // Revalidate paths to reflect updated rankings immediately
    revalidatePath('/admin/rankings');
    revalidatePath('/admin/students');
    revalidatePath('/rankings');
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Error recalculating rankings:', error);
    return { success: false, error: 'Failed to recalculate rankings' };
  }
}

export async function updateRankingSettings(formData: FormData) {
  try {
    const values = [
      { key: '1st Place', points: parseInt(formData.get('points1stPlace') as string, 10) },
      { key: '2nd Place', points: parseInt(formData.get('points2ndPlace') as string, 10) },
      { key: '3rd Place', points: parseInt(formData.get('points3rdPlace') as string, 10) },
      { key: 'Participation', points: parseInt(formData.get('pointsParticipation') as string, 10) },
      { key: 'Performance', points: parseInt(formData.get('pointsPerformance') as string, 10) },
    ];

    for (const v of values) {
      await prisma.rankingSettings.upsert({
        where: { key: v.key },
        update: { points: v.points },
        create: { key: v.key, points: v.points }
      });
    }

    // Must recalculate after updating points
    await calculateStudentRankings();
    
    revalidatePath('/admin/rankings');
    revalidatePath('/rankings');
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating ranking settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
