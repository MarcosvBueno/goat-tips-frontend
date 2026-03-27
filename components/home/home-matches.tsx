"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveMatches, useUpcomingMatches } from "@/hooks/use-matches";
import { MatchCard } from "@/components/home/match-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import type { Match } from "@/types/api";

/* ─── Filter tabs ─────────────────────────────────────────────────── */
const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "live", label: "Ao Vivo" },
  { id: "upcoming", label: "Próximas" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/* ─── Stagger animation config ────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: { duration: 0.25 },
  },
};

/* ═══════════════════════════════════════════════════════════════════ */
/* ═══  HOME MATCHES COMPONENT  ════════════════════════════════════= */
/* ═══════════════════════════════════════════════════════════════════ */

export function HomeMatches() {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const { data: liveMatches, isLoading: isLoadingLive } = useLiveMatches();
  const { data: upcomingMatches, isLoading: isLoadingUpcoming } =
    useUpcomingMatches();

  const isLoading = isLoadingLive && isLoadingUpcoming;

  const allMatches: Match[] = [
    ...(liveMatches ?? []),
    ...(upcomingMatches ?? []),
  ];

  const liveCount = liveMatches?.length ?? 0;

  const filteredMatches =
    activeFilter === "live"
      ? allMatches.filter((m) => m.status === "live")
      : activeFilter === "upcoming"
        ? allMatches.filter((m) => m.status === "upcoming")
        : allMatches;

  const displayMatches = filteredMatches.slice(0, 6);

  return (
    <section className="relative">
      {/* ── Background decoration ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle corner glow */}
        <div
          className="absolute -top-24 -right-24 w-[400px] h-[400px] opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(1,42,254,0.04) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[300px] h-[300px] opacity-50 hidden dark:block"
          style={{
            background:
              "radial-gradient(circle, rgba(1,42,254,0.06) 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ── Section header ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            {/* Label pill */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#012AFE]/[0.07] dark:bg-[#012AFE]/[0.14] border border-[#012AFE]/[0.1] dark:border-[#012AFE]/[0.22]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#012AFE]">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2 L12 12 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-bold text-[#012AFE] tracking-[0.08em] uppercase">
                  Partidas
                </span>
              </span>
              {liveCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF3B3B]/[0.08] dark:bg-[#FF3B3B]/[0.15] border border-[#FF3B3B]/[0.12] dark:border-[#FF3B3B]/[0.25]">
                  <span className="relative flex items-center justify-center w-[5px] h-[5px]">
                    <span className="absolute inset-0 rounded-full bg-[#FF3B3B] animate-ping opacity-50" />
                    <span className="w-[5px] h-[5px] rounded-full bg-[#FF3B3B]" />
                  </span>
                  <span className="text-[10px] font-bold text-[#FF3B3B] dark:text-[#FF6B6B] tracking-[0.06em] uppercase">
                    {liveCount} ao vivo
                  </span>
                </span>
              )}
            </div>

            {/* Section title */}
            <h2
              className="text-[32px] sm:text-[38px] uppercase tracking-[0.01em] text-(--text) dark:text-white leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Populares
              <span className="text-[#012AFE]">.</span>
            </h2>
            <p className="text-[13px] text-(--text3) dark:text-white/30 mt-1.5 max-w-[360px] leading-relaxed">
              Partidas em destaque com probabilidades calibradas e odds em tempo real
            </p>
          </div>

          {/* Right: filter tabs + "ver mais" */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06]">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`relative text-[12px] font-semibold px-3.5 py-[6px] rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap border-none outline-none ${
                      isActive
                        ? "text-[#012AFE] dark:text-[#7B9AFF]"
                        : "text-(--text3) dark:text-white/35 hover:text-(--text2) dark:hover:text-white/55"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="matchFilterPill"
                        className="absolute inset-0 bg-white dark:bg-white/[0.08] rounded-lg shadow-sm border border-black/[0.06] dark:border-white/[0.08]"
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {f.id === "live" && (
                        <span className="w-[5px] h-[5px] rounded-full bg-[#FF3B3B] shrink-0" />
                      )}
                      {f.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <Link
              href="/ao-vivo"
              className="group text-[12px] font-semibold text-[#012AFE] no-underline flex items-center gap-1 hover:gap-2 transition-all duration-200 py-[6px] px-3 rounded-lg hover:bg-[#012AFE]/[0.06] dark:hover:bg-[#012AFE]/[0.12]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ver mais
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* ── Match grid ──────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <CardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : displayMatches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative text-center py-16 rounded-2xl border border-dashed border-(--border) dark:border-white/[0.07] bg-black/[0.01] dark:bg-white/[0.02]"
          >
            {/* Empty state icon */}
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#012AFE]/[0.06] dark:bg-[#012AFE]/[0.12] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#012AFE]/60">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-[15px] text-(--text2) dark:text-white/50 font-medium">
              {activeFilter === "live"
                ? "Nenhuma partida ao vivo no momento"
                : activeFilter === "upcoming"
                  ? "Nenhuma partida agendada no momento"
                  : "Nenhuma partida disponível no momento"}
            </div>
            <div className="text-[12px] text-(--text3) dark:text-white/25 mt-1.5">
              Volte mais tarde para ver as partidas da Premier League
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {displayMatches.map((match) => (
                <motion.div key={match.event_id} variants={cardVariants}>
                  <MatchCard match={match} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Bottom decorative bar ───────────────────────────── */}
        {displayMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-between mt-6 pt-5 border-t border-(--border) dark:border-white/[0.05]"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#012AFE] animate-pulse" />
              <span className="text-[10px] text-(--text3) dark:text-white/22 tracking-[0.1em] uppercase font-medium">
                Atualizado automaticamente · Premier League 25/26
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[10px] text-(--text3) dark:text-white/22 tracking-wider uppercase">
                {allMatches.length} partida{allMatches.length !== 1 ? "s" : ""}
              </span>
              {liveCount > 0 && (
                <>
                  <span className="w-px h-3 bg-(--border) dark:bg-white/[0.06]" />
                  <span className="text-[10px] text-[#FF3B3B] dark:text-[#FF6B6B] tracking-wider uppercase font-medium">
                    {liveCount} live
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
