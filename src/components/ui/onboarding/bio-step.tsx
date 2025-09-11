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

const bioSchema = z.object({
    bio: z
        .string()
        .min(1, "Bio is required")
        .max(240, "Bio must be 240 characters or less")
        .trim(),
});

type BioFormData = z.infer<typeof bioSchema>;

type BioStepProps = {
    onComplete: (bio: string) => void;
    isLoading: boolean;
    skipStep: () => void;
    prevStep: () => void;
};

export default function BioStep({
    onComplete,
    isLoading,
    skipStep,
    prevStep,
}: BioStepProps) {
    const [charCount, setCharCount] = React.useState<number>(0);

    const form = useForm<BioFormData>({
        resolver: zodResolver(bioSchema),
        defaultValues: {
            bio: "",
        },
    });

    const handleSubmit = (data: BioFormData) => {
        onComplete(data.bio);
    };

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
                    A Personal Touch
                </h1>
                <p className="text-sm text-muted-foreground leading-snug max-w-prose">
                    Tell others a little something about yourself, or the music
                    you like to listen to.
                </p>
            </header>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col justify-between gap-8 flex-1"
                    id="bio-form"
                >
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col gap-2 w-full ">
                                    <FormControl>
                                        <Textarea
                                            placeholder="Hi I'm..., and I love listening to..."
                                            className="resize-none flex-1 text-sm rounded-2xl border-none"
                                            rows={4}
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setCharCount(
                                                    e.target.value.length
                                                );
                                            }}
                                            maxLength={240}
                                        />
                                    </FormControl>
                                    <div className="flex justify-between items-center text-sm place-self-end">
                                        <FormMessage />
                                        <CircularCharacterCounter
                                            current={charCount}
                                            max={240}
                                        />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <div className="grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-x-4 gap-y-2">
                <Button variant={"secondary"} size={"lg"} onClick={prevStep}>
                    <Rewind className="fill-secondary-foreground stroke-none" />
                    Back
                </Button>
                <Button
                    form="bio-form"
                    type="submit"
                    size={"lg"}
                    disabled={isLoading || !form.formState.isValid}
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
