"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useShaderStore } from "@/stores/shaderStore";

type ShaderColorUpdaterProps = {
    color?: string;
};

export default function ShaderColorUpdater({ color }: ShaderColorUpdaterProps) {
    const setColor = useShaderStore((s) => s.setColor);
    const reset = useShaderStore((s) => s.reset);
    const pathname = usePathname();

    useEffect(() => {
        if (!color) {
            reset();
            return;
        }

        setColor(color);
    }, [pathname, color, setColor, reset]);

    return null;
}
