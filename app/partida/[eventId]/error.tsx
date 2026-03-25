"use client";

import Link from "next/link";

export default function MatchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div
        className="text-[48px] text-(--text3) mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        ⚠️
      </div>
      <h2 className="text-[20px] font-semibold text-(--text) mb-2">
        Erro ao carregar partida
      </h2>
      <p className="text-[14px] text-(--text2) text-center max-w-md mb-6">
        {error.message || "Não foi possível carregar os dados desta partida."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-[#012AFE] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold cursor-pointer hover:opacity-85 transition-opacity"
        >
          Tentar novamente
        </button>
        <Link
          href="/ao-vivo"
          className="bg-(--bg3) text-(--text) px-5 py-2.5 rounded-lg text-[14px] font-semibold no-underline hover:bg-(--bg2) transition-colors"
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
