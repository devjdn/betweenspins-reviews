import Link from "next/link";
import { SpotifyArtist } from "@/types/spotify";

export type ArtistMetaProps = {
    artistName: SpotifyArtist["name"];
    genres: SpotifyArtist["genres"];
};

export default function ArtistMetadata({
    artistName,
    genres,
}: ArtistMetaProps) {
    return (
        <div className="space-y-4 font-display text-center @3xl:text-left">
            <div className="font-semibold text-2xl @3xl:text-3xl text-balance supports-[text-wrap:pretty]:text-pretty">
                <span>{artistName}</span>
            </div>
            {genres.length > 0 && (
                <div className="font-normal @3xl:font-medium @3xl:text-lg space-y-1">
                    <div className="flex flex-wrap justify-start gap-2 text-sm">
                        {genres.slice(0, 6).map((genre) => (
                            <span
                                key={genre}
                                className="rounded-full bg-muted px-3 py-1 capitalize"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
