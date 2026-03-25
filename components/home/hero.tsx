import Link from "next/link";

export function Hero() {
  return (
    <div className="px-6 pt-12 pb-8 max-w-[1280px] mx-auto">
      <div className="text-[12px] font-semibold text-[#012AFE] tracking-[0.1em] uppercase mb-3 flex items-center gap-2">
        <span className="block w-5 h-0.5 bg-[#012AFE] rounded-sm" />
        Análise com IA · Premier League 2025/26
      </div>

      <h1
        className="text-[clamp(40px,7vw,84px)] leading-[0.95] uppercase tracking-[-0.01em] text-(--text) mb-5 max-w-[680px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Tips que<br />
        <span className="text-[#012AFE]">realmente</span>
        <br />convertem.
      </h1>

      <p className="text-[15px] text-(--text2) max-w-[420px] leading-[1.6] mb-7">
        Probabilidades calibradas com dados históricos, modelo xG ao vivo e análise de padrões. Sem viés humano, sem achismo.
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/ao-vivo"
          className="text-[13px] font-semibold bg-[#012AFE] text-white border-none px-[18px] py-[8px] rounded-lg cursor-pointer tracking-[0.02em] hover:opacity-[0.88] hover:-translate-y-px transition-all duration-200 whitespace-nowrap no-underline"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Ver jogos ao vivo
        </Link>
        <Link
          href="/tipster"
          className="text-[13px] font-semibold bg-transparent text-(--text) border border-(--border2) px-[18px] py-[8px] rounded-lg cursor-pointer tracking-[0.02em] hover:bg-(--pill-bg) hover:border-(--text3) transition-all duration-200 whitespace-nowrap no-underline"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Perguntar ao Tipster IA
        </Link>
      </div>

      <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border flex-wrap">
        <div>
          <div
            className="text-[28px] text-(--text) leading-none tracking-[0.01em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            84<span className="text-[#012AFE]">%</span>
          </div>
          <div className="text-[12px] text-(--text2) mt-[3px]">Acurácia geral</div>
        </div>
        <div className="w-px h-9 bg-border" />
        <div>
          <div
            className="text-[28px] text-(--text) leading-none tracking-[0.01em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            1.8<span className="text-[#012AFE]">k+</span>
          </div>
          <div className="text-[12px] text-(--text2) mt-[3px]">Partidas analisadas</div>
        </div>
        <div className="w-px h-9 bg-border" />
        <div>
          <div
            className="text-[28px] text-(--text) leading-none tracking-[0.01em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            3<span className="text-[#012AFE]"> APIs</span>
          </div>
          <div className="text-[12px] text-(--text2) mt-[3px]">Fontes de dados</div>
        </div>
      </div>
    </div>
  );
}
