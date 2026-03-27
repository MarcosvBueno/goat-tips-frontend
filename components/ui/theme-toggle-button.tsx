"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type AnimationVariant = "circle" | "rectangle" | "polygon";
type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "top-center"
  | "bottom-center"
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left";

interface Animation {
  name: string;
  css: string;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const getClipPath = (direction: AnimationStart) => {
  switch (direction) {
    case "bottom-up":
      return {
        from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "top-down":
      return {
        from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "left-right":
      return {
        from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "right-left":
      return {
        from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "top-left":
      return {
        from: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "top-right":
      return {
        from: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "bottom-left":
      return {
        from: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "bottom-right":
      return {
        from: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    default:
      return {
        from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
  }
};

const createAnimation = (
  variant: AnimationVariant,
  start: AnimationStart,
): Animation => {
  if (variant === "polygon") {
    const getPolygonClipPaths = (position: AnimationStart) => {
      switch (position) {
        case "top-right":
          return {
            darkFrom: "polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%)",
            darkTo: "polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%)",
            lightFrom: "polygon(-71% 50%, 50% 171%, 50% 171%, -71% 50%)",
            lightTo: "polygon(-71% 50%, 50% 171%, 250% 71%, 150% -71%)",
          };
        default:
          return {
            darkFrom: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
            darkTo: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
            lightFrom: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
            lightTo: "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)",
          };
      }
    };

    const clipPaths = getPolygonClipPaths(start);

    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out, cubic-bezier(0.16, 1, 0.3, 1));
      }

      ::view-transition-new(root) {
        animation-name: reveal-light-${start};
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }

      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start};
      }

      @keyframes reveal-dark-${start} {
        from { clip-path: ${clipPaths.darkFrom}; }
        to { clip-path: ${clipPaths.darkTo}; }
      }

      @keyframes reveal-light-${start} {
        from { clip-path: ${clipPaths.lightFrom}; }
        to { clip-path: ${clipPaths.lightTo}; }
      }
      `,
    };
  }

  if (variant === "circle") {
    const clipPosition =
      start === "top-left"
        ? "0% 0%"
        : start === "top-right"
          ? "100% 0%"
          : start === "bottom-left"
            ? "0% 100%"
            : start === "bottom-right"
              ? "100% 100%"
              : start === "top-center"
                ? "50% 0%"
                : start === "bottom-center"
                  ? "50% 100%"
                  : "50% 50%";

    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 0.8s;
        animation-timing-function: var(--expo-out, cubic-bezier(0.16, 1, 0.3, 1));
      }

      ::view-transition-new(root) {
        animation-name: reveal-light-${start};
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }

      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start};
      }

      @keyframes reveal-dark-${start} {
        from { clip-path: circle(0% at ${clipPosition}); }
        to { clip-path: circle(150% at ${clipPosition}); }
      }

      @keyframes reveal-light-${start} {
        from { clip-path: circle(0% at ${clipPosition}); }
        to { clip-path: circle(150% at ${clipPosition}); }
      }
      `,
    };
  }

  const clipPath = getClipPath(start);

  return {
    name: `${variant}-${start}`,
    css: `
    ::view-transition-group(root) {
      animation-duration: 0.7s;
      animation-timing-function: var(--expo-out, cubic-bezier(0.16, 1, 0.3, 1));
    }

    ::view-transition-new(root) {
      animation-name: reveal-light-${start};
    }

    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }

    .dark::view-transition-new(root) {
      animation-name: reveal-dark-${start};
    }

    @keyframes reveal-dark-${start} {
      from { clip-path: ${clipPath.from}; }
      to { clip-path: ${clipPath.to}; }
    }

    @keyframes reveal-light-${start} {
      from { clip-path: ${clipPath.from}; }
      to { clip-path: ${clipPath.to}; }
    }
    `,
  };
};

const useThemeToggle = ({
  variant = "rectangle",
  start = "bottom-up",
}: {
  variant?: AnimationVariant;
  start?: AnimationStart;
} = {}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const updateStyles = useCallback((css: string) => {
    const styleId = "theme-transition-styles";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    const animation = createAnimation(variant, start);
    updateStyles(animation.css);

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition) {
      switchTheme();
      return;
    }

    doc.startViewTransition(switchTheme);
  }, [setTheme, theme, updateStyles, variant, start]);

  return { isDark, toggleTheme };
};

export function ThemeToggleButton({
  className,
  variant = "rectangle",
  start = "bottom-up",
}: {
  className?: string;
  variant?: AnimationVariant;
  start?: AnimationStart;
}) {
  const { isDark, toggleTheme } = useThemeToggle({ variant, start });

  return (
    <button
      type="button"
      className={cn(
        "size-8 cursor-pointer rounded-lg border border-(--border2) bg-(--pill-bg) p-0 transition-all duration-300 active:scale-95",
        className,
      )}
      onClick={toggleTheme}
      title="Alternar tema"
      aria-label="Alternar tema"
    >
      <span className="sr-only">Alternar tema</span>
      <span className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <motion.span
          className="absolute"
          initial={false}
          animate={{
            rotate: isDark ? 0 : -70,
            scale: isDark ? 1 : 0.55,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Sun size={14} strokeWidth={2} />
        </motion.span>
        <motion.span
          className="absolute"
          initial={false}
          animate={{
            rotate: isDark ? 70 : 0,
            scale: isDark ? 0.55 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Moon size={14} strokeWidth={2} />
        </motion.span>
      </span>
    </button>
  );
}
