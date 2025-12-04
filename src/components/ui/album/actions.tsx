import clsx from "clsx";
import { Star } from "lucide-react";
import { FaSpotify } from "react-icons/fa";
import { Button } from "../button";
import Link from "next/link";

export type AlbumActionsProps = {
    color: {
        rgb: string;
        isLight: boolean;
        isDark: boolean;
    };
    spotifyUrl: string;
};

export default function AlbumActions({ color, spotifyUrl }: AlbumActionsProps) {
    return (
        <div className="w-full grid grid-cols-2 gap-2 mx-auto @3xl:mx-0 @3xl:w-fit">
            <button
                style={{ background: color.rgb }}
                className={clsx(
                    "w-full @3xl:w-auto inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    { "text-black": color.isLight },
                    { "text-white": color.isDark },
                    { border: color.isDark }
                )}
            >
                <Star />
                <span>Review</span>
            </button>

            <Button
                className="w-full @3xl:w-auto"
                variant={"secondary"}
                asChild
            >
                <Link href={spotifyUrl} target="_blank">
                    <FaSpotify />
                    <span>Listen on Spotify</span>
                </Link>
            </Button>
        </div>
    );
}
