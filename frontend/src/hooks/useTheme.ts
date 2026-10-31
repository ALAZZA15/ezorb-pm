import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
};
const getTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("ezorb-theme", theme);
  } catch {
    /* storage unavailable */
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);
  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark"), setTheme };
}