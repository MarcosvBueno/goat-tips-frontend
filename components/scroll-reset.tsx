"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Componente que garante que o scroll seja resetado ao topo
 * ao navegar entre páginas no Next.js App Router.
 *
 * Escuta mudanças de pathname para disparar a cada navegação,
 * e usa lenis.scrollTo quando disponível para compatibilidade.
 */
export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenisInstance = (window as any).lenis as Lenis | undefined;

    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
