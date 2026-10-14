import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { LogoMark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your DairyFlow account to access your milk selling invoices and analytics dashboard.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <LogoMark className="mb-3 h-12 w-12" />
        <h1 className="text-2xl font-bold text-ink">DairyFlow</h1>
        <p className="mt-1 max-w-sm text-sm text-brand-700">Sign in to keep your milk ledger up to date.</p>
      </div>
      <SignIn
        appearance={{
          variables: { colorPrimary: "#1b2f4b", colorForeground: "#1b2f4b", borderRadius: "0.5rem" },
          elements: {
            card: "shadow-none border border-brand-200",
            footerActionLink: "text-brand-700 hover:text-ink",
          },
        }}
      />
    </div>
  );
}
