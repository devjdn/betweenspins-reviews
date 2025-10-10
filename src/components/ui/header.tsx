"use client";

import Link from "next/link";
import React from "react";
import { LogOut, Settings, UserRound } from "lucide-react";
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
import { BetweenSpinsLogo } from "../logo";
import HeaderSearch from "./search/header-search";

export default function Header() {
    const { isSignedIn, user, isLoaded } = useUser();
    const { signOut } = useAuth();

    return (
        <header className="absolute w-full z-10 h-14 flex md:grid md:grid-cols-[150px_1fr_150px] md:gap-24 items-center justify-between px-4 md:px-6">
            <Link href={"/"}>
                <div className="flex items-center gap-1">
                    <BetweenSpinsLogo size={25} />
                    <span className="text-lg font-sans font-semibold tracking-[-0.075em]">
                        Between Spins
                    </span>
                </div>
            </Link>

            <div className="hidden md:flex max-w-xl min-w-lg mx-auto w-full">
                <HeaderSearch />
            </div>

            <div className="justify-self-end size-8">
                {isLoaded && isSignedIn && user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="rounded-full hover:outline-4 transition-all cursor-pointer"
                            >
                                <Avatar>
                                    <AvatarFallback>
                                        {user.firstName
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                    <AvatarImage src={user.imageUrl} />
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-2 border-none bg-secondary/80 backdrop-blur-md"
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
                                <DropdownMenuItem className="rounded-lg focus:bg-accent/60">
                                    <Settings />
                                    Settings
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="rounded-lg font-medium focus:bg-accent/60"
                                onClick={() => signOut()}
                                variant="destructive"
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
