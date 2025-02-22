import { useEffect } from "react";
import { useCommandPalette } from "../stores/commandPaletteStore";
import { registerKeyboardShortcut } from "../utils/keyboard";

export const useCommandPaletteHandler = () => {
  const { openPalette } = useCommandPalette();

  useEffect(() => {
    const unregister = registerKeyboardShortcut(openPalette);
    return () => unregister();
  }, [openPalette]);
};
