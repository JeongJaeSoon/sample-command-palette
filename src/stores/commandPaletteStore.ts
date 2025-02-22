import { create } from "zustand";

interface CommandPaletteState {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
}

export const useCommandPalette = create<CommandPaletteState>((set) => ({
  isOpen: false,
  openPalette: () => set({ isOpen: true }),
  closePalette: () => set({ isOpen: false }),
}));
