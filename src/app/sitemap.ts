import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BLOG_ENTRIES } from "@/app/blog/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1
    },
    {
      url: `${appUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    }
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_ENTRIES.map((entry) => ({
    url: `${appUrl}/blog/${entry.slug}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  let latestNotes: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    latestNotes = await prisma.note.findMany({
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 1000
    });
  } catch {
    return [...staticRoutes, ...blogRoutes];
  }

  const noteRoutes: MetadataRoute.Sitemap = latestNotes.map((note) => ({
    url: `${appUrl}/${note.slug}`,
    lastModified: note.updatedAt,
    changeFrequency: "daily",
    priority: 0.7
  }));

  return [...staticRoutes, ...blogRoutes, ...noteRoutes];
}
