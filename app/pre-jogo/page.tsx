"use client";

import { UpcomingCard } from "@/components/prejogo/upcoming-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpcomingMatches } from "@/hooks/use-matches";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PreJogoPage() {
  const { data: matches, isLoading } = useUpcomingMatches();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredMatches =
    matches?.filter(() => {
      if (activeFilter === "all" || activeFilter === "pl") return true;
      return false;
    }) || [];

  const visibleMatches = filteredMatches.slice(0, visibleCount);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-6 sm:pt-10">
        {/* Hero / Header Section */}
        <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 animate-fade-in">
          <div>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-black leading-none mb-4 uppercase tracking-[-0.02em] text-(--text)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Próximos Jogos
            </h1>
            <p className="text-(--text2) max-w-xl text-xs sm:text-sm leading-relaxed border-l-2 border-[var(--primary)] pl-3 sm:pl-4 font-medium">
              Análises orientadas por algoritmos. Modelos matemáticos
              identificando vantagens nos mercados globais de futebol baseados
              em sinais de distribuição de Poisson.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="bg-(--card2) px-4 py-2 rounded-lg text-right border border-(--border)">
              <span className="block text-[10px] uppercase text-(--text2) tracking-widest font-bold">
                Live Feed
              </span>
              <span
                className="text-[var(--primary)] font-bold text-xl uppercase tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {isLoading ? "..." : matches?.length || 0} Ativos
              </span>
            </div>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-none animate-fade-in">
          {[
            { id: "all", label: "Tudo" },
            { id: "pl", label: "Premier League" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveFilter(item.id);
                setVisibleCount(10);
              }}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shrink-0 transition-all active:scale-95 ${
                activeFilter === item.id
                  ? "bg-[var(--primary)] text-white shadow-[0_0_20px_rgba(1,42,254,0.3)]"
                  : "bg-(--card2) border border-(--border2) text-(--text2) hover:text-(--text) hover:bg-(--surface)"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Match Grid */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-[14px]" />
            ))
          ) : !filteredMatches || filteredMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 text-center py-12"
            >
              <div
                className="text-[48px] text-(--text3) mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ⚽
              </div>
              <div className="text-[16px] text-(--text2) font-medium">
                Nenhum jogo agendado no momento para esta seleção
              </div>
              <div className="text-[13px] text-(--text3) mt-1">
                Verifique outras abas ou torneios para novos sinais
              </div>
            </motion.div>
          ) : (
            <>
              {visibleMatches.map((match, index) => (
                <motion.div
                  key={match.event_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % 10) * 0.1 }}
                >
                  <UpcomingCard match={match} />
                </motion.div>
              ))}

              {filteredMatches && visibleCount < filteredMatches.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mt-6"
                >
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="bg-(--card2) border border-(--border2) text-(--text2) hover:text-(--text) hover:bg-(--surface) px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-sm cursor-pointer"
                  >
                    Ver Mais Jogos
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Bento Analysis Module */}
        {!isLoading && matches && matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2 bg-(--card2) border border-(--border) p-6 sm:p-8 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[var(--primary)] opacity-5 rounded-full blur-[80px] sm:blur-[100px] -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
              <h3
                className="text-2xl sm:text-3xl mb-4 text-(--text) uppercase tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Análise Algorítmica
              </h3>
              <p className="text-(--text2) text-sm leading-relaxed mb-6 font-medium">
                Nosso modelo Poisson calcula probabilidades baseado na força de
                ataque atual versus resistência de defesa, ajustada taticamente.
                Atualmente visualizando tendências de Over 2.5 gols na próxima
                rodada da Premier League.
              </p>
              <div className="flex gap-4">
                <div className="bg-(--bg3) px-6 py-4 rounded-lg flex-1 border border-(--border2)">
                  <span className="block text-[10px] uppercase text-(--text2) tracking-widest mb-1 font-bold">
                    Confiança do Modelo
                  </span>
                  <span
                    className="text-3xl font-bold text-[var(--primary)] uppercase tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    88.4%
                  </span>
                </div>
                <div className="bg-(--bg3) px-6 py-4 rounded-lg flex-1 border border-(--border2)">
                  <span className="block text-[10px] uppercase text-(--text2) tracking-widest mb-1 font-bold">
                    Fator de Assimetria
                  </span>
                  <span
                    className="text-3xl font-bold text-[var(--primary)] uppercase tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    BAIXO
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--primary)] p-8 rounded-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div
                className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none"
                style={{
                  backgroundSize: "10px 10px",
                  backgroundImage:
                    "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                }}
              ></div>
              <div className="relative z-10">
                <h3
                  className="text-3xl text-white mb-2 uppercase tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Alerta ao Vivo
                </h3>
                <p className="text-white/70 text-xs uppercase tracking-widest font-bold">
                  Anomalia Poisson Detectada
                </p>
              </div>
              <div className="mt-8 relative z-10">
                <p className="text-white font-medium text-sm mb-6 leading-relaxed">
                  Diferença de valor no &apos;Empate&apos; no evento principal.
                  Modelo sugere discrepância de mercado.
                </p>
                <button className="w-full bg-white text-primary py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors active:scale-95 shadow-md">
                  Acessar Mercado
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
