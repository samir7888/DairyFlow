import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { KeyRound } from "lucide-react";
import { isClerkConfigured } from "@/lib/clerk-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dairyflow.app";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DairyFlow | Milk Dairy Sales Tracker & Analytics",
    template: "%s | DairyFlow",
  },
  description:
    "Digitally record daily milk sales, track total revenue in NPR, and monitor fat percentage trends for farmers and dairy sellers.",
  keywords: [
    "Milk Sales Tracker",
    "Dairy Management Software",
    "Milk Fat Analytics",
    "Dairy Seller Dashboard",
    "Nepal Milk Price Calculator",
    "Dairy Invoice Manager",
  ],
  authors: [{ name: "DairyFlow Team" }],
  creator: "DairyFlow",
  publisher: "DairyFlow",
  applicationName: "DairyFlow",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "DairyFlow",
    title: "DairyFlow | Milk Dairy Sales Tracker & Analytics",
    description:
      "Digitally record daily milk sales, track total revenue in NPR, and monitor fat percentage trends for farmers and dairy sellers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DairyFlow | Milk Dairy Sales Tracker & Analytics",
    description:
      "Digitally record daily milk sales, track total revenue in NPR, and monitor fat percentage trends for farmers and dairy sellers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConfigured = isClerkConfigured();
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // JSON-LD Structured Data (Schema.org WebApplication)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DairyFlow",
    alternateName: "Milk Dairy Sales Tracker",
    url: baseUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    description:
      "Digital milk selling ledger & analytics platform for farmers and dairy sellers to record volume, price, fat percentage, and total earnings in NPR.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  const bodyContent = (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {!isConfigured && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 border-b border-amber-600 shadow-xs z-50">
            <KeyRound className="h-4 w-4 shrink-0" />
            <span>
              Clerk Auth Setup Notice: Running in Local Mode. Add your <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code> from <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="underline font-bold">dashboard.clerk.com</a> to <code>.env</code> to enable live multi-user sign in.
            </span>
          </div>
        )}
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );

  if (isConfigured && pubKey) {
    return <ClerkProvider publishableKey={pubKey}>{bodyContent}</ClerkProvider>;
  }

  return bodyContent;
}
