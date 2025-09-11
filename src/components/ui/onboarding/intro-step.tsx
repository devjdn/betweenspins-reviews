"use client";

import { FastForward, Play } from "lucide-react";
import { Button } from "../button";
import { motion } from "motion/react";

interface IntroStepProps {
    onComplete: () => void;
}

export default function IntroStep({ onComplete }: IntroStepProps) {
    return (
        <motion.div
            className="flex flex-col flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            key={"intro"}
        >
            <header className="space-y-2">
                <h1 className="font-semibold tracking-tight text-xl md:text-2xl">
                    Make Your Profile Yours
                </h1>
                <p className="text-sm text-muted-foreground leading-snug max-w-prose">
                    {
                        "Personalize your appearance on Between Spins. You can give yourself a bio, as well as pick 5 your favourite artists to appear on your profile (powered by Spotify)."
                    }
                </p>
            </header>

            <div className="flex-1" />

            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-3 gap-x-4 gap-y-2">
                <Button size="lg" onClick={onComplete}>
                    <Play className="fill-primary-foreground stroke-none" />
                    Get Started
                </Button>
                <Button variant="link" size="lg">
                    <FastForward className="fill-foreground stroke-none" />
                    Skip Onboarding
                </Button>
            </div>
        </motion.div>
    );
}
