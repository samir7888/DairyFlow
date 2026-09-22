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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dairyflow.basnetsameer.com.np";

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DairyFlow | Free Dairy Farm Management & Milk Sales Tracker",
    template: "%s | DairyFlow",
  },
  description:
    "Free dairy farm management software. Log daily milk sales, track revenue in NPR, monitor milk fat percentage, and visualize trends. Built for dairy farmers and milk sellers in Nepal.",
  keywords: [
    // Core product terms
    "Milk Sales Tracker",
    "Dairy Management Software",
    "Dairy Farm Management App",
    "Free Dairy Software",
    "Milk Ledger App",
    "Digital Milk Diary",
    // Feature-specific
    "Milk Fat Analytics",
    "Milk Fat Percentage Tracker",
    "Dairy Seller Dashboard",
    "Dairy Invoice Manager",
    "Milk Sales Analytics",
    "CSV Milk Records Export",
    // Location / language
    "Nepal Milk Price Calculator",
    "NPR Dairy Earnings Tracker",
    "Dairy Software Nepal",
    "दूध बिक्री ट्र्याकर",
    // Long-tail
    "how to track daily milk sales",
    "replace paper milk receipts digital",
    "dairy farm income tracker online",
    "milk volume and fat quality monitoring",
    "livestock milk sales record keeping",
  ],
  authors: [{ name: "DairyFlow Team" }],
  creator: "DairyFlow",
  publisher: "DairyFlow",
  applicationName: "DairyFlow",
  category: "Business & Productivity",
  alternates: {
    canonical: baseUrl,
  },
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
    title: "DairyFlow | Free Dairy Farm Management & Milk Sales Tracker",
    description:
      "Log daily milk sales, track revenue in NPR, and monitor fat percentage trends. Free digital ledger for dairy farmers and milk sellers.",
    url: baseUrl,
    siteName: "DairyFlow",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "DairyFlow - Free Dairy Farm Management & Milk Sales Tracker",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DairyFlow | Free Dairy Farm Management & Milk Sales Tracker",
    description:
      "Log daily milk sales, track revenue in NPR, and monitor fat percentage trends. Free digital ledger for dairy farmers and milk sellers.",
    images: [`${baseUrl}/opengraph-image.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConfigured = isClerkConfigured();
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // JSON-LD Structured Data
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DairyFlow",
    alternateName: ["Milk Dairy Sales Tracker", "Dairy Farm Management App", "दूध बिक्री ट्र्याकर"],
    url: baseUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires a modern web browser.",
    description:
      "Free digital milk selling ledger and analytics platform for dairy farmers and milk sellers to record daily volume in litres, price per litre, fat percentage, and total earnings in NPR. Replaces paper invoices with real-time charts and CSV export.",
    featureList: [
      "Daily milk sales logging",
      "Revenue tracking in NPR",
      "Milk fat percentage monitoring",
      "Interactive sales charts",
      "CSV import and export",
      "Date range analytics",
      "Secure multi-user authentication",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
      availability: "https://schema.org/InStock",
    },
    creator: {
      "@type": "Organization",
      name: "DairyFlow",
      url: baseUrl,
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DairyFlow",
    url: baseUrl,
    description: "DairyFlow builds free digital tools for dairy farmers and milk sellers to track sales, revenue, and milk quality.",
    foundingDate: "2026",
    areaServed: "NP",
    serviceType: "Dairy Farm Management Software",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is DairyFlow free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, DairyFlow is completely free. Sign up and start logging your milk sales immediately with no subscription fees.",
        },
      },
      {
        "@type": "Question",
        name: "Can I track milk fat percentage in DairyFlow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every sales record includes a milk fat percentage field. DairyFlow generates dedicated fat quality trend charts so you can monitor your herd's output quality over time.",
        },
      },
      {
        "@type": "Question",
        name: "Does DairyFlow work on mobile phones?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DairyFlow is fully responsive and works on any smartphone, tablet, or desktop browser without needing to install an app.",
        },
      },
      {
        "@type": "Question",
        name: "Can I export my milk sales records to Excel or CSV?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DairyFlow lets you export all your records as a CSV file that can be opened in Microsoft Excel, Google Sheets, or any spreadsheet software.",
        },
      },
      {
        "@type": "Question",
        name: "Is my dairy sales data secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DairyFlow uses Clerk authentication to protect your account, and all records are strictly isolated to your user account. No other user can see or access your data.",
        },
      },
      {
        "@type": "Question",
        name: "Can I import my old milk sales records into DairyFlow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. DairyFlow includes a drag-and-drop CSV importer. Download the sample template, fill in your past records, and upload them in one batch.",
        },
      },
    ],
  };

  const bodyContent = (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
    return (
      <ClerkProvider
        publishableKey={pubKey}
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        {bodyContent}
      </ClerkProvider>
    );
  }

  return bodyContent;
}
