import { clerkMiddleware } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk-config";

export default clerkMiddleware(async (auth, req) => {
  // If Clerk keys are not configured, allow all routes for local development preview
  if (!isClerkConfigured()) {
    return;
  }

  const { userId, redirectToSignIn } = await auth();
  const url = new URL(req.url);

  const isProtected =
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/records") ||
    url.pathname.startsWith("/analytics");

  if (isProtected && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|ttf|woff2?|ico|png|jpg|jpeg|gif|svg|webp|csv|docx?|xlsx?|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};
