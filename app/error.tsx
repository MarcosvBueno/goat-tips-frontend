"use client";

export default function GlobalError({
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
        500
      </div>
      <h2 className="text-[20px] font-semibold text-(--text) mb-2">
        Algo deu errado
      </h2>
      <p className="text-[14px] text-(--text2) text-center max-w-md mb-6">
        {error.message || "Ocorreu um erro inesperado. Tente novamente."}
      </p>
      <button
        onClick={reset}
        className="bg-[#012AFE] text-white px-6 py-2.5 rounded-lg text-[14px] font-semibold cursor-pointer hover:opacity-85 transition-opacity"
      >
        Tentar novamente
      </button>
    </div>
  );
}
