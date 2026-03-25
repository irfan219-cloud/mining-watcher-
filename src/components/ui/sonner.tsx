import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Sonner toaster with safe theme handling.
 * Uses 'dark' as default to match the app's dark industrial theme.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  // Safely try to get theme, fallback to dark
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("dark");

  React.useEffect(() => {
    // Check for next-themes after mount
    const getTheme = async () => {
      try {
        const { useTheme } = await import("next-themes");
        // This won't work in useEffect, just detect if dark mode class exists
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
      } catch {
        // Fallback to dark
      }
    };
    getTheme();

    // Watch for class changes
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
