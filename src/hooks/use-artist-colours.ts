"use client";

import { useEffect, useState } from "react";
import ColorThief from "colorthief";

export function useArtistColors(artistImages: string[]) {
    const [colors, setColors] = useState<number[][]>([]);

    useEffect(() => {
        const thief = new ColorThief();
        const imgEls: HTMLImageElement[] = [];

        async function getColors() {
            const results: number[][] = [];
            for (const url of artistImages) {
                const img = new Image();
                img.crossOrigin = "anonymous"; // important for Spotify images
                img.src = url;

                await new Promise((resolve) => {
                    img.onload = () => {
                        try {
                            const color = thief.getColor(img); // [r,g,b]
                            results.push(color);
                        } catch {
                            results.push([200, 200, 200]); // fallback
                        }
                        resolve(true);
                    };
                });
                imgEls.push(img);
            }
            setColors(results);
        }

        getColors();
        return () => imgEls.forEach((img) => (img.src = ""));
    }, [artistImages]);

    return colors;
}
