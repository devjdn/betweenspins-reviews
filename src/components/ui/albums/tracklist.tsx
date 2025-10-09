import type { SpotifyAlbum, SpotifyAlbumTracks } from "@/types/spotify";
import { Hash } from "lucide-react";
import React from "react";
import ms from "ms";

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
    const runtimeMs = albumTracks.reduce(
        (acc, track) => acc + track.duration_ms,
        0
    );
    const runtimeConverted = ms(runtimeMs, { long: true });
    return (
        <div className="space-y-4">
            <div className="p-4 border-b grid grid-cols-[40px_1fr] items-center md:grid-cols-[40px_1fr_1fr]">
                <span>
                    <Hash className="size-4" />
                </span>
                <span className="text-sm">Title</span>
                <span className="text-sm hidden md:inline">Artists</span>
            </div>
            <div className="grid grid-flow-rows">
                {albumTracks.map((track, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[40px_1fr] md:grid-cols-[40px_1fr_1fr] text-sm text-muted-foreground hover:text-foreground p-4 rounded-md md:rounded-lg odd:bg-muted hover:bg-secondary"
                    >
                        <span className="">{track.track_number}</span>
                        <span>{track.name}</span>
                        <span className="hidden md:inline">
                            {track.artists
                                .map((artist, _) => artist.name)
                                .join(", ")}
                        </span>
                    </div>
                ))}
            </div>
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
