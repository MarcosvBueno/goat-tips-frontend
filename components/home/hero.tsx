"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ─── Mini live odds pill (simulated) ─────────────────────────────── */
const LIVE_ODDS = [
  { home: "ARS", away: "CHE", odds: ["1.72", "3.80", "4.50"], minute: "34'" },
  { home: "LIV", away: "MCI", odds: ["2.10", "3.40", "3.20"], minute: "61'" },
  { home: "TOT", away: "NEW", odds: ["2.05", "3.55", "3.30"], minute: "17'" },
];

function LiveOddsPill({
  data,
  delay,
}: {
  data: (typeof LIVE_ODDS)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/[0.07] dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)] shrink-0"
    >
      {/* Live dot */}
      <span className="relative flex items-center justify-center w-[6px] h-[6px] shrink-0">
        <span className="absolute inset-0 rounded-full bg-[#FF3B3B] animate-ping opacity-60" />
        <span className="relative w-[6px] h-[6px] rounded-full bg-[#FF3B3B]" />
      </span>

      <span className="text-[10px] font-bold text-(--text) dark:text-white/80 tracking-wide uppercase whitespace-nowrap">
        {data.home}
        <span className="text-(--text3) dark:text-white/30 mx-1">vs</span>
        {data.away}
      </span>

      <div className="flex items-center gap-1">
        {["1", "X", "2"].map((label, i) => (
          <span
            key={label}
            className={`text-[10px] font-semibold px-2 py-[3px] rounded-md transition-colors
              ${
                i === 0
                  ? "bg-[#012AFE]/10 dark:bg-[#012AFE]/20 text-[#012AFE] dark:text-[#6B8AFF]"
                  : "bg-black/[0.04] dark:bg-white/[0.06] text-(--text2) dark:text-white/50"
              }`}
          >
            {data.odds[i]}
          </span>
        ))}
      </div>

      <span className="text-[9px] font-medium text-(--text3) dark:text-white/30 tabular-nums">
        {data.minute}
      </span>
    </motion.div>
  );
}

/* ─── Animated stat counter ───────────────────────────────────────── */
function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: string;
  suffix: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="text-[32px] md:text-[36px] text-(--text) dark:text-white leading-none tracking-[0.01em]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
        <span className="text-[#012AFE]">{suffix}</span>
      </div>
      <div className="text-[11px] text-(--text3) dark:text-white/30 mt-1 tracking-[0.02em]">
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Floating field pattern (football pitch lines) ───────────────── */
function PitchLines() {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Outer boundary */}
      <rect x="20" y="20" width="560" height="360" rx="0" stroke="currentColor" strokeWidth="1.5" />
      {/* Center line */}
      <line x1="300" y1="20" x2="300" y2="380" stroke="currentColor" strokeWidth="1.5" />
      {/* Center circle */}
      <circle cx="300" cy="200" r="60" stroke="currentColor" strokeWidth="1.5" />
      {/* Center dot */}
      <circle cx="300" cy="200" r="3" fill="currentColor" />
      {/* Left penalty area */}
      <rect x="20" y="100" width="120" height="200" stroke="currentColor" strokeWidth="1.5" />
      {/* Left goal area */}
      <rect x="20" y="150" width="45" height="100" stroke="currentColor" strokeWidth="1.5" />
      {/* Left penalty arc */}
      <path d="M140 165 A35 35 0 0 1 140 235" stroke="currentColor" strokeWidth="1.5" />
      {/* Right penalty area */}
      <rect x="460" y="100" width="120" height="200" stroke="currentColor" strokeWidth="1.5" />
      {/* Right goal area */}
      <rect x="535" y="150" width="45" height="100" stroke="currentColor" strokeWidth="1.5" />
      {/* Right penalty arc */}
      <path d="M460 165 A35 35 0 0 0 460 235" stroke="currentColor" strokeWidth="1.5" />
      {/* Corner arcs */}
      <path d="M20 30 A10 10 0 0 0 30 20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M570 20 A10 10 0 0 0 580 30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 370 A10 10 0 0 1 30 380" stroke="currentColor" strokeWidth="1.5" />
      <path d="M570 380 A10 10 0 0 1 580 370" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Parallax hero visual (GOAT symbol + glow) ───────────────────── */
function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center" style={{ perspective: "800px" }}>
      {/* Outer glow ring */}
      <div className="absolute w-[340px] h-[340px] rounded-full bg-[#012AFE]/[0.06] dark:bg-[#012AFE]/[0.12] blur-[80px] pointer-events-none" />

      {/* Rotating orbit ring */}
      <motion.div
        className="absolute w-[320px] h-[320px] rounded-full border border-[#012AFE]/[0.08] dark:border-[#012AFE]/[0.15]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {/* Orbiting dot */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#012AFE] shadow-[0_0_12px_rgba(1,42,254,0.6)]" />
      </motion.div>

      {/* Secondary orbit */}
      <motion.div
        className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-[#012AFE]/[0.05] dark:border-[#012AFE]/[0.1]"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#012AFE]/60" />
      </motion.div>

      {/* Center GOAT symbol with parallax */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[200px] h-[200px]"
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-[#012AFE]/[0.08] dark:bg-[#012AFE]/[0.18] rounded-full blur-[40px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src="/azul-simbolo-outline.svg"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(1,42,254,0.25)] dark:drop-shadow-[0_0_40px_rgba(1,42,254,0.4)]"
            style={{ filter: "brightness(1)" }}
          />
        </motion.div>
      </motion.div>

      {/* Floating quick-stat badges around the symbol */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute top-8 -left-2 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-md"
      >
        <span className="text-[10px] font-bold text-[#012AFE] tracking-wider uppercase">xG Model</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute bottom-16 -right-4 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-md"
      >
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">+12.4% ROI</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-md"
      >
        <span className="text-[10px] font-bold text-(--text2) dark:text-white/60 tracking-wider uppercase">Poisson</span>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ═══  HERO COMPONENT  ═════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════ */

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative overflow-hidden">
      {/* ── Background layers ────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pitch lines watermark */}
        <PitchLines />

        {/* Radial glow top-right */}
        <div
          className="absolute -top-40 -right-40 w-[700px] h-[700px]"
          style={{
            background:
              "radial-gradient(circle, rgba(1,42,254,0.07) 0%, transparent 60%)",
          }}
        />
        {/* Radial glow bottom-left — dark only */}
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] hidden dark:block"
          style={{
            background:
              "radial-gradient(circle, rgba(1,42,254,0.1) 0%, transparent 55%)",
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(1,42,254,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(1,42,254,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-0">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2.5 mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012AFE]/[0.08] dark:bg-[#012AFE]/[0.15] border border-[#012AFE]/[0.12] dark:border-[#012AFE]/[0.25]">
            <span className="relative flex items-center justify-center w-[5px] h-[5px]">
              <span className="absolute inset-0 rounded-full bg-[#012AFE] animate-ping opacity-50" />
              <span className="w-[5px] h-[5px] rounded-full bg-[#012AFE]" />
            </span>
            <span className="text-[11px] font-semibold text-[#012AFE] tracking-[0.06em] uppercase">
              Premier League 25/26
            </span>
          </span>
          <span className="hidden sm:inline text-[11px] text-(--text3) dark:text-white/30 tracking-wide">
            Análise com IA · Tempo real
          </span>
        </motion.div>

        {/* Grid: text left + visual right */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-6 items-center">
          {/* ── Left column ─────────────────────────────────────── */}
          <div className="max-w-[680px]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(44px,7.5vw,88px)] leading-[0.92] uppercase tracking-[-0.02em] text-(--text) dark:text-white mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tips que{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#012AFE]">realmente</span>
                {/* Animated underline accent */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#012AFE] via-[#012AFE] to-transparent rounded-full origin-left"
                />
              </span>
              <br />
              convertem.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[15px] md:text-[16px] text-(--text2) dark:text-white/50 max-w-[480px] leading-[1.7] mb-8"
            >
              Probabilidades calibradas com dados históricos, modelo de Gols
              Esperados ao vivo e análise de padrões. Sem viés humano, sem
              achismo — apenas dados.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <Link
                href="/ao-vivo"
                className="group relative overflow-hidden text-[13px] font-semibold bg-[#012AFE] text-white px-6 py-[11px] rounded-xl cursor-pointer tracking-[0.03em] hover:shadow-[0_0_40px_rgba(1,42,254,0.45)] transition-all duration-300 hover:scale-[1.02] whitespace-nowrap no-underline"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  <span className="relative flex items-center justify-center w-[6px] h-[6px]">
                    <span className="absolute inset-0 rounded-full bg-white/50 animate-ping" />
                    <span className="w-[6px] h-[6px] rounded-full bg-white" />
                  </span>
                  Ver jogos ao vivo
                </span>
              </Link>

              <Link
                href="/tipster"
                className="text-[13px] font-semibold bg-transparent text-(--text) dark:text-white border border-(--border2) dark:border-white/[0.12] px-6 py-[11px] rounded-xl cursor-pointer tracking-[0.03em] hover:bg-(--pill-bg) dark:hover:bg-white/[0.06] hover:border-(--text3) dark:hover:border-white/20 transition-all duration-200 whitespace-nowrap no-underline"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Perguntar ao Goat AI
              </Link>
            </motion.div>

            {/* Live odds ticker (mini floating cards) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1"
              style={{ scrollbarWidth: "none" }}
            >
              {mounted &&
                LIVE_ODDS.map((odd, i) => (
                  <LiveOddsPill key={i} data={odd} delay={0.9 + i * 0.15} />
                ))}
            </motion.div>
          </div>

          {/* ── Right column (visual) ──────────────────────────── */}
          <div className="hidden lg:block h-[420px] relative">
            {mounted && <HeroVisual />}
          </div>
        </div>

        {/* ── Bottom stats bar ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="relative z-10 flex items-center gap-8 md:gap-10 mt-10 pt-6 pb-7 border-t border-(--border) dark:border-white/[0.06] flex-wrap"
        >
          <AnimatedStat value="0.2" suffix="~" label="Brier Score" delay={0.7} />

          <div className="w-px h-10 bg-(--border) dark:bg-white/[0.06]" />

          <AnimatedStat value="4.5" suffix="M" label="Dados Históricos" delay={0.8} />

          <div className="w-px h-10 bg-(--border) dark:bg-white/[0.06] hidden sm:block" />

          <AnimatedStat
            value="1"
            suffix=" API"
            label="Conexão com fontes oficiais"
            delay={0.9}
          />

          <div className="w-px h-10 bg-(--border) dark:bg-white/[0.06] hidden md:block" />

          <AnimatedStat
            value="2"
            suffix=" DATASETS"
            label="Fontes de dados"
            delay={1.0}
          />

          {/* Subtle data stream label */}
          <div className="ml-auto hidden lg:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#012AFE] animate-pulse" />
            <span className="text-[10px] text-(--text3) dark:text-white/25 tracking-widest uppercase font-medium">
              MODELO POISSON · STATSBOMB · FBREF
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
