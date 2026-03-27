"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Componente que garante que o scroll seja resetado ao topo
 * ao navegar entre páginas no Next.js App Router.
 * 
 * Compatível com Lenis - usa lenis.scrollTo quando disponível.
 */
export function ScrollReset() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Tenta usar Lenis primeiro, se disponível
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenisInstance = (window as unknown as { lenis?: Lenis }).lenis;
    
    if (lenisInstance) {
      // Usa Lenis para scroll suave ao topo
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      // Fallback para scroll nativo
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return null;
}
