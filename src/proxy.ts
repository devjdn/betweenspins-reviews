import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Routes that should only be accessible to non-signed-in users
const isSignedOutOnly = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
]);

// Routes that should only be accessible to signed-in users
const isProtectedRoute = createRouteMatcher([
    "/profile(.*)",
    "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
    const { userId, sessionClaims } = await auth();
    const onboardingStatus =
        sessionClaims?.metadata.onboardingStatus ?? "not_started";

    // If user is signed in and trying to access signed out pages, redirect to feed
    if (userId && isSignedOutOnly(req)) {
        return NextResponse.redirect(new URL("/feed", req.url));
    }

    // If user is not signed in and trying to access protected routes, redirect to sign-in
    if (!userId && isProtectedRoute(req)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Catch users who have not started onboarding yet
    // Redirect them to the /onboarding route to complete onboarding
    if (
        userId &&
        onboardingStatus === "not_started" &&
        !req.nextUrl.pathname.startsWith("/onboarding")
    ) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Allow all other requests to proceed
    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
