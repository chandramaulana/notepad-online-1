import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BLOG_ENTRIES } from "@/app/blog/content";
import { SEO_ENTRIES, SEO_HUBS } from "@/lib/programmatic-seo";

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

  const seoHubRoutes: MetadataRoute.Sitemap = SEO_HUBS.map((hub) => ({
    url: `${appUrl}${hub.path}`,
    lastModified: new Date(),
    changeFrequency: hub.changeFrequency,
    priority: hub.priority
  }));

  const seoEntryRoutes: MetadataRoute.Sitemap = Object.entries(SEO_ENTRIES).flatMap(([cluster, entries]) =>
    entries.map((entry) => ({
      url: `${appUrl}/${cluster}/${entry.slug}`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: "monthly" as const,
      priority: cluster === "compare" ? 0.76 : 0.78
    }))
  );

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
    return [...staticRoutes, ...blogRoutes, ...seoHubRoutes, ...seoEntryRoutes];
  }

  const noteRoutes: MetadataRoute.Sitemap = latestNotes.map((note) => ({
    url: `${appUrl}/${note.slug}`,
    lastModified: note.updatedAt,
    changeFrequency: "daily",
    priority: 0.7
  }));

  return [...staticRoutes, ...blogRoutes, ...seoHubRoutes, ...seoEntryRoutes, ...noteRoutes];
}
