"use client";

import React from "react";
import { addBioFromOnboarding } from "@/app/onboarding/_actions";
import BioStep from "./bio-step";
import IntroStep from "./intro-step";
import { Button } from "../button";
import { AnimatePresence } from "motion/react";
import ArtistStep from "./artist-step";

const ONBOARDING_STEPS = ["intro", "bio", "artists", "done"] as const;
type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

interface OnboardingFlowProps {
    clerkUserId: string;
}

export default function OnboardingFlow({ clerkUserId }: OnboardingFlowProps) {
    const [stepIndex, setStepIndex] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const currentStep = ONBOARDING_STEPS[stepIndex];

    const nextStep = () => {
        setStepIndex((i) => Math.min(i + 1, ONBOARDING_STEPS.length - 1));
    };
    const prevStep = () => {
        setStepIndex((i) => Math.max(i - 1, 0));
    };

    const handleBioComplete = async (bio: string) => {
        setIsLoading(true);
        try {
            await addBioFromOnboarding(clerkUserId, bio);
            nextStep();
        } catch (error) {
            console.error("Failed to update bio:", error);
            // TODO: show toast
        } finally {
            setIsLoading(false);
        }
    };

    const getProgress = () => {
        return (stepIndex / (ONBOARDING_STEPS.length - 1)) * 100;
    };

    return (
        <div className="w-full max-w-prose mx-auto h-[600px] rounded-4xl bg-background/90 border border-border/90 backdrop-blur-md backdrop-saturate-100 py-8 px-8 flex flex-col gap-4 relative">
            <AnimatePresence mode="wait">
                {currentStep === "intro" ? (
                    <IntroStep onComplete={nextStep} />
                ) : currentStep === "bio" ? (
                    <BioStep
                        onComplete={handleBioComplete}
                        isLoading={isLoading}
                        skipStep={nextStep}
                        prevStep={prevStep}
                    />
                ) : currentStep === "artists" ? (
                    <ArtistStep
                        isLoading={isLoading}
                        skipStep={nextStep}
                        prevStep={prevStep}
                    />
                ) : (
                    currentStep === "done" && <div>Done Step</div>
                )}
            </AnimatePresence>
        </div>
    );
}
