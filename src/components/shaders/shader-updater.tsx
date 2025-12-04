"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useShaderStore } from "@/stores/shaderStore";

type ShaderColorUpdaterProps = {
    color1?: string;
    color2?: string;
    color3?: string;
};

export default function ShaderColorUpdater({
    color1,
    color2,
    color3,
}: ShaderColorUpdaterProps) {
    const setColors = useShaderStore((s) => s.setColors);
    const reset = useShaderStore((s) => s.reset);
    const pathname = usePathname();

    useEffect(() => {
        // If no colors are provided, reset to defaults
        if (!color1 && !color2 && !color3) {
            console.log("No colors provided, resetting to defaults");
            reset();
            return;
        }

        console.log("Route changed, updating shader:", pathname, {
            color1,
            color2,
            color3,
        });

        setColors({
            ...(color1 && { color1 }),
            ...(color2 && { color2 }),
            ...(color3 && { color3 }),
        });
    }, [pathname, color1, color2, color3, setColors, reset]);

    return null;
}
