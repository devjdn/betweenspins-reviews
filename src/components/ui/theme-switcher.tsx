"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./button";

export default function ThemeSwitcher() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            <Sun className="dark:hidden" />
            <Moon className="hidden dark:block" />
        </Button>
    );
}
