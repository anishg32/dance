'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";



export async function updateStudentProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = formData.get('userId') as string;

  if (!session || !session.user || (session.user as any).id !== userId) {
    throw new Error('Unauthorized');
  }

  const displayName = formData.get('displayName') as string;
  const bio = formData.get('bio') as string;
  const isPublic = formData.get('isPublic') === 'on';

  
  await prisma.studentProfile.update({
    where: { userId },
    data: {
      displayName,
      bio,
      isPublic
    }
  });

  revalidatePath('/dashboard/profile');
  revalidatePath('/students');
  revalidatePath('/dashboard');
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = formData.get('userId') as string;

  if (!session || !session.user || (session.user as any).id !== userId) {
    throw new Error('Unauthorized');
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    throw new Error('New passwords do not match.');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || !user.password) {
    throw new Error('User not found or has no password set.');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error('Current password is incorrect.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  revalidatePath('/dashboard/profile');
}
