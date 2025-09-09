"use client";

import React from "react";
import { addBioFromOnboarding } from "@/app/onboarding/_actions";
import BioStep from "./bio-step";

export type OnboardingStep = "intro" | "bio" | "favourite_artists" | "end";

interface OnboardingFlowProps {
    clerkUserId: string;
}

export default function OnboardingFlow({ clerkUserId }: OnboardingFlowProps) {
    const [onboardingStep, setOnboardingStep] =
        React.useState<OnboardingStep>("intro");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleBioComplete = async (bio: string) => {
        setIsLoading(true);

        try {
            await addBioFromOnboarding(clerkUserId, bio);

            setOnboardingStep("favourite_artists");
        } catch (error) {
            console.error("Failed to update bio:", error);
            // Handle error (show toast, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    const getProgress = () => {
        switch (onboardingStep) {
            case "intro":
                return 0;
            case "bio":
                return 33;
            case "favourite_artists":
                return 66;
            case "end":
                return 100;
            default:
                return 0;
        }
    };

    return (
        <div className="rounded-lg bg-background/60 backdrop-blur-md backdrop-saturate-100 p-2 flex flex-col gap-4 w-full">
            {onboardingStep === "intro" ? (
                <div></div>
            ) : onboardingStep === "bio" ? (
                <BioStep onComplete={handleBioComplete} isLoading={isLoading} />
            ) : onboardingStep === "favourite_artists" ? (
                <div></div>
            ) : onboardingStep === "end" ? (
                <div></div>
            ) : null}
        </div>
    );
}
