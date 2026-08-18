import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { Milk } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free DairyFlow account to start digitally logging daily milk sales and tracking revenue.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 flex flex-col items-center justify-center p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 backdrop-blur border border-emerald-400/30 flex items-center justify-center mb-3 shadow-lg shadow-emerald-950/50">
          <Milk className="w-8 h-8 text-emerald-300" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create your DairyFlow Account</h1>
        <p className="text-emerald-200/80 text-sm mt-1 max-w-sm">
          Start recording daily milk invoices & tracking income in NPR
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            card: "shadow-2xl border border-emerald-800/40 bg-zinc-900/90 text-white backdrop-blur",
            headerTitle: "text-white font-semibold text-xl",
            headerSubtitle: "text-emerald-200/70",
            socialButtonsBlockButton:
              "border-emerald-700/50 bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/50",
            formButtonPrimary:
              "bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950",
            footerActionLink: "text-emerald-400 hover:text-emerald-300",
            formFieldLabel: "text-emerald-100",
            formFieldInput:
              "bg-emerald-950/60 border-emerald-800/60 text-white focus:border-emerald-500 focus:ring-emerald-500",
          },
        }}
      />
    </div>
  );
}
