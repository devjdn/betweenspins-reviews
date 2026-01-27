import { Star } from "lucide-react";
import { FaSpotify, FaStar } from "react-icons/fa";
import { Button } from "../button";
import Link from "next/link";

export type AlbumActionsProps = {
    spotifyUrl: string;
};

export default function AlbumActions({ spotifyUrl }: AlbumActionsProps) {
    return (
        <div className="w-full grid grid-cols-2  gap-2 mx-auto @3xl:mx-0 @3xl:w-fit">
            <Button
                className="w-full @3xl:w-auto rounded-full"
                size={"lg"}
                variant={"secondary"}
            >
                <FaStar />
                <span>Review</span>
            </Button>

            <Button
                className="w-full @3xl:w-auto rounded-full"
                size={"lg"}
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
