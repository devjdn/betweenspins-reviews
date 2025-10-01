import Background from "@/components/gradients/mesh";
import OnboardingFlow from "@/components/ui/onboarding/onboarding-flow";
import { auth } from "@clerk/nextjs/server";
import ReactQueryProvider from "../ReactQueryProvider";

export default async function OnboardingPage() {
    const { userId, redirectToSignIn } = await auth();

    if (userId) {
        return (
            <ReactQueryProvider>
                <div className="space-y-16 grid flex-1 md:place-items-center w-full pt-16 px-4 md:px-8">
                    {/* <Background /> */}

                    <OnboardingFlow clerkUserId={userId} />
                </div>
            </ReactQueryProvider>
        );
    } else {
        redirectToSignIn();
    }
}
