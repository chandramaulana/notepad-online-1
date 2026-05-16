import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://notepad.iote.my.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/:slug"],
        disallow: ["/api/"]
      }
    ],
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl
  };
}
