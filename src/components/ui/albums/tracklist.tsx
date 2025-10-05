import type { SpotifyAlbumTracks } from "@/types/spotify";
import { Hash } from "lucide-react";
import React from "react";

export default function Tracklist({ tracks }: { tracks: SpotifyAlbumTracks }) {
    const { items: albumTracks } = tracks;
    return (
        <div>
            <div className="p-4 border-b grid grid-cols-[40px_1fr] items-center md:grid-cols-[40px_1fr_1fr]">
                <span>
                    <Hash className="size-4" />
                </span>
                <span className="text-sm">Title</span>
                <span className="text-sm hidden md:inline">Artists</span>
            </div>
            <div className="grid grid-flow-rows mt-4">
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
        </div>
    );
}
