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
import { PencilLine, X } from "lucide-react";

interface ReviewDialogProps {
    album: SpotifyAlbum;
}

export default function Review({ album }: ReviewDialogProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

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
                    className="md:w-full md:max-w-prose md:mx-auto md:h-[80vh] bg-background"
                >
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <DialogTitle className="text-lg">
                                Review
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant={"ghost"} size={"icon"}>
                                    <X />
                                </Button>
                            </DialogClose>
                        </div>
                        <DialogDescription className="text-base">
                            Give{" "}
                            <span className="text-foreground">
                                {album.name}
                            </span>{" "}
                            a rating, alongside an optional full review.
                        </DialogDescription>
                    </DialogHeader>
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
                    <DrawerTitle className="text-lg">Review</DrawerTitle>
                    <DrawerDescription className="">
                        Give{" "}
                        <span className="text-foreground">{album.name}</span> a
                        rating, alongside an optional full review.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
