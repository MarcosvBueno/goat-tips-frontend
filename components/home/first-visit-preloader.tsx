"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader as MobilePreloader } from "@/components/home/preloader-mobile";

const GIF_SRC = "/Composi%C3%A7%C3%A3o%201_3.gif";
const PRELOADER_FALLBACK_MS = 3200;
const GIF_END_TRIM_MS = 320;

function getGifDurationMs(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let i = 0;
  let totalDelayCs = 0;

  while (i < bytes.length - 5) {
    const isGraphicControlExtension =
      bytes[i] === 0x21 && bytes[i + 1] === 0xf9 && bytes[i + 2] === 0x04;

    if (isGraphicControlExtension) {
      const delayCs = bytes[i + 4] | (bytes[i + 5] << 8);
      totalDelayCs += delayCs;
      i += 8;
      continue;
    }

    i += 1;
  }

  const durationMs = totalDelayCs * 10;
  return durationMs > 0 ? durationMs : PRELOADER_FALLBACK_MS;
}

export function FirstVisitPreloader({ children }: { children: React.ReactNode }) {
  const [preloaderActive, setPreloaderActive] = useState(true);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const updateViewport = () => {
      setIsMobileOrTablet(mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (isMobileOrTablet === null || isMobileOrTablet) return;

    let timeoutId: number | null = null;
    let cancelled = false;

    const startPreloader = async () => {
      let durationMs = PRELOADER_FALLBACK_MS;

      try {
        const response = await fetch(GIF_SRC, { cache: "force-cache" });
        const buffer = await response.arrayBuffer();
        durationMs = getGifDurationMs(buffer);
      } catch {
        durationMs = PRELOADER_FALLBACK_MS;
      }

      if (cancelled) return;

      const adjustedDuration = Math.max(300, durationMs - GIF_END_TRIM_MS);

      timeoutId = window.setTimeout(() => {
        setPreloaderActive(false);
      }, adjustedDuration);
    };

    void startPreloader();

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isMobileOrTablet]);

  const showBootMask = preloaderActive && isMobileOrTablet === null;
  const showMobilePreloader = preloaderActive && isMobileOrTablet === true;
  const showDesktopPreloader = preloaderActive && isMobileOrTablet === false;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: preloaderActive ? 0 : 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {showBootMask && <div className="fixed inset-0 z-[120] bg-white dark:bg-black" />}

      {showMobilePreloader && (
        <MobilePreloader onComplete={() => setPreloaderActive(false)} />
      )}

      <AnimatePresence>
        {showDesktopPreloader && (
          <motion.div
            key="home-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-white dark:bg-black"
          >
            <img
              src={GIF_SRC}
              alt="Goat Tips Intro"
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
