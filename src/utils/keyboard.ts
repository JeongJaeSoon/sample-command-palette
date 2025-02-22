export const registerKeyboardShortcut = (callback: () => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      console.log("✅ 커맨드 팔레트 단축키 감지됨");
      callback();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
};


