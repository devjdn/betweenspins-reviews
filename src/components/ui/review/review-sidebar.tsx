"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { Sidebar, SidebarTrigger } from "../sidebar";
import React from "react";
import { X } from "lucide-react";
import Review from "../albums/review";

export default function ReviewSidebar({
    album,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    album?: SpotifyAlbum;
}) {
    const [reviewing, setReviewing] = React.useState<SpotifyAlbum | null>(null);
    return (
        <Sidebar
            {...props}
            className="w-96 md:flex-col md:gap-3 pt-6 *:pb-3 rounded-xl bg-muted *:shrink"
        >
            <header className="flex items-center justify-between gap-4 px-6">
                <span className="font-medium text-xl tracking-tight leading-snug">
                    Review
                </span>
                <SidebarTrigger size={"icon"} variant={"ghost"}>
                    <X />
                </SidebarTrigger>
            </header>

            {reviewing && <Review album={reviewing} />}
        </Sidebar>
    );
}
