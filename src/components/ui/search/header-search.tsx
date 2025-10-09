"use client";

import { searchArtistsAndAlbums } from "@/app/actions";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowUpRight, Library, Music2, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function HeaderSearch() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const debouncedQuery = useDebounce(searchQuery, 300);

    const { data: searchResults = {}, isFetching: isSearching } = useQuery({
        queryKey: ["spotify-search", debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery) return {};
            return await searchArtistsAndAlbums(debouncedQuery);
        },
        enabled: !!debouncedQuery,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    React.useEffect(() => {
        if (debouncedQuery.trim() && !isOpen) {
            setIsOpen(true);
            setActiveIndex(0);
        } else if (!debouncedQuery.trim() && isOpen) {
            setIsOpen(false);
        }
    }, [debouncedQuery]);

    const artists = searchResults?.artists?.items ?? [];
    const albums = searchResults?.albums?.items ?? [];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        switch (e.key) {
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    return (
        <div className="relative w-full">
            <InputGroup className="rounded-full bg-background/30">
                <InputGroupInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for albums, artists, or reviews..."
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InputGroupButton
                                variant="ghost"
                                aria-label="Info"
                                size="icon-xs"
                                className="rounded-full"
                                onClick={() => router.push("/search")}
                            >
                                <ArrowUpRight />
                            </InputGroupButton>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-full">
                            <p>Go to search page.</p>
                        </TooltipContent>
                    </Tooltip>
                </InputGroupAddon>
            </InputGroup>

            {isOpen && (artists.length > 0 || albums.length > 0) && (
                <div className="absolute top-full left-0 w-full mt-2 bg-background border rounded-3xl shadow-lg z-50 p-2">
                    <Tabs defaultValue="albums" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-2">
                            <TabsTrigger value="albums">
                                <Library />
                                Albums
                            </TabsTrigger>
                            <TabsTrigger value="artists">
                                <Music2 />
                                Artists
                            </TabsTrigger>
                        </TabsList>

                        {/* Albums */}
                        <TabsContent value="albums">
                            <div className="max-h-[400px] overflow-y-auto flex flex-col gap-1">
                                {albums.length === 0 && (
                                    <p className="text-sm text-muted-foreground px-2">
                                        No albums found.
                                    </p>
                                )}
                                {albums.map((album: any) => (
                                    <Link
                                        key={album.id}
                                        href={`/album/${album.id}`}
                                        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/50 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {album.images?.[1]?.url && (
                                            <div className="relative size-14 rounded-lg overflow-hidden">
                                                <Image
                                                    src={album.images[1].url}
                                                    alt={album.name}
                                                    fill
                                                    loading="lazy"
                                                    className="object-cover object-center"
                                                />
                                            </div>
                                        )}
                                        <div className="text-sm">
                                            <p>{album.name}</p>
                                            <p className="text-muted-foreground">
                                                {album.artists
                                                    .map((a: any) => a.name)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Artists */}
                        <TabsContent value="artists">
                            <div className="max-h-[400px] overflow-y-auto flex flex-col gap-1">
                                {artists.length === 0 && (
                                    <p className="text-sm text-muted-foreground px-2">
                                        No artists found.
                                    </p>
                                )}
                                {artists.map((artist: any) => (
                                    <Link
                                        key={artist.id}
                                        href={`/artist/${artist.id}`}
                                        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/50 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {artist.images?.[1]?.url && (
                                            <div className="relative size-12 rounded-full overflow-hidden">
                                                <Image
                                                    src={artist.images[1].url}
                                                    alt={artist.name}
                                                    fill
                                                    loading="lazy"
                                                    className="object-cover object-center"
                                                />
                                            </div>
                                        )}
                                        <p className="text-sm">{artist.name}</p>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
