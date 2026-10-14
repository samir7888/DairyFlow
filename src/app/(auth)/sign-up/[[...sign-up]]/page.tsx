import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { LogoMark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free DairyFlow account to start digitally logging daily milk sales and tracking revenue.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <LogoMark className="mb-3 h-12 w-12" />
        <h1 className="text-2xl font-bold text-ink">DairyFlow</h1>
        <p className="mt-1 max-w-sm text-sm text-brand-700">Create a free account to start your milk ledger.</p>
      </div>
      <SignUp
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
