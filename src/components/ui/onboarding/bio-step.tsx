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
    FormMessage,
} from "@/components/ui/form";
import { CircularCharacterCounter } from "../char-counter";
import { motion } from "motion/react";
import StepHeader from "./step-header";

const bioSchema = z.object({
    bio: z
        .string()
        .min(1, "Bio is required")
        .max(240, "Bio must be 240 characters or less")
        .trim(),
});

type BioFormData = z.infer<typeof bioSchema>;

export type BioStepHandle = {
    submit: () => void;
    canSubmit: boolean;
};

type BioStepProps = {
    onComplete: (bio: string) => void;
    onValidityChange?: (isValid: boolean) => void;
};

const BioStep = React.forwardRef<BioStepHandle, BioStepProps>(function BioStep(
    { onComplete, onValidityChange }: BioStepProps,
    ref
) {
    const [charCount, setCharCount] = React.useState<number>(0);

    const form = useForm<BioFormData>({
        resolver: zodResolver(bioSchema),
        mode: "onChange",
        defaultValues: {
            bio: "",
        },
    });

    const handleSubmit = (data: BioFormData) => {
        onComplete(data.bio);
    };

    React.useImperativeHandle(
        ref,
        () => ({
            submit: () => {
                // Trigger form submission programmatically
                form.handleSubmit(handleSubmit)();
            },
            get canSubmit() {
                return form.formState.isValid && !form.formState.isSubmitting;
            },
        }),
        [form]
    );

    React.useEffect(() => {
        onValidityChange?.(form.formState.isValid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.formState.isValid]);

    return (
        <motion.div
            className="flex flex-col flex-1 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            key={"bio"}
        >
            <StepHeader
                title={"A Personal Touch"}
                description={
                    "Tell others a little something about yourself, or the music you like to listen to."
                }
            />
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
                                    <div className="flex justify-between items-center text-sm">
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
        </motion.div>
    );
});

export default BioStep;
