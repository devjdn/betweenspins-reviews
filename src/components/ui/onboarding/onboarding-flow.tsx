"use client";

import React from "react";
import {
    addBioFromOnboarding,
    addFavoriteArtistsFromOnboarding,
    completeOnboarding,
    skipOnboarding,
} from "@/app/onboarding/_actions";
import BioStep, { BioStepHandle } from "./bio-step";
import IntroStep, { IntroStepHandle } from "./intro-step";
import { AnimatePresence } from "motion/react";
import ArtistStep, { ArtistStepHandle } from "./artist-step";
import EndStep, { EndStepHandle } from "./end-step";
import { redirect, useRouter } from "next/navigation";
import { Progress } from "../progress";
import { Button } from "../button";
import { FastForward, Play, Rewind, SkipForward } from "lucide-react";

const ONBOARDING_STEPS = ["intro", "bio", "artists", "done"] as const;

interface OnboardingFlowProps {
    clerkUserId: string;
}

export default function OnboardingFlow({ clerkUserId }: OnboardingFlowProps) {
    const router = useRouter();
    const [stepIndex, setStepIndex] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [canContinue, setCanContinue] = React.useState<boolean>(true);

    const currentStep = ONBOARDING_STEPS[stepIndex];

    const introRef = React.useRef<IntroStepHandle | null>(null);
    const bioRef = React.useRef<BioStepHandle | null>(null);
    const artistRef = React.useRef<ArtistStepHandle | null>(null);
    const endRef = React.useRef<EndStepHandle | null>(null);

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

    const handleArtistsComplete = async (
        artists: { artist_id: string; name: string }[]
    ) => {
        setIsLoading(true);
        try {
            await addFavoriteArtistsFromOnboarding(clerkUserId, artists);
            nextStep();
        } catch (error) {
            console.error("Failed to update favorite artists:", error);
            // TODO: show toast
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnboardingComplete = async () => {
        setIsLoading(true);
        try {
            await completeOnboarding(clerkUserId);
            router.push("/profile");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            // TODO: toast
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnboardingSkipped = async () => {
        setIsLoading(true);
        try {
            await skipOnboarding(clerkUserId);
            redirect("/profile");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            // TODO: toast
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentRef = () => {
        if (currentStep === "intro") return introRef.current;
        if (currentStep === "bio") return bioRef.current;
        if (currentStep === "artists") return artistRef.current;
        if (currentStep === "done") return endRef.current;
        return null;
    };

    const handleContinue = () => {
        const ref = getCurrentRef();
        if (ref && ref.canSubmit) {
            ref.submit();
        }
    };

    const getProgress = () => {
        return (stepIndex / (ONBOARDING_STEPS.length - 1)) * 100;
    };

    return (
        <div className="w-full md:max-w-prose flex-1 md:h-[70vh] mx-auto md:border md:rounded-4xl bg-background/60 md:p-8 flex flex-col gap-4 relative">
            <AnimatePresence mode="wait">
                {currentStep === "intro" ? (
                    <IntroStep
                        ref={introRef}
                        onComplete={nextStep}
                        onValidityChange={setCanContinue}
                    />
                ) : currentStep === "bio" ? (
                    <BioStep
                        ref={bioRef}
                        onComplete={handleBioComplete}
                        onValidityChange={setCanContinue}
                    />
                ) : currentStep === "artists" ? (
                    <ArtistStep
                        ref={artistRef}
                        onComplete={handleArtistsComplete}
                        onValidityChange={setCanContinue}
                    />
                ) : (
                    currentStep === "done" && (
                        <EndStep
                            ref={endRef}
                            onComplete={handleOnboardingComplete}
                            onValidityChange={setCanContinue}
                        />
                    )
                )}
            </AnimatePresence>
            <Progress value={getProgress()} />
            <div className="grid grid-rows-2 grid-cols-2 md:grid-rows-1 md:grid-cols-3 gap-x-4 gap-y-2">
                {currentStep !== "intro" && (
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={prevStep}
                        className="row-start-2 col-start-1 md:row-start-1 md:col-start-1"
                    >
                        <Rewind className="fill-secondary-foreground stroke-none" />
                        {currentStep === "done" ? "Edit Choices" : "Back"}
                    </Button>
                )}

                <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={isLoading || !canContinue}
                    className="row-start-1 col-start-1 col-end-3 md:col-start-2 md:col-end-3"
                >
                    {isLoading ? (
                        <>Updating...</>
                    ) : (
                        <>
                            <Play className="fill-primary-foreground stroke-none" />
                            Continue
                        </>
                    )}
                </Button>

                {(currentStep === "bio" || currentStep === "artists") && (
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={nextStep}
                        className="row-start-2 col-start-2 md:row-start-1 md:col-start-3"
                    >
                        <FastForward className="fill-secondary-foreground stroke-none" />
                        Skip
                    </Button>
                )}

                {currentStep === "intro" && (
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleOnboardingSkipped}
                        className="row-start-2 col-start-1 col-end-3 md:row-start-1 md:col-start-3"
                    >
                        <SkipForward />
                        Skip Onboarding
                    </Button>
                )}
            </div>
        </div>
    );
}
