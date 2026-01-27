import SearchClient from "@/components/ui/search/client";
import SearchResults from "@/components/ui/search/results";
import { SpotifyAPI } from "@/lib/spotify/helpers";
import { SearchAlbum, SearchArtist } from "@/types/spotify";

type SearchPageProps = {
    searchParams: Promise<{
        type?: "all" | "album" | "artist";
        q?: string;
    }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q, type } = await searchParams;
    const query = q?.trim() ?? "";
    const initialType = type ?? "all";

    let artists: SearchArtist[] = [];
    let albums: SearchAlbum[] = [];

    if (query) {
        if (type === "album") {
            albums = await SpotifyAPI.searchAlbums(query, 12);
        } else if (type === "artist") {
            artists = await SpotifyAPI.searchArtists(query, 12);
        } else {
            const data = await SpotifyAPI.searchArtistsAndAlbums(query, 12);
            artists = data.artists ?? [];
            albums = data.albums ?? [];
        }
    }

    return (

        <div className="@container w-full space-y-8">
            <header>
                <h1 className="font-display text-3xl font-semibold">
                    Search
                </h1>
            </header>
            <SearchClient
                initialQuery={query}
                initialType={initialType}
                artists={artists}
                albums={albums}
            />
            <SearchResults artists={artists} albums={albums} />
        </div>
    );
}
