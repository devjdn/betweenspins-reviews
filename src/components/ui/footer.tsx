import Link from "next/link";
import { BetweenSpinsLogo } from "../logo";

export default function Footer() {
    return (
        <footer className="border-t md:border-none bg-muted md:rounded-xl px-4 md:px-8 pt-4 pb-12 space-y-8">
            <div className="mx-auto w-full max-w-6xl flex flex-col gap-4">
                <div className="">
                    <Link href={"/"}>
                        <div className="flex items-center gap-1">
                            <BetweenSpinsLogo size={25} />
                            <span className="text-lg font-sans font-semibold tracking-[-0.075em]">
                                Between Spins
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-1 gap-x-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Between Spins. All
                        rights reserved.
                    </p>
                    <span className="text-sm text-muted-foreground">
                        All music data provided by{" "}
                        <Link
                            href={"https://spotify.com"}
                            className="hover:underline"
                            target="_blank"
                        >
                            Spotify
                        </Link>
                        .
                    </span>
                </div>
            </div>
        </footer>
    );
}
