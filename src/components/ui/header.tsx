"use client";

import Link from "next/link";
import React from "react";
import {
    Disc,
    Disc3,
    LogOut,
    PenLine,
    Settings,
    UserRound,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BetweenSpinsLogo from "../logo";

export default function Header() {
    const { isSignedIn, user, isLoaded } = useUser();
    const { signOut } = useAuth();

    return (
        <header className="z-10 h-14 flex items-center justify-between px-4 md:px-6">
            <Link href={"/"}>
                <div className="flex items-center gap-0.5">
                    <BetweenSpinsLogo size={30} />
                    <span className="text-lg font-sans font-semibold tracking-[-0.075em]">
                        Between Spins
                    </span>
                </div>
            </Link>

            <div>
                {isLoaded && isSignedIn && user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="rounded-full hover:outline-4 transition-all cursor-pointer">
                                <Avatar>
                                    <AvatarFallback>
                                        {user.firstName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                    <AvatarImage src={user.imageUrl} />
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-2 border-none bg-secondary/30 backdrop-blur-md"
                            side={"bottom"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel asChild>
                                <div className="flex items-center gap-2 p-2 rounded-lg">
                                    <Avatar>
                                        <AvatarFallback>
                                            {user.firstName
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                        <AvatarImage src={user.imageUrl} />
                                    </Avatar>
                                    <div className="leading-tight">
                                        <p className="truncate text-xs text-muted-foreground font-medium">
                                            Signed in as
                                        </p>
                                        <p className="truncate text-foreground font-semibold">
                                            {user.firstName}
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup className="font-medium">
                                <DropdownMenuItem
                                    className="rounded-lg focus:bg-accent/60"
                                    asChild
                                >
                                    <Link href={"/profile"}>
                                        <UserRound />
                                        View Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="rounded-lg focus:bg-accent/60"
                                    asChild
                                >
                                    <Link href={"/profile"}>
                                        <PenLine />
                                        Edit Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg focus:bg-accent/60">
                                    <Settings />
                                    Settings
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="rounded-lg font-medium focus:bg-accent/60"
                                onClick={() => signOut()}
                            >
                                <LogOut />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
