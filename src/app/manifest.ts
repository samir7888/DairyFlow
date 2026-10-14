import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DairyFlow - Milk Dairy Sales Tracker",
    short_name: "DairyFlow",
    description: "Digitally record daily milk sales, track total revenue in NPR, and monitor fat percentage trends for farmers and dairy sellers.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f6f7f9",
    theme_color: "#1b2f4b",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
