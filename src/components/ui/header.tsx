"use client";

import Link from "next/link";
import { BetweenSpinsLogo } from "../logo";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 h-14 px-4 gap-4 grid grid-flow-col items-center">
            <Link href={"/"} className="">
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
