"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Provider que inicializa o Lenis smooth scroll em toda a aplicação.
 * Expõe a instância em window.lenis para que ScrollReset possa usá-la.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
    });

    lenisRef.current = lenis;

    // Expose on window so ScrollReset can access it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}

/**
 * Hook para acessar a instância do Lenis via contexto futuro
 * Por enquanto retorna null - pode ser expandido para usar React Context
 */
export function useLenis() {
  return null;
}
