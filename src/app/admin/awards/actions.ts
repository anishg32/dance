"use server";

import prisma from "@/lib/prisma";
import { calculateStudentRankings } from '@/lib/rankingEngine';
import { revalidatePath } from 'next/cache';



export async function toggleAwardVerification(awardId: string, currentStatus: boolean) {
  try {
    // Toggle the verification status
    await prisma.award.update({
      where: { id: awardId },
      data: { verified: !currentStatus }
    });

    // Run the ranking recalculation (which updates points and ranks in DB)
    await calculateStudentRankings();
    
    // Revalidate paths to reflect updated rankings immediately
    revalidatePath('/admin/awards');
    revalidatePath('/admin/students');
    revalidatePath('/rankings');
    revalidatePath('/achievements');
    revalidatePath('/', 'layout'); // Revalidates the entire app (including all dynamic student pages)
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling award verification:', error);
    return { success: false, error: 'Failed to update verification status' };
  }
}
