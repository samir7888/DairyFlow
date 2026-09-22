import Link from "next/link";
import {
  Milk,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  FileSpreadsheet,
  CalendarRange,
  Droplets,
  CheckCircle2,
  ChevronDown,
  Star,
  Zap,
  Download,
  Upload,
  BookOpen,
} from "lucide-react";

// ─── Static Data ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Milk,
    title: "Fast Daily Invoice Logging",
    description:
      "Record date, volume in litres, price per litre, and milk fat percentage in seconds. Total NPR amount is calculated automatically — no manual math needed.",
    keywords: "milk sales log, dairy invoice, daily milk record",
  },
  {
    icon: BarChart3,
    title: "Visual Sales & Fat Charts",
    description:
      "Interactive line charts show daily earnings, average price per litre, and fat quality trends over any date range — today, last 30 days, or a custom period.",
    keywords: "dairy analytics chart, milk sales trend, fat percentage graph",
  },
  {
    icon: ShieldCheck,
    title: "Secure User Isolation",
    description:
      "Your financial and production records are encrypted and strictly scoped to your authenticated account. No one else can view or modify your dairy data.",
    keywords: "secure dairy app, private milk records, encrypted dairy data",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV Export & Import",
    description:
      "Export your entire sales ledger as a .csv file compatible with Excel and Google Sheets. Import old records via drag-and-drop with live row validation before saving.",
    keywords: "export milk records CSV, dairy excel export, import milk data",
  },
  {
    icon: CalendarRange,
    title: "Flexible Date Filtering",
    description:
      "Filter your dashboard by Today, Last 7 Days, Last 30 Days, This Month, Last Month, This Year, or a fully custom date range for precise reporting.",
    keywords: "milk sales date filter, dairy monthly report, date range analytics",
  },
  {
    icon: Droplets,
    title: "Milk Fat Quality Tracking",
    description:
      "Monitor fat percentage trends over time with a dedicated analytics chart. Identify seasonal quality shifts and compare averages to optimize your dairy output.",
    keywords: "milk fat tracker, fat percentage trend, dairy quality monitoring",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Sign Up for Free",
    description:
      "Create your account in under a minute — no credit card required. DairyFlow is 100% free for dairy farmers and milk sellers.",
    icon: Star,
  },
  {
    step: "02",
    title: "Log Your Daily Milk Sales",
    description:
      "Enter the date, litres sold, price per litre, and fat percentage. DairyFlow instantly calculates your total earnings in NPR.",
    icon: BookOpen,
  },
  {
    step: "03",
    title: "View Charts & Export Reports",
    description:
      "See your revenue, volume, and fat quality trends in interactive charts. Export to CSV for Excel or share with your cooperative.",
    icon: Download,
  },
];

const PAIN_POINTS = [
  "Losing paper receipts at the end of the day",
  "Manually calculating total NPR earnings every evening",
  "No way to see which days had the highest milk volume",
  "Forgetting to track fat percentage separately",
  "No backup when notebooks get damaged or lost",
  "Can't share reports with your dairy cooperative",
];

const STATS = [
  { value: "100%", label: "Free to Use" },
  { value: "6+", label: "Powerful Features" },
  { value: "NPR", label: "Native Currency Support" },
  { value: "0", label: "Paper Needed" },
];

const FAQS = [
  {
    question: "Is DairyFlow free to use?",
    answer:
      "Yes, DairyFlow is completely free. Sign up and start logging your milk sales immediately — no subscription fees, no hidden charges.",
  },
  {
    question: "Can I track milk fat percentage?",
    answer:
      "Yes. Every sales record includes a milk fat field. DairyFlow generates a dedicated fat quality trend chart so you can monitor your herd's output quality over time.",
  },
  {
    question: "Does DairyFlow work on mobile phones?",
    answer:
      "Yes. DairyFlow is fully responsive and works on any smartphone, tablet, or desktop browser. No app download is required.",
  },
  {
    question: "Can I export my records to Excel or CSV?",
    answer:
      "Yes. Use the one-click CSV export to download all your records as a spreadsheet compatible with Microsoft Excel, Google Sheets, or any spreadsheet software.",
  },
  {
    question: "Is my dairy data secure?",
    answer:
      "Yes. DairyFlow uses Clerk authentication to protect your account. All records are strictly isolated — no other user can see or access your dairy data.",
  },
  {
    question: "Can I import my old milk sales records?",
    answer:
      "Yes. DairyFlow includes a drag-and-drop CSV importer. Download the sample template, fill in your historical records, and upload them in one batch with live row validation before saving.",
  },
  {
    question: "Does DairyFlow support Nepali Rupees (NPR)?",
    answer:
      "Yes. DairyFlow natively tracks all earnings and prices in NPR. Calculations use financial-grade precision to avoid rounding errors common in regular calculators.",
  },
  {
    question: "What is the CSV import format?",
    answer:
      "The CSV must have the following columns: Date, Litres, PricePerLitre, TotalAmount, Fat. You can download a sample template from inside the app's Records page.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* ── Header ── */}
      <header
        className="border-b border-emerald-900/40 bg-slate-950/80 backdrop-blur sticky top-0 z-50"
        role="banner"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Milk className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">DairyFlow</span>
          </div>
          <nav aria-label="Main navigation" className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-emerald-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md shadow-emerald-950 transition-all flex items-center gap-1.5"
            >
              Get Started Free <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <main role="main">
        {/* ── Hero Section ── */}
        <section
          aria-labelledby="hero-heading"
          className="max-w-6xl mx-auto px-4 pt-20 pb-16 flex flex-col justify-center items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> Free Dairy Farm Management Software
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight sm:leading-tight"
          >
            Replace Paper Notebooks with Digital{" "}
            <span className="text-emerald-400">Dairy Farm Management</span>
          </h1>

          <p className="mt-6 text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Log daily litres sold, price per litre, fat percentage, and total earnings in NPR.
            Get instant charts, CSV export, and complete milk sales analytics — completely free for dairy farmers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/sign-up"
              id="cta-signup-hero"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2"
            >
              Start Free — No Card Required <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              href="/sign-in"
              id="cta-signin-hero"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl transition-all flex items-center justify-center"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Trust Badge Row */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            {["100% Free", "No Credit Card", "Works on Mobile", "Data Secure with Clerk"].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats Banner ── */}
        <section
          aria-label="DairyFlow key statistics"
          className="bg-emerald-950/40 border-y border-emerald-900/30"
        >
          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-emerald-400">{value}</div>
                <div className="mt-1 text-sm text-slate-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pain Points / Why DairyFlow ── */}
        <section
          aria-labelledby="why-heading"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Problem */}
            <div>
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">
                Still Using Notebooks?
              </p>
              <h2 id="why-heading" className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                Every dairy farmer deserves a better system than paper
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Paper receipts get lost. Manual calculations are slow and error-prone. With no digital history, it's impossible to identify trends in your milk volume, revenue, or fat quality. DairyFlow solves all of this — for free.
              </p>
              <ul className="space-y-3" role="list" aria-label="Common dairy management problems">
                {PAIN_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" aria-hidden="true" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Solution card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900/80 border border-emerald-800/40 shadow-2xl shadow-emerald-950/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="font-bold text-lg text-white">Switch to DairyFlow in 5 minutes</span>
              </div>
              <ul className="space-y-4" role="list" aria-label="DairyFlow benefits">
                {[
                  "Instant total NPR calculation — no calculator needed",
                  "All records saved securely in the cloud",
                  "View trends for any date range at a glance",
                  "Export to Excel or Google Sheets anytime",
                  "Works on your phone, tablet, or computer",
                  "Completely free — no monthly fees ever",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-slate-200 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/sign-up"
                  id="cta-signup-why"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950"
                >
                  Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section
          aria-labelledby="how-heading"
          className="bg-slate-900/50 border-y border-slate-800/60 py-20"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple Setup</p>
              <h2 id="how-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
                How DairyFlow Works
              </h2>
              <p className="mt-4 text-slate-400 max-w-xl mx-auto">
                From sign-up to your first chart — in under 5 minutes. No technical knowledge required.
              </p>
            </div>

            <ol
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              aria-label="Steps to get started with DairyFlow"
            >
              {HOW_IT_WORKS.map(({ step, title, description, icon: Icon }, index) => (
                <li key={step} className="relative flex flex-col items-start">
                  {/* Connector line */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-gradient-to-r from-emerald-800/60 to-transparent" aria-hidden="true" />
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-4xl font-black text-emerald-900 select-none">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Feature Deep Dive ── */}
        <section
          aria-labelledby="features-heading"
          className="max-w-6xl mx-auto px-4 py-20"
        >
          <div className="text-center mb-14">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Complete Dairy Farm Management — Free
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              DairyFlow combines a digital milk sales ledger, analytics dashboard, and CSV tools into one simple app designed for Nepal&apos;s dairy farmers and milk sellers.
            </p>
          </div>

          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="DairyFlow features"
          >
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CSV Import/Export Callout ── */}
        <section
          aria-labelledby="csv-heading"
          className="bg-gradient-to-br from-emerald-950/50 to-slate-950 border-y border-emerald-900/30 py-16"
        >
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">CSV Tools</p>
              <h2 id="csv-heading" className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Import your old records. Export anytime to Excel.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                Already have records in a notebook or spreadsheet? Use DairyFlow&apos;s drag-and-drop CSV importer to bring all your historical data in at once. Every record is validated before saving. Export to CSV at any time for backup or sharing with your dairy cooperative.
              </p>
              <Link
                href="/sign-up"
                id="cta-signup-csv"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-sm"
              >
                Try DairyFlow Free <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Download, title: "CSV Export", desc: "Download all records as Excel-compatible CSV in one click." },
                { icon: Upload, title: "CSV Import", desc: "Drag-and-drop to import historical records with live validation." },
                { icon: FileSpreadsheet, title: "Excel Compatible", desc: "Open your exported file in Excel, Google Sheets, or LibreOffice." },
                { icon: CheckCircle2, title: "Row Validation", desc: "Every imported row is previewed and validated before it is saved." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
                  <Icon className="w-5 h-5 text-emerald-400 mb-2" aria-hidden="true" />
                  <div className="text-sm font-semibold text-white mb-1">{title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section
          aria-labelledby="faq-heading"
          className="max-w-4xl mx-auto px-4 py-20"
        >
          <div className="text-center mb-12">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Everything dairy farmers and milk sellers need to know before getting started with DairyFlow.
            </p>
          </div>

          <dl className="space-y-3">
            {FAQS.map(({ question, answer }, i) => (
              <div
                key={question}
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 overflow-hidden"
              >
                <details className="group" name="faq">
                  <summary
                    id={`faq-q-${i}`}
                    className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none text-white font-semibold text-sm sm:text-base hover:bg-slate-800/40 transition-colors"
                    aria-expanded="false"
                  >
                    <dt>{question}</dt>
                    <ChevronDown
                      className="w-4 h-4 text-emerald-400 shrink-0 ml-4 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <dd
                    id={`faq-a-${i}`}
                    className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-4"
                  >
                    {answer}
                  </dd>
                </details>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Final CTA Banner ── */}
        <section
          aria-labelledby="cta-heading"
          className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-emerald-950/60 border-y border-emerald-900/30 py-20"
        >
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto mb-6">
              <Milk className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to manage your dairy farm digitally?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join dairy farmers and milk sellers who have replaced paper notebooks with DairyFlow. Free, secure, and ready in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                id="cta-signup-bottom"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/sign-in"
                id="cta-signin-bottom"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl transition-all flex items-center justify-center"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t border-slate-800/60 py-12 text-slate-500 text-sm"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Milk className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                <span className="font-bold text-white text-base">DairyFlow</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Free dairy farm management software for milk sellers and dairy farmers. Log sales, track fat quality, and export records — all in NPR.
              </p>
            </div>
            {/* Product links */}
            <nav aria-label="Product navigation" className="space-y-2">
              <p className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-3">Product</p>
              {[
                { href: "/dashboard", label: "Milk Sales Dashboard" },
                { href: "/records", label: "Sales Records Ledger" },
                { href: "/analytics", label: "Dairy Analytics" },
                { href: "/records/new", label: "Add New Sale Record" },
              ].map(({ href, label }) => (
                <div key={href}>
                  <Link href={href} className="text-slate-500 hover:text-emerald-400 transition-colors text-xs block">
                    {label}
                  </Link>
                </div>
              ))}
            </nav>
            {/* Keywords / Info */}
            <div>
              <p className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-3">For Dairy Farmers</p>
              <ul className="space-y-1.5" aria-label="Key features">
                {[
                  "Daily Milk Sales Tracker",
                  "NPR Revenue Calculator",
                  "Milk Fat Quality Monitor",
                  "CSV Export for Excel",
                  "Dairy Invoice Manager",
                  "Livestock Sales Ledger",
                ].map((item) => (
                  <li key={item} className="text-slate-500 text-xs flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-700" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} DairyFlow — Free Dairy Farm Management Software. All rights reserved.</span>
            <span className="text-slate-600">Built for Milk Sellers &amp; Dairy Farmers in Nepal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
