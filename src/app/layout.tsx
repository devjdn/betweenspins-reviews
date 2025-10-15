import type { Metadata } from "next";
import {
    Geist_Mono,
    DM_Serif_Display,
    Instrument_Serif,
    Instrument_Sans,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "./ReactQueryProvider";

import { shadcn } from "@clerk/themes";
import ConvexClientProvider from "./ConvexClientProvider";
import Footer from "@/components/ui/footer";

const instrument_sans = Instrument_Sans({
    variable: "--font-instrument-sans",
    subsets: ["latin"],
});

const dm_serif = DM_Serif_Display({
    weight: "400",
    variable: "--font-dm-serif",
    subsets: ["latin"],
});

const instrument_serif = Instrument_Serif({
    weight: "400",
    variable: "--font-instrument-serif",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Between Spins | Rate, Review, Discover.",
    description:
        "Between Spins is a music review and discovery platform where you can rate albums, share reviews, keep a personal music diary, and explore new artists and albums through the community.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                theme: shadcn,
            }}
        >
            <html lang="en" suppressHydrationWarning>
                <body
                    className={`${instrument_sans.variable} ${dm_serif.variable} ${instrument_serif.variable} ${geistMono.variable} antialiased flex flex-col h-dvh overflow-hidden`}
                >
                    <ConvexClientProvider>
                        <ReactQueryProvider>
                            <Header />

                            <main className="flex flex-col md:grid md:grid-cols-[256px_1fr] flex-1 md:pb-6 md:px-6 md:space-x-6 overflow-hidden relative">
                                <aside className="hidden md:flex bg-secondary rounded-xl"></aside>
                                <div className="overflow-y-scroll space-y-12 md:rounded-xl">
                                    {children}
                                    <Footer />
                                </div>
                            </main>
                        </ReactQueryProvider>
                    </ConvexClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
