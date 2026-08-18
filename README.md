# DairyFlow - Milk Dairy Sales Tracker & Analytics

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM_7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)

**DairyFlow** is a modern, production-ready web application designed for dairy farmers and milk sellers to digitally record daily milk sales, track gross earnings in Nepalese Rupees (NPR), and analyze milk fat quality trends over time. It replaces traditional paper receipts with an intuitive, green-themed digital dashboard.

---

## 🌟 Key Features

### 1. Main Dashboard (`/dashboard`)
* **Summary Cards**: Immediate statistics for **Total Milk Sold (L)**, **Total Earnings (NPR)**, **Average Price per Litre**, and **Average Fat Content (%)**.
* **Interactive Chart.js Visualizations**: Responsive line chart with toggle switches to visualize volume (L), revenue (NPR), or fat percentage over time.
* **Date Range Filtering**: Quick preset filters (*Today*, *Last 7 Days*, *Last 30 Days*, *This Month*, *Last Month*, *This Year*, and *Custom Range*).
* **Recent Milk Sales**: Quick view of recent receipts with direct navigation to the full ledger.

### 2. Records Management & CSV Tools (`/records`)
* **Searchable Data Table**: Search entries by date, volume, or monetary amount with pagination.
* **CSV Export**: Export active sales records into a clean `.csv` file (`milk_sales_records_YYYY-MM-DD.csv`).
* **CSV Import**: Drag-and-drop CSV importer with downloadable sample templates and live row validation preview before saving to PostgreSQL.
* **Add & Edit Records (`/records/new`, `/records/[id]/edit`)**: Live calculation of `Total Amount = Litres × Price/L` with manual adjustment support for dairy rounding.
* **Safe Deletion**: Deletion dialog requiring explicit user confirmation with record summaries.

### 3. Deep Analytics & Fat Trends (`/analytics`)
* Highlights **Highest Single Volume Sale**, **Highest Earning Day in NPR**, and **Average Daily Volume**.
* 3 Dedicated Chart.js graphs:
  1. *Milk Volume Over Time (L)*
  2. *Daily Earnings Over Time (NPR)*
  3. *Milk Fat Quality Percentage Over Time (%)*

### 4. Authentication & Security
* Powered by **Clerk** authentication.
* **Strict Server Scoping**: Every database operation verifies `userId` on the server using `await auth()`. Users can never view or modify records belonging to other users.
* **Local Dev Mode Fallback**: Runs smoothly in local preview mode even before Clerk production keys are configured.

### 5. Financial Precision
* Uses `Decimal.js` and Prisma `Decimal` types to ensure safe financial math without JavaScript floating-point rounding bugs.

### 6. SEO & PWA Ready
* Dynamic XML sitemap (`/sitemap.xml`), crawler directives (`/robots.txt`), web manifest (`/manifest.webmanifest`), OpenGraph metadata, Twitter Cards, and Schema.org `WebApplication` JSON-LD structured data.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16 (App Router, Turbopack, React 19)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 with custom agricultural green theme
* **Database**: PostgreSQL
* **ORM**: Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`)
* **Auth**: Clerk (`@clerk/nextjs`)
* **Charts**: Chart.js (`chart.js`, `react-chartjs-2`)
* **Icons**: Lucide React
* **Validation**: Zod + React Hook Form
* **Toasts**: Sonner

---

## 📁 Project Architecture

```text
milk-sales/
├── prisma/
│   └── schema.prisma         # Prisma ORM 7 database schema (MilkSale model)
├── src/
│   ├── app/
│   │   ├── (auth)/           # Clerk Sign-in & Sign-up pages
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/    # Main Dashboard page
│   │   │   ├── records/      # Records listing, CSV tools & forms
│   │   │   └── analytics/    # Deep analytics page
│   │   ├── globals.css       # Tailwind CSS & design system tokens
│   │   ├── layout.tsx        # Root Layout with ClerkProvider & SEO metadata
│   │   ├── page.tsx          # Landing Hero Page
│   │   ├── robots.ts         # Robots.txt generator
│   │   ├── sitemap.ts        # Sitemap.xml generator
│   │   └── manifest.ts       # Web app manifest generator
│   ├── components/
│   │   ├── analytics/        # Analytics summary & charts
│   │   ├── dashboard/        # Summary cards, chart card, recent records
│   │   ├── layout/           # Sidebar, Header, DateRangePicker
│   │   └── records/          # Milk sale form, records table, CSV dialogs
│   ├── lib/
│   │   ├── actions/          # Server Actions for CRUD & aggregations
│   │   ├── validations/      # Zod validation schemas
│   │   ├── clerk-config.ts   # Clerk environment key validator
│   │   ├── prisma.ts         # Prisma Client singleton
│   │   └── utils.ts          # Currency, volume, date & Decimal helpers
│   └── proxy.ts              # Next.js 16 Middleware for protected routes
├── .env.example              # Environment variables template
├── prisma.config.ts          # Prisma 7 configuration file
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- PostgreSQL database running locally or hosted (e.g. Neon, Supabase, Railway)

### 2. Environment Variables Setup
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your `.env` variables:

```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/milk_sales?schema=public"

# Clerk Authentication Keys (Get keys from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Redirect Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Prisma Generation
Generate the Prisma client:

```bash
npx prisma generate
```

Push schema to your PostgreSQL database:

```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 📊 CSV Import & Export Format

When exporting or importing records via CSV, the file must use the following column header structure:

```csv
Date,Litres,PricePerLitre,TotalAmount,Fat
2026-08-18,18.50,65.00,1202.50,4.2
2026-08-17,17.80,65.00,1157.00,4.1
2026-08-16,19.20,66.00,1267.20,4.3
```

---

## 📜 License

This project is licensed under the MIT License.
