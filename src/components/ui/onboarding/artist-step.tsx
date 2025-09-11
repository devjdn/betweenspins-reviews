"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, FastForward, Play, Rewind } from "lucide-react";
import { CircularCharacterCounter } from "../char-counter";
import { motion } from "motion/react";

type BioStepProps = {
    // onComplete: (bio: string) => void;
    isLoading: boolean;
    skipStep: () => void;
    prevStep: () => void;
};

export default function ArtistStep({
    // onComplete,
    isLoading,
    skipStep,
    prevStep,
}: BioStepProps) {
    return (
        <motion.div
            className="flex flex-col flex-1 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            key={"bio"}
        >
            <header className="space-y-2">
                <h1 className="font-semibold tracking-tight text-xl md:text-2xl">
                    Your Soundtrack
                </h1>
                <p className="text-sm text-muted-foreground leading-snug max-w-prose">
                    Pick up to 5 of your favorite artists. These will show up on
                    your profile and help shape how others see your taste on
                    Between Spins.
                </p>
            </header>

            <div className="flex-1"></div>

            <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-x-4 gap-y-2">
                <Button variant={"secondary"} size={"lg"} onClick={prevStep}>
                    <Rewind className="fill-secondary-foreground stroke-none" />
                    Back
                </Button>
                <Button
                    form="bio-form"
                    type="submit"
                    size={"lg"}
                    // disabled={isLoading || !form.formState.isValid}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Play className="fill-primary-foreground stroke-none" />
                            Continue
                        </>
                    )}
                </Button>
                <Button variant={"secondary"} size={"lg"} onClick={skipStep}>
                    <FastForward className="fill-secondary-foreground stroke-none" />
                    Skip
                </Button>
            </div>
        </motion.div>
    );
}
