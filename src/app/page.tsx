import Link from "next/link";
import { Milk, ArrowRight, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

export default async function HomePage() {


  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Navigation */}
      <header className="border-b border-emerald-900/40 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Milk className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">DairyFlow</span>
          </div>
          <div className="flex items-center gap-3">
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
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <TrendingUp className="w-3.5 h-3.5" /> Built for Milk Sellers & Dairy Farmers
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight sm:leading-tight">
          Replace Paper Invoices with Digital <span className="text-emerald-400">Milk Dairy Analytics</span>
        </h1>

        <p className="mt-6 text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
          Log daily litres sold, price per litre, fat percentage, and total earnings in NPR. Get instant visualization of your sales trends over time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-2"
          >
            Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/sign-in"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl transition-all flex items-center justify-center"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Value Proposition Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Milk className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fast Daily Invoice Logging</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Easily record date, volume in litres, price, and milk fat percentage with auto-calculated total NPR amounts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Visual Sales & Fat Charts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Analyze daily earnings, average price per litre, and fat quality trends using responsive interactive line charts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Strict User Isolation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your financial and production records are encrypted and strictly isolated to your Clerk authenticated user account.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 py-6 text-center text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} DairyFlow Milk Sales Tracker. All rights reserved.</span>
          <span>Designed for Milk Sellers & Dairy Farmers</span>
        </div>
      </footer>
    </div>
  );
}
