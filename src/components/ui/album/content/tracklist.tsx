"use client";

import { Hash, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { MdExplicit } from "react-icons/md";
import { msToMinutesSeconds } from "@/lib/spotify/helpers";
import * as React from "react";
import { Button } from "@/components/ui/button";

type AlbumTrack = {
    title: string;
    position: number;
    disc: number;
    durationMs?: number;
    artists: { id: string; name: string }[];
};

const TRACK_THRESHOLD = 6;

export default function Tracklist({ tracks }: { tracks: AlbumTrack[] }) {
    const [expanded, setExpanded] = React.useState(false);

    // Group tracks by disc number
    const discs = tracks.reduce<Record<number, typeof tracks>>((acc, track) => {
        if (!acc[track.disc]) acc[track.disc] = []
        acc[track.disc].push(track);
        return acc;
    }, {});

    const totalTracks = tracks.length;
    const shouldShowExpand = totalTracks > TRACK_THRESHOLD;

    // Flatten tracks while preserving disc info for rendering
    const allTracksWithDisc = tracks.map((track) => ({
        ...track,
        disc: track.disc,
    }));

    // Get tracks to display
    const tracksToDisplay =
        expanded || !shouldShowExpand
            ? allTracksWithDisc
            : allTracksWithDisc.slice(0, TRACK_THRESHOLD);

    // Re-group displayed tracks by disc for rendering
    const displayedDiscs = tracksToDisplay.reduce<
        Record<number, typeof tracks>
    >((acc, track) => {
        if (!acc[track.disc]) acc[track.disc] = [];
        acc[track.disc].push(track);
        return acc;
    }, {});

    return (
        <div className="@container">

            <div className="grid grid-cols-[20px_1fr] gap-4 @3xl:grid-cols-[20px_1fr_80px] text-sm p-2 border-b text-muted-foreground">
                <span className="justify-self-end">#</span>
                <span>Title</span>
                <span className="hidden @3xl:inline justify-self-end"><Clock className="size-4" /></span>
            </div>

            {Object.entries(displayedDiscs).map(([discNumber, tracks]) => (
                <div key={discNumber} className="space-y-2">
                    {Object.keys(discs).length > 1 && (
                        <p className="text-xs font-medium text-foreground mt-4">
                            Disc {discNumber}
                        </p>
                    )}

                    <div className="grid grid-flow-rows">
                        {tracks.map((track, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[20px_1fr] gap-4 @3xl:grid-cols-[20px_1fr_80px] text-sm px-2 py-3 border-b"
                            >
                                <span className="text-muted-foreground justify-self-end">{track.position}</span>
                                <span className="inline-flex items-center text-foreground gap-1">
                                    {track.title}
                                </span>
                                <span className="hidden @3xl:inline justify-self-end text-muted-foreground">
                                    {track.durationMs ? msToMinutesSeconds(track.durationMs) : "-"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {shouldShowExpand && (
                <div className="flex justify-center pt-2">
                    <Button
                        variant="ghost"
                        onClick={() => setExpanded(!expanded)}
                        size={"sm"}
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="size-4" />
                                Show less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="size-4" />
                                Show all {totalTracks} tracks
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
