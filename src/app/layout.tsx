import type { Metadata } from "next";
import {
    Inter,
    Geist_Mono,
    DM_Serif_Display,
    Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/components/ui/header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

const inter = Inter({
    variable: "--font-inter",
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
                    className={`${inter.variable} ${dm_serif.variable} ${instrument_serif.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider attribute={"class"} defaultTheme="dark">
                        <Header />
                        <main className="px-4 py-8 md:py-12 xl:py-16">
                            {children}
                        </main>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
