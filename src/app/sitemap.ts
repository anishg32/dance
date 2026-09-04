import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";


const BASE_URL = 'https://natyakshethram.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/about',
    '/training',
    '/students',
    '/rankings',
    '/achievements',
    '/performances',
    '/arangetram',
    '/gallery',
    '/events',
    '/admissions',
    '/contact',
  ];

  const staticSitemap = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add dynamic student profiles
  const students = await prisma.studentProfile.findMany({
    where: { activeStatus: true, isPublic: true },
    select: { id: true, updatedAt: true }
  });

  const studentUrls = students.map((s) => ({
    url: `${BASE_URL}/students/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticSitemap, ...studentUrls];
}
