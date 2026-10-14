import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { formatNepaliDate } from "@/lib/utils";

// ─── Content ────────────────────────────────────────────────────────────────

// Example ledger shown in the hero. Dates are real AD days, shown in BS.
const SAMPLE_ENTRIES = [
  { date: "2026-10-08", litres: 22.5, fat: 4.1, rate: 76 },
  { date: "2026-10-09", litres: 24, fat: 4.2, rate: 76 },
  { date: "2026-10-10", litres: 21, fat: 3.9, rate: 74 },
  { date: "2026-10-11", litres: 25.5, fat: 4.3, rate: 78 },
  { date: "2026-10-12", litres: 23, fat: 4.0, rate: 76 },
  { date: "2026-10-13", litres: 24.5, fat: 4.2, rate: 78 },
];

const COMPARISON = [
  ["Total for the day", "Calculator, every evening", "Added up as you enter litres and rate"],
  ["A slip goes missing", "That day is gone", "Every entry is saved to your account"],
  ["Best and worst days", "Flip back through pages", "One chart for any date range"],
  ["Fat percentage over time", "Written down, never compared", "Charted next to price"],
  ["Report for the cooperative", "Copied out by hand", "Downloaded as CSV for Excel or Sheets"],
];

const FEATURES = [
  {
    title: "Dates in Bikram Sambat",
    body: "Pick the day on a Nepali calendar. It is stored as the English date behind the scenes, so exports and reports keep working.",
  },
  {
    title: "One form for the day's milk",
    body: "Litres, fat and rate go in together. The amount in rupees is worked out for you.",
  },
  {
    title: "Charts for any period",
    body: "Earnings, average price and fat percentage for today, 7 days, 30 days, this month, this year, or dates you choose.",
  },
  {
    title: "CSV export and import",
    body: "Download the whole ledger for Excel or Google Sheets. Upload old records and check each row before saving.",
  },
  {
    title: "Private to your account",
    body: "Sign-in is handled by Clerk. Your records can only be opened from your account.",
  },
  {
    title: "Nothing to install",
    body: "Runs in the browser on any phone, tablet or computer.",
  },
];

const STEPS = [
  { title: "Create an account", body: "It takes a minute and costs nothing." },
  { title: "Enter each day's milk", body: "Pick the date, then litres, fat and rate." },
  { title: "Read the month", body: "Open the dashboard for totals and charts, or download the ledger." },
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

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const rows = SAMPLE_ENTRIES.map((e) => ({ ...e, amount: e.litres * e.rate }));
  const totalLitres = rows.reduce((s, r) => s + r.litres, 0);
  const totalAmount = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-marigold-300">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-5" role="banner">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-xl font-bold tracking-tight">DairyFlow</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-0.5 text-sm font-semibold sm:gap-1.5">
          <Link href="/sign-in" className="whitespace-nowrap rounded-lg px-2.5 py-2 hover:bg-brand-100 sm:px-3">
            Sign in
          </Link>
          <Link href="/sign-up" className="whitespace-nowrap rounded-lg bg-brand-800 px-3 py-2 text-white hover:bg-brand-700 sm:px-4">
            Create account
          </Link>
        </nav>
      </header>

      <main id="main" role="main">
        {/* ── Hero: the ledger is the picture ── */}
        <section aria-labelledby="hero-heading" className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
          <div className="min-w-0">
            <h1 id="hero-heading" className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
              Write the day&apos;s milk down once. The totals add themselves up.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-700">
              DairyFlow is a milk ledger for dairy farmers and sellers in Nepal. Enter litres, fat and rate; it
              works out the rupees, keeps every day by Nepali date, and shows you how the month is going.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/sign-up"
                id="cta-signup-hero"
                className="rounded-xl bg-brand-800 px-7 py-3.5 text-base font-semibold text-white hover:bg-brand-700"
              >
                Create free account
              </Link>
              <Link
                href="/sign-in"
                id="cta-signin-hero"
                className="text-base font-semibold underline decoration-marigold-500 decoration-2 underline-offset-4 hover:decoration-4"
              >
                Sign in to your ledger
              </Link>
            </div>
            <p className="mt-5 text-sm text-brand-500">Free to use. No card needed.</p>
          </div>

          {/* The khata */}
          <figure aria-label="Example milk ledger" className="min-w-0">
            <div className="relative overflow-hidden rounded-md border border-brand-200 bg-white shadow-[0_1px_0_#c8d3e2,0_18px_40px_-24px_rgba(27,47,75,0.45)]">
              <span aria-hidden="true" className="absolute inset-y-0 left-9 w-px bg-margin/70 sm:left-[3.25rem]" />
              <div className="overflow-x-auto">
              <table className="w-full min-w-0 border-collapse text-sm">
                <caption className="sr-only">Sample daily milk sales with total</caption>
                <thead>
                  <tr className="h-12 text-left text-brand-700">
                    <th scope="col" className="pl-12 sm:pl-[4.25rem] pr-2 font-semibold">मिति <span className="hidden font-normal text-brand-400 sm:inline">Date</span></th>
                    <th scope="col" className="px-2 text-right font-semibold">लिटर <span className="hidden font-normal text-brand-400 sm:inline">L</span></th>
                    <th scope="col" className="hidden px-2 text-right font-semibold sm:table-cell">फ्याट <span className="hidden font-normal text-brand-400 sm:inline">Fat</span></th>
                    <th scope="col" className="hidden px-2 text-right font-semibold sm:table-cell">दर <span className="hidden font-normal text-brand-400 sm:inline">Rate</span></th>
                    <th scope="col" className="pl-2 pr-4 text-right font-semibold">रकम <span className="hidden font-normal text-brand-400 sm:inline">NPR</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.date} className="h-10 border-t border-brand-100">
                      <td className="whitespace-nowrap pl-12 sm:pl-[4.25rem] pr-2">{formatNepaliDate(r.date)}</td>
                      <td className="px-2 text-right">{fmt(r.litres)}</td>
                      <td className="hidden px-2 text-right sm:table-cell">{r.fat.toFixed(1)}</td>
                      <td className="hidden px-2 text-right sm:table-cell">{r.rate}</td>
                      <td className="pl-2 pr-4 text-right font-semibold">{fmt(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="h-14 border-t-2 border-brand-800">
                    <th scope="row" className="pl-12 sm:pl-[4.25rem] pr-2 text-left font-bold">जम्मा <span className="hidden font-normal text-brand-400 sm:inline">Total</span></th>
                    <td className="px-2 text-right font-bold">{fmt(totalLitres)}</td>
                    <td className="hidden sm:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="pl-2 pr-4 text-right">
                      <span className="rounded-sm bg-marigold-300/70 px-2 py-1 text-base font-bold">
                        {fmt(totalAmount)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-brand-500">
              An example week. Every row is one day; the amount is litres times rate.
            </figcaption>
          </figure>
        </section>

        {/* ── Paper vs DairyFlow ── */}
        <section aria-labelledby="compare-heading" className="border-y border-brand-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 id="compare-heading" className="max-w-2xl text-3xl font-bold sm:text-4xl">
              The same khata, without the evening arithmetic
            </h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="border-b-2 border-brand-800 text-sm">
                    <td className="w-1/3 py-3 pr-3 sm:w-1/4"></td>
                    <th scope="col" className="w-[37%] py-3 pr-4 font-semibold text-brand-500">On paper</th>
                    <th scope="col" className="py-3 font-semibold">In DairyFlow</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(([what, paper, app]) => (
                    <tr key={what} className="border-b border-brand-100 align-top">
                      <th scope="row" className="py-4 pr-3 font-semibold sm:pr-4">{what}</th>
                      <td className="py-4 pr-3 text-brand-500 sm:pr-4">{paper}</td>
                      <td className="py-4 font-medium">{app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section aria-labelledby="features-heading" className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <h2 id="features-heading" className="text-3xl font-bold sm:text-4xl lg:sticky lg:top-8 lg:self-start">
              What DairyFlow does
            </h2>
            <dl className="grid gap-x-12 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="border-t border-brand-200 py-6">
                  <dt className="text-lg font-bold">{f.title}</dt>
                  <dd className="mt-2 leading-relaxed text-brand-700">{f.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Steps ── */}
        <section aria-labelledby="how-heading" className="border-y border-brand-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 id="how-heading" className="text-3xl font-bold sm:text-4xl">Getting started</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-brand-700">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-5 py-20">
          <h2 id="faq-heading" className="text-3xl font-bold sm:text-4xl">Questions</h2>
          <div className="mt-8 divide-y divide-brand-200 border-y border-brand-200">
            {FAQS.map(({ question, answer }) => (
              <details key={question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {question}
                  <span aria-hidden="true" className="text-xl leading-none text-brand-400 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-brand-700">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Closing ── */}
        <section aria-labelledby="cta-heading" className="bg-brand-800 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 md:flex-row md:items-center">
            <h2 id="cta-heading" className="max-w-xl text-3xl font-bold sm:text-4xl">
              Start this month&apos;s ledger today.
            </h2>
            <Link
              href="/sign-up"
              id="cta-signup-footer"
              className="rounded-xl bg-marigold-500 px-7 py-3.5 text-base font-bold text-brand-900 hover:bg-marigold-300"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-brand-500 sm:flex-row sm:items-center sm:justify-between" role="contentinfo">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6" />
          <span>DairyFlow, a milk ledger for Nepal</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/dashboard" className="hover:text-ink">Dashboard</Link>
          <Link href="/records" className="hover:text-ink">Records</Link>
          <Link href="/analytics" className="hover:text-ink">Analytics</Link>
          <Link href="/records/new" className="hover:text-ink">Add a record</Link>
        </nav>
      </footer>
    </div>
  );
}
