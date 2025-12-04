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
    const ref = React.useRef<HTMLDivElement | null>(null);

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

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!ref.current) return;
            const target = event.target as Node | null;
            if (isOpen && target && !ref.current.contains(target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, {
            passive: true,
        });

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

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
        <div ref={ref} className="relative w-full">
            <InputGroup className="rounded-lg">
                <InputGroupInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (searchQuery.trim()) setIsOpen(true);
                    }}
                    placeholder="Search"
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

            {isOpen && (artists.length > 0 || albums.length > 0) && <div></div>}
        </div>
    );
}
