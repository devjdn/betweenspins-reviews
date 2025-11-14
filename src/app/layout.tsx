import type { Metadata } from "next";
import {
    Geist_Mono,
    DM_Serif_Display,
    Instrument_Sans,
    Source_Serif_4,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "./ReactQueryProvider";
import { shadcn } from "@clerk/themes";
import ConvexClientProvider from "./ConvexClientProvider";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";

const instrument_sans = Instrument_Sans({
    variable: "--font-instrument-sans",
    subsets: ["latin"],
});

const dm_serif = DM_Serif_Display({
    weight: "400",
    variable: "--font-dm-serif",
    subsets: ["latin"],
});

const source_serif = Source_Serif_4({
    variable: "--font-source-serif",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Between Spins",
        default: "Between Spins | Rate, Review, Discover.",
    },
    description:
        "Between Spins is a music review and discovery platform where you can rate albums, share reviews, keep a personal music diary, and explore new artists and albums through the community.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense>
            <ClerkProvider
                appearance={{
                    theme: shadcn,
                }}
            >
                <html lang="en" suppressHydrationWarning>
                    <body
                        className={`${instrument_sans.variable} ${dm_serif.variable} ${source_serif.variable} ${geistMono.variable} antialiased flex flex-col overscroll-auto md:h-svh`}
                    >
                        <ConvexClientProvider>
                            <ReactQueryProvider>
                                <ThemeProvider
                                    attribute={"class"}
                                    defaultTheme="dark"
                                >
                                    <Header />
                                    {children}
                                </ThemeProvider>
                            </ReactQueryProvider>
                        </ConvexClientProvider>
                    </body>
                </html>
            </ClerkProvider>
        </Suspense>
    );
}
