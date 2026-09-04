'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";



export async function updateParentProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = formData.get('userId') as string;

  if (!session || !session.user || (session.user as any).id !== userId) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;

  // Since we only allow changing the name for parent:
  await prisma.user.update({
    where: { id: userId },
    data: { name }
  });

  revalidatePath('/dashboard/parent/profile');
  revalidatePath('/dashboard/parent');
}
