import type { SpotifyAlbum, SpotifyAlbumTracks } from "@/types/spotify";
import { Hash } from "lucide-react";
import React from "react";
import ms from "ms";
import { MdExplicit } from "react-icons/md";

interface TracklistProps {
    tracks: SpotifyAlbumTracks;
    releaseDate: SpotifyAlbum["release_date"];
    copyrights: SpotifyAlbum["copyrights"];
}

export default function Tracklist({
    tracks,
    releaseDate,
    copyrights,
}: TracklistProps) {
    const { items: albumTracks } = tracks;

    // Group tracks by disc number
    const discs = albumTracks.reduce<Record<number, typeof albumTracks>>(
        (acc, track) => {
            if (!acc[track.disc_number]) acc[track.disc_number] = [];
            acc[track.disc_number].push(track);
            return acc;
        },
        {}
    );

    const runtimeMs = albumTracks.reduce(
        (acc, track) => acc + track.duration_ms,
        0
    );
    const runtimeConverted = ms(runtimeMs, { long: true });

    return (
        <div className="space-y-6 @container">
            {/* Header row */}
            <div className="p-4 border-b grid grid-cols-[40px_1fr] items-center @3xl:grid-cols-[40px_1fr_1fr]">
                <span>
                    <Hash className="size-4" />
                </span>
                <span className="text-sm">Title</span>
                <span className="text-sm hidden @3xl:inline">Artists</span>
            </div>

            {Object.entries(discs).map(([discNumber, tracks]) => (
                <div key={discNumber} className="space-y-2">
                    {Object.keys(discs).length > 1 && (
                        <h3 className="font-medium text-foreground mt-4">
                            Disc {discNumber}
                        </h3>
                    )}

                    <div className="grid grid-flow-rows">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                className="grid grid-cols-[40px_1fr] @3xl:grid-cols-[40px_1fr_1fr] text-sm text-muted-foreground stroke-muted-foreground hover:stroke-foreground hover:text-foreground p-4 rounded-md @3xl:rounded-lg odd:bg-muted hover:bg-secondary"
                            >
                                <span>{track.track_number}</span>
                                <span className="inline-flex items-center gap-1">
                                    {track.name}{" "}
                                    {track.explicit && <MdExplicit />}
                                </span>
                                <span className="hidden @3xl:inline">
                                    {track.artists
                                        .map((artist) => artist.name)
                                        .join(", ")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="leading-snug text-muted-foreground text-sm space-y-1">
                <p>
                    {releaseDate
                        ? new Date(releaseDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                          })
                        : "Unknown release date"}
                </p>

                <p>
                    {`${albumTracks.length} ${
                        albumTracks.length > 1 ? "Tracks" : "Track"
                    }`}
                    {", "}
                    {runtimeConverted}
                </p>

                <p>{copyrights.find((c) => c.type === "P")?.text ?? ""}</p>
            </div>
        </div>
    );
}
