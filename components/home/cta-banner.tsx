'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const STATS = [
  { label: 'Acurácia', value: '84%' },
  { label: 'Partidas', value: '1.8k' },
  { label: 'Mercados', value: '12+' },
];

// Tokens para cada tema — aplicados nos inline styles
const dark = {
  bg: '#050D1F',
  grid: 'rgba(1,42,254,0.07)',
  halo: 'radial-gradient(ellipse at 65% 25%, rgba(1,42,254,0.45) 0%, transparent 62%)',
  vignette:
    'radial-gradient(ellipse at 20% 85%, rgba(0,0,0,0.55) 0%, transparent 68%)',
  logoOpacity: '0.055',
  logoFilter: 'brightness-200',
  badgeBg: 'rgba(1,42,254,0.14)',
  badgeBorder: '1px solid rgba(1,42,254,0.32)',
  badgeText: '#6B8AFF',
  heading: '#ffffff',
  desc: 'rgba(255,255,255,0.42)',
  statsDivider: 'rgba(255,255,255,0.07)',
  statsValue: '#ffffff',
  statsLabel: 'rgba(255,255,255,0.30)',
  subtext: 'rgba(255,255,255,0.22)',
  barBorder: 'rgba(255,255,255,0.06)',
  barBg: 'rgba(0,0,0,0.25)',
  barText: 'rgba(255,255,255,0.22)',
};

const light = {
  bg: '#EEF3FF',
  grid: 'rgba(1,42,254,0.05)',
  halo: 'radial-gradient(ellipse at 65% 25%, rgba(1,42,254,0.14) 0%, transparent 62%)',
  vignette:
    'radial-gradient(ellipse at 20% 85%, rgba(1,42,254,0.06) 0%, transparent 68%)',
  logoOpacity: '0.10',
  logoFilter: '',
  badgeBg: 'rgba(1,42,254,0.10)',
  badgeBorder: '1px solid rgba(1,42,254,0.25)',
  badgeText: '#012AFE',
  heading: '#0A0F2E',
  desc: 'rgba(10,15,46,0.50)',
  statsDivider: 'rgba(0,0,0,0.08)',
  statsValue: '#0A0F2E',
  statsLabel: 'rgba(10,15,46,0.38)',
  subtext: 'rgba(10,15,46,0.35)',
  barBorder: 'rgba(0,0,0,0.07)',
  barBg: 'rgba(0,0,0,0.04)',
  barText: 'rgba(10,15,46,0.30)',
};

export function CtaBanner() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const current = html.classList.contains('dark');
    if (current !== isDark) setIsDark(current);

    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t = isDark ? dark : light;

  return (
    <div className="px-4 md:px-6 max-w-[1280px] mx-auto my-14">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden"
        style={{ background: t.bg, transition: 'background 0.3s ease' }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${t.grid} 1px, transparent 1px),
              linear-gradient(90deg, ${t.grid} 1px, transparent 1px)
            `,
            backgroundSize: '52px 52px',
          }}
        />

        {/* Blue halo top-right */}
        <div
          className="absolute -top-24 -right-24 w-[640px] h-[480px] pointer-events-none"
          style={{ background: t.halo }}
        />

        {/* Soft vignette bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-[480px] h-[320px] pointer-events-none"
          style={{ background: t.vignette }}
        />

        {/* Large decorative logo — bottom right */}
        <div
          className="absolute right-[-60px] bottom-[-60px] w-[440px] h-[440px] pointer-events-none"
          style={{ opacity: t.logoOpacity }}
        >
          <Image
            src="/goat-tips-logo.svg"
            alt=""
            fill
            className={`object-contain ${t.logoFilter}`}
          />
        </div>

        {/* ── Main content ───────────────────────────────────────── */}
        <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-end px-8 pt-7 pb-0 md:px-14 md:pt-10">
          {/* Left column */}
          <div>
            {/* Badge */}

            {/* Heading */}
            <h2
              className="text-[40px] sm:text-[54px] md:text-[66px] uppercase leading-[0.9] tracking-[0.01em] mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: t.heading,
              }}
            >
              Crie a
              <br />
              odd{' '}
              <span
                className="relative inline-block"
                style={{ color: '#012AFE' }}
              >
                perfeita.
                <span
                  className="absolute left-0 -bottom-1 w-full h-[2px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #012AFE 0%, transparent 100%)',
                    opacity: isDark ? 0.6 : 0.4,
                  }}
                />
              </span>
            </h2>

            <p
              className="text-[14px] max-w-[360px] leading-[1.7]"
              style={{ color: t.desc }}
            >
              Combine mercados, escolha seus eventos e monte uma odd
              personalizada com análise de IA calibrada em dados históricos e
              modelo xG em tempo real.
            </p>

            {/* Stats row */}
            <div
              className="flex items-center gap-8 mt-5 pt-5"
              style={{ borderTop: `1px solid ${t.statsDivider}` }}
            >
              {STATS.map(s => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span
                    className="text-[30px] leading-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: t.statsValue,
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.06em] uppercase"
                    style={{ color: t.statsLabel }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — CTA */}
          <div className="flex flex-col items-start md:items-end gap-3 pb-7 md:pb-10 shrink-0">
            <button
              className="group relative overflow-hidden px-8 py-[14px] rounded-xl bg-[#012AFE] text-white font-bold tracking-[0.04em] transition-all duration-300 hover:scale-[1.03]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                boxShadow: '0 0 0 0 rgba(1,42,254,0)',
              }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 48px rgba(1,42,254,0.55)')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '0 0 0 0 rgba(1,42,254,0)')
              }
            >
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              <span className="relative z-10 flex items-center gap-2.5">
                Montar agora
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <p
              className="text-[11px] tracking-[0.04em]"
              style={{ color: t.subtext }}
            >
              Sem cadastro · Análise gratuita
            </p>
          </div>
        </div>

        {/* ── Bottom data bar ─────────────────────────────────────── */}
        <div
          className="relative z-10 flex items-center gap-3 px-8 md:px-14 py-2.5 mt-4"
          style={{
            borderTop: `1px solid ${t.barBorder}`,
            background: t.barBg,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#012AFE] shrink-0 animate-pulse-red" />
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: t.barText }}
          >
            MODELO xG · STATSBOMB · FBREF · ODDS AO VIVO
          </span>
        </div>
      </motion.div>
    </div>
  );
}
