import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dairyflow.basnetsameer.com.np";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/(auth)/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
