import OnboardingFlow from "@/components/ui/onboarding/onboarding-flow";
import { auth } from "@clerk/nextjs/server";

export default async function OnboardingPage() {
    const { userId, redirectToSignIn } = await auth();

    if (userId) {
        return (
            <div className="space-y-16 grid flex-1 md:place-items-center w-full pt-16 px-4 md:px-8">
                <OnboardingFlow clerkUserId={userId} />
            </div>
        );
    } else {
        redirectToSignIn();
    }
}
