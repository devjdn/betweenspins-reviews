import Background from "@/components/gradients/mesh";
import OnboardingFlow from "@/components/ui/onboarding/onboarding-flow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const { userId, redirectToSignIn } = await auth();

    if (userId) {
        return (
            <div className="space-y-16 grid place-items-center w-full">
                <Background />

                <OnboardingFlow clerkUserId={userId} />
            </div>
        );
    } else {
        redirectToSignIn();
    }
}
