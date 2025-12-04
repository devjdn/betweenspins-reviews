"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "../sidebar";
import {
    Compass,
    LayoutGrid,
    Library,
    Menu,
    MessageCircle,
    Mic2,
    Star,
} from "lucide-react";
import { BetweenSpinsLogo } from "@/components/logo";
import { Separator } from "../separator";
import HeaderSearch from "../search/header-search";

export default function AppSidebar({ clerkUserId }: { clerkUserId?: string }) {
    const pathname = usePathname();

    const links = [
        { name: "Feed", href: "/feed", icon: LayoutGrid },
        {
            name: "Reviews",
            href: "/album/34LxHI9x14qXUOS8AWRrYD",
            icon: MessageCircle,
        },
        {
            name: "Ratings",
            href: "/album/1oIICL75sMuInkEhX8jj3b",
            icon: Star,
        },
        {
            name: "Albums",
            href: "/album/29yxKl8iktRPSLvWv2QMna",
            icon: Library,
        },
        { name: "Artists", href: "/artists", icon: Mic2 },
        { name: "Discover", href: "/discover", icon: Compass },
    ];

    return (
        <Sidebar side="left" variant="sidebar">
            <SidebarContent>
                <SidebarHeader>
                    <Link href={"/"}>
                        <div className="flex items-center gap-1">
                            <BetweenSpinsLogo size={32} />
                            <span className="text-lg font-sans font-semibold tracking-[-0.075em]">
                                Between Spins
                            </span>
                        </div>
                    </Link>
                </SidebarHeader>
                <div className="px-2 pb-2">
                    <HeaderSearch />
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel>Explore</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map(({ name, href, icon: Icon }) => (
                                <SidebarMenuItem key={href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === href}
                                    >
                                        <Link
                                            prefetch
                                            href={href}
                                            className="gap-3"
                                        >
                                            <Icon className="size-4 shrink-0 text-muted-foreground" />
                                            <span className="truncate">
                                                {name}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

export function MobileHeader() {
    return (
        <header className="sticky top-0 z-50 bg-background border-b h-14 px-4 gap-4 grid grid-cols-[80px_1fr_80px] grid-flow-col items-center md:hidden">
            <SidebarTrigger />
            <Link href={"/"} className="place-self-center">
                <div className="flex items-center gap-1">
                    <BetweenSpinsLogo size={32} />
                    <span className="text-lg font-sans font-semibold tracking-[-0.075em]">
                        Between Spins
                    </span>
                </div>
            </Link>
        </header>
    );
}
