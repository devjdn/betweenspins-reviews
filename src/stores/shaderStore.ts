import { create } from "zustand";

type ShaderState = {
    color: string;
    setColor: (color: string) => void;
    reset: () => void;
};

const DEFAULT_COLOR = "rgb(135, 197, 245)"; // Nice neutral blue-gray

export const useShaderStore = create<ShaderState>((set) => ({
    color: DEFAULT_COLOR,
    setColor: (color) => set({ color }),
    reset: () => set({ color: DEFAULT_COLOR }),
}));
