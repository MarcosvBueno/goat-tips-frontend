"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Store Lenis instance in a ref to avoid type conflicts with Window
type LenisInstance = Lenis;

/**
 * Provider que inicializa o Lenis smooth scroll em toda a aplicação.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    // Inicializa o Lenis com configurações otimizadas
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
    });

    lenisRef.current = lenis;

    // Raf loop para o Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
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
