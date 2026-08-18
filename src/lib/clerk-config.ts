/**
 * Utility helper to check if real Clerk keys are provided in .env
 */
export function isClerkConfigured(): boolean {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pubKey) return false;
  if (pubKey.includes("placeholder") || pubKey.includes("giraffe")) return false;
  if (!pubKey.startsWith("pk_test_") && !pubKey.startsWith("pk_live_")) return false;
  return pubKey.length >= 30;
}
