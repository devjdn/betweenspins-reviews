"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserRound, X } from "lucide-react";
import { motion } from "motion/react";
import StepHeader from "./step-header";
import { useDebounce } from "@/hooks/use-debounce";
import { formatFollowers } from "@/lib/spotify/spotify";
import { searchSpotifyArtists, SimplifiedArtist } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../badge";
import Image from "next/image";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export type ArtistStepHandle = {
    submit: () => void;
    canSubmit: boolean;
};

type ArtistStepProps = {
    onComplete: (artists: { artist_id: string; name: string }[]) => void;
    onValidityChange?: (isValid: boolean) => void;
};

const ArtistStep = React.forwardRef<ArtistStepHandle, ArtistStepProps>(
    function ArtistStep(
        { onComplete, onValidityChange }: ArtistStepProps,
        ref
    ) {
        const [searchQuery, setSearchQuery] = React.useState("");
        const [selectedArtists, setSelectedArtists] = React.useState<
            SimplifiedArtist[]
        >([]);
        const debouncedQuery = useDebounce(searchQuery, 300);

        const { data: searchResults, isFetching: isSearching } = useQuery({
            queryKey: ["spotify-search", debouncedQuery],
            queryFn: async () => {
                if (!debouncedQuery) {
                    return [];
                }
                const results = await searchSpotifyArtists(debouncedQuery);
                return results;
            },
            enabled: !!debouncedQuery, // don’t run if query is empty
            staleTime: 60 * 1000, // 1 minute caching
            gcTime: 5 * 60 * 1000, // garbage collect after 5 minutes
        });

        const addArtist = (artist: SimplifiedArtist) => {
            if (!selectedArtists.find((a) => a.id === artist.id)) {
                setSelectedArtists((prev) => [...prev, artist]);
            }
            setSearchQuery("");
        };

        const removeArtist = (artistId: string) => {
            setSelectedArtists((prev) => prev.filter((a) => a.id !== artistId));
        };

        const handleSubmit = () => {
            onComplete(
                selectedArtists.map((artist) => ({
                    artist_id: artist.id,
                    name: artist.name,
                }))
            );
        };

        React.useImperativeHandle(
            ref,
            () => ({
                submit: handleSubmit,
                get canSubmit() {
                    return (
                        selectedArtists.length > 0 &&
                        selectedArtists.length <= 5
                    );
                },
            }),
            [selectedArtists]
        );

        React.useEffect(() => {
            const isValid =
                selectedArtists.length > 0 && selectedArtists.length <= 5;
            onValidityChange?.(isValid);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectedArtists.length]);

        return (
            <motion.div
                className="flex flex-col flex-1 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                key={"artists"}
            >
                <StepHeader
                    title={"Your Soundtrack"}
                    description={
                        "Pick up to 5 of your favorite artists. These will show up on your profile and help shape how others see your taste."
                    }
                />

                <div className="flex-1 flex flex-col gap-y-6">
                    <div className="relative">
                        <Search className="stroke-muted-foreground absolute left-6 top-1/2 transform -translate-y-1/2 size-5" />

                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for artists on Spotify..."
                            className="peer rounded-full h-12 border-none pl-16"
                            disabled={selectedArtists.length >= 5}
                        />

                        <div
                            className={clsx(
                                "flex-1 space-y-2 w-full absolute left-0 top-full mt-2 rounded-2xl bg-background border p-6 z-10",
                                searchQuery === "" ? "hidden" : "block"
                            )}
                        >
                            <div>
                                <p className="font-semibold">Results</p>
                            </div>
                            <div className="flex flex-col max-h-[300px] overflow-y-scroll">
                                {isSearching ? (
                                    // Skeletons
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-14 rounded-lg grid grid-cols-[40px_1fr] justify-start items-center gap-x-2"
                                        >
                                            <div className="relative size-10 rounded-full overflow-hidden bg-secondary animate-pulse" />
                                            <div className="text-sm font-normal space-y-1">
                                                <div className="w-[20ch] h-3 rounded-full animate-pulse bg-secondary" />
                                                <div className="w-[12ch] h-3 rounded-full animate-pulse bg-secondary" />
                                            </div>
                                        </div>
                                    ))
                                ) : searchResults &&
                                  searchResults.length > 0 ? (
                                    // Results
                                    searchResults.map((artist, i) => (
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="p-2 cursor-pointer"
                                            key={i}
                                            onClick={() => addArtist(artist)}
                                        >
                                            <div className="h-14 rounded-lg grid grid-cols-[40px_1fr] justify-start gap-x-2">
                                                <div className="relative size-10 rounded-full overflow-hidden">
                                                    {artist.image ? (
                                                        <Image
                                                            src={
                                                                artist.image
                                                                    ?.url
                                                            }
                                                            alt={artist.name}
                                                            fill
                                                            loading="lazy"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <UserRound className="size-4 stroke-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="text-sm font-normal">
                                                    <p>{artist.name}</p>
                                                    <p className="text-muted-foreground">
                                                        {formatFollowers(
                                                            artist.followers
                                                        )}{" "}
                                                        followers
                                                    </p>
                                                </div>
                                            </div>
                                        </Button>
                                    ))
                                ) : (
                                    // Optional: empty state
                                    <p className="text-sm text-muted-foreground p-2">
                                        No results found
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedArtists.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center gap-4">
                                <p className="font-medium">Selected Artists</p>

                                <Badge
                                    variant={"secondary"}
                                >{`${selectedArtists.length} / 5`}</Badge>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedArtists.map((artist, i) => (
                                    <div
                                        className="bg-secondary py-2 px-3 rounded-full flex justify-between items-center gap-4"
                                        key={i}
                                    >
                                        <div className="flex items-center gap-3">
                                            {artist.image?.url && (
                                                <div className="relative overflow-hidden rounded-full">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={
                                                                artist.image.url
                                                            }
                                                            alt={artist.name}
                                                        />
                                                        <AvatarFallback>
                                                            {artist.name.charAt(
                                                                0
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            )}

                                            <span className="text-secondary-foreground text-sm">
                                                {artist.name}
                                            </span>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                removeArtist(artist.id)
                                            }
                                            className="cursor-pointer"
                                            size={"icon"}
                                            variant={"ghost"}
                                        >
                                            <X className="size-4 stroke-secondary-foreground" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }
);

export default ArtistStep;
