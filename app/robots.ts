import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://visoryx.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/orders/",
          "/settings/",
          "/auth/callback",
          "/auth/error",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/orders/", "/settings/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
