"use client";

import { SpotifyAlbum } from "@/types/spotify";
import z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupTextarea,
} from "../input-group";
import { Slider } from "../slider";
import clsx from "clsx";
import { submitReviewAction } from "@/app/actions";
import { Send } from "lucide-react";

interface ReviewFormProps {
    album: SpotifyAlbum;
    clerkUserId: string;
    onSuccess?: () => void;
}

const reviewFormSchema = z.object({
    clerkUserId: z.string(),
    albumTitle: z.string(),
    spotifyAlbumId: z.string(),
    albumArtists: z.array(z.string()),
    reviewTitle: z.string().max(100).trim().optional(),
    rating: z.number().int().min(0).max(10),
    review: z
        .string()
        .max(5000, "Review too long (max 5000 characters)")
        .trim()
        .optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function ReviewForm({
    album,
    clerkUserId,
    onSuccess,
}: ReviewFormProps) {
    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewFormSchema),
        mode: "onChange",
        defaultValues: {
            clerkUserId: clerkUserId,
            albumTitle: album.name,
            albumArtists: album.artists.map((a, _) => a.name),
            spotifyAlbumId: album.id,
            reviewTitle: "",
            rating: 0,
            review: "",
        },
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (data: ReviewFormData) => {
        setIsSubmitting(true);
        try {
            await submitReviewAction(
                data.clerkUserId,
                data.spotifyAlbumId,
                data.albumTitle,
                data.albumArtists,
                data.reviewTitle,
                data.rating,
                data.review
            );
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to submit review:", error);
            // TODO: Add toast notification for error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 h-full"
                >
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="md:text-lg font-medium">
                                    Rating
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={10}
                                            value={[
                                                field.value
                                                    ? field.value * 10
                                                    : 0,
                                            ]}
                                            onValueChange={(values) =>
                                                field.onChange(values[0] / 10)
                                            }
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            {Array.from(
                                                { length: 11 },
                                                (_, i) => (
                                                    <span
                                                        key={i}
                                                        className="tabular-nums"
                                                    >
                                                        {i}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reviewTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="md:text-lg font-medium">
                                    Title
                                </FormLabel>
                                <FormControl>
                                    <InputGroup className="rounded-lg">
                                        <InputGroupInput
                                            placeholder="Add a title to your review"
                                            className="text-sm"
                                            {...field}
                                        />

                                        <InputGroupAddon align="inline-end">
                                            <span
                                                className={clsx(
                                                    "text-xs tabular-nums",
                                                    (field.value?.length || 0) >
                                                        100 &&
                                                        "text-destructive"
                                                )}
                                            >
                                                {100 -
                                                    (field.value?.length || 0)}
                                            </span>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="review"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="md:text-lg font-medium">
                                    Content
                                </FormLabel>
                                <FormControl>
                                    <InputGroup className="rounded-xl">
                                        <InputGroupTextarea
                                            placeholder="What do you think of this album?"
                                            {...field}
                                            className="min-h-40"
                                        />
                                        <InputGroupAddon align="block-end">
                                            <span
                                                className={clsx(
                                                    "text-xs tabular-nums",
                                                    (field.value?.length || 0) >
                                                        5000 &&
                                                        "text-destructive"
                                                )}
                                            >
                                                {5000 -
                                                    (field.value?.length || 0)}
                                            </span>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting || form.formState.isSubmitting}
                        className="w-full md:w-fit"
                    >
                        {isSubmitting ? (
                            "Submitting..."
                        ) : (
                            <>
                                <Send />
                                Submit
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
