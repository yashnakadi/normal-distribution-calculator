import React, { useState, useRef, useEffect } from "react";
import { Settings, Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun size={15} /> },
    { value: "dark", label: "Dark", icon: <Moon size={15} /> },
    { value: "system", label: "System", icon: <Monitor size={15} /> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Settings"
      >
        <Settings size={17} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2.5 border-b border-border">
            <span className="text-[0.75rem] text-muted-foreground uppercase tracking-wider">
              Appearance
            </span>
          </div>
          <div className="p-1.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.85rem] transition-colors ${
                  theme === opt.value
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                {opt.icon}
                {opt.label}
                {theme === opt.value && (
                  <span className="ml-auto text-blue-500 text-[0.75rem]">
                    &#10003;
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
