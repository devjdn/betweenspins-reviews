import { create } from "zustand";

type ShaderColors = {
    color1: string;
    color2: string;
    color3: string;
};

type ShaderState = {
    colors: ShaderColors;
    setColors: (partial: Partial<ShaderColors>) => void;
    reset: () => void;
};

const DEFAULT_COLORS = {
    color1: "#F4A6FF",
    color2: "#9ecbff",
    color3: "#ffd59e",
};

export const useShaderStore = create<ShaderState>((set) => ({
    colors: DEFAULT_COLORS,
    setColors: (partial) =>
        set((state) => ({
            colors: { ...state.colors, ...partial },
        })),
    reset: () => set({ colors: DEFAULT_COLORS }),
}));
