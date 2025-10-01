import Link from "next/link";
import BetweenSpinsLogo from "../logo";

export default function Footer() {
    return (
        <footer className="bg-secondary border-t px-4 md:px-6 py-4 space-y-8">
            <div className="">
                <Link href={"/"}>
                    <div className="flex items-center gap-0.5">
                        <BetweenSpinsLogo size={30} />
                        <span className="text-lg font-sans font-semibold tracking-[-0.075em]">
                            Between Spins
                        </span>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Between Spins. All rights
                    reserved.
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
        </footer>
    );
}
