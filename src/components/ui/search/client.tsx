"use client";

import * as React from "react";
import { SearchAlbum, SearchArtist } from "@/types/spotify";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Input } from "../input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Search } from "lucide-react";

type SearchClientProps = {
    initialQuery: string;
    initialType: "all" | "album" | "artist";
    artists: SearchArtist[];
    albums: SearchAlbum[];
};

export default function SearchClient({
    initialQuery,
    initialType,
    artists,
    albums,
}: SearchClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = React.useState(initialQuery);
    const [type, setType] = React.useState(initialType);

    const [debouncedQuery] = useDebounce(query, 300);

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedQuery === initialQuery && type === initialType) return;

        if (debouncedQuery) {
            params.set("q", debouncedQuery);
            params.set("type", type);
        } else {
            params.delete("q");
            params.delete("type");
        }

        router.replace(`/search?${params.toString()}`, { scroll: false });
    }, [debouncedQuery, type]);

    return (
        <div className="mb-6">
            <div className="max-w-md">
                <InputGroup>
                    <InputGroupInput
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search artists or albums"
                    />
                    <InputGroupAddon>
                        <Search/>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {/* TEMP: simple type switch */}
            {/* <div className="mt-2 flex gap-2">
                {(["all", "artist", "album"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={
                            t === type ? "font-bold underline" : "opacity-60"
                        }
                    >
                        {t}
                    </button>
                ))}
            </div> */}
        </div>
    );
}
