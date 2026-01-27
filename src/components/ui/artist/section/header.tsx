"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "../../button";

export type ArtistSectionHeaderProps = {
    title: string;
    link?: string;
};

export default function ArtistSectionHeader({
    title,
    link,
}: ArtistSectionHeaderProps) {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h2 className="font-display font-medium text-lg @3xl:text-xl">
                    {title}
                </h2>
            </div>

            {link !== undefined && (
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    onClick={() => router.push(link ?? "/")}
                >
                    <span>See all</span>
                    <ChevronRight />
                </Button>
            )}
        </div>
    );
}
