import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DairyFlow - Milk Dairy Sales Tracker",
    short_name: "DairyFlow",
    description: "Digitally record daily milk sales, track total revenue in NPR, and monitor fat percentage trends for farmers and dairy sellers.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#15803d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
