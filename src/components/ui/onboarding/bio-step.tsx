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
import { Loader2 } from "lucide-react";
import { CircularCharacterCounter } from "../char-counter";

const bioSchema = z.object({
    bio: z
        .string()
        .min(1, "Bio is required")
        .max(150, "Bio must be 150 characters or less")
        .trim(),
});

type BioFormData = z.infer<typeof bioSchema>;

type BioStepProps = {
    onComplete: (bio: string) => void;
    isLoading: boolean;
};

export default function BioStep({ onComplete, isLoading }: BioStepProps) {
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
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter something about you, or the music you listen to..."
                                        className="resize-none"
                                        rows={4}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setCharCount(e.target.value.length);
                                        }}
                                    />
                                </FormControl>
                                <div className="flex justify-between items-center text-sm">
                                    <FormMessage />
                                    <CircularCharacterCounter
                                        current={charCount}
                                        max={150}
                                    />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !form.formState.isValid}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
