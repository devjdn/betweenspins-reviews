"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import type { SpotifyAlbum } from "@/types/spotify";
import { CornerUpLeft, MoveLeft, PencilLine, X } from "lucide-react";
import CurrentlyReviewingBanner from "./currently-reviewing-banner";

interface ReviewDialogProps {
    album: SpotifyAlbum;
}

export default function Review({ album }: ReviewDialogProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const albumSummary = {
        id: album.id,
        name: album.name,
        artists: album.artists.map((a) => ({
            id: a.id,
            name: a.name,
        })),
        imageUrl: album.images.at(-1)?.url ?? "",
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="w-full md:w-auto"
                        variant="mediaOption"
                        size={"lg"}
                    >
                        <PencilLine />
                        <span>Write a review</span>
                    </Button>
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="md:w-full md:max-w-prose md:mx-auto md:h-[80vh] bg-background flex flex-col"
                >
                    <DialogHeader className="flex flex-row items-center justify-between gap-4 shrink-0">
                        <DialogTitle className="text-2xl font-medium">
                            Review
                        </DialogTitle>
                        <DialogClose asChild>
                            <Button
                                className="pr-0.25 [&_svg]:stroke-muted-foreground hover:[&_svg]:stroke-foreground "
                                variant={"ghost"}
                                size={"icon"}
                            >
                                <X className="size-5 transition-colors duration-150" />
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto">
                        <CurrentlyReviewingBanner album={albumSummary} />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    className="w-full md:w-auto"
                    variant="mediaOption"
                    size={"lg"}
                >
                    <PencilLine />
                    <span>Write a review</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left space-y-2">
                    <DrawerTitle className="text-lg font-medium">
                        Review
                    </DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                    <CurrentlyReviewingBanner album={albumSummary} />
                </div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Back to {album.name}</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
