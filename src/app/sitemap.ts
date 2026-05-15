import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1
    }
  ];

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
    return staticRoutes;
  }

  const noteRoutes: MetadataRoute.Sitemap = latestNotes.map((note) => ({
    url: `${appUrl}/${note.slug}`,
    lastModified: note.updatedAt,
    changeFrequency: "daily",
    priority: 0.7
  }));

  return [...staticRoutes, ...noteRoutes];
}
