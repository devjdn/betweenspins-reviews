import Link from "next/link";
import { Button } from "../button";
import {
    MessageCircle,
    Star,
    Mic2,
    Library,
    Compass,
    LayoutGrid,
} from "lucide-react";
import { FavouriteArtists } from "./artists";
import ThemeSwitcher from "../theme-switcher";

export default function Sidebar({ clerkUserId }: { clerkUserId?: string }) {
    const links = [
        { name: "Feed", href: "/feed", icon: LayoutGrid },
        { name: "Reviews", href: "/reviews", icon: MessageCircle },
        { name: "Ratings", href: "/ratings", icon: Star },
        { name: "Albums", href: "/albums", icon: Library },
        { name: "Artists", href: "/artists", icon: Mic2 },
        { name: "Discover", href: "/discover", icon: Compass },
    ];
    return (
        <aside className="hidden md:flex md:flex-col md:gap-3 *:px-3 pt-6 *:pb-3 rounded-xl bg-muted *:shrink">
            <div className="flex flex-col w-full">
                <p className="pl-4 mb-2 font-medium text-xs text-muted-foreground">
                    Explore
                </p>
                {links.map((l, i) => (
                    <Button
                        key={i}
                        variant={"ghost"}
                        size={"lg"}
                        className="rounded-md w-full justify-start"
                        asChild
                    >
                        <Link prefetch href={l.href}>
                            <l.icon />
                            <span>{l.name}</span>
                        </Link>
                    </Button>
                ))}
            </div>
            {clerkUserId && (
                <>
                    <FavouriteArtists clerkUserId={clerkUserId} />{" "}
                </>
            )}
            <ThemeSwitcher />
        </aside>
    );
}
