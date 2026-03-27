"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, MessageSquare, Zap, BarChart3 } from "lucide-react";

export function TelegramCta() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#050D1F] border border-black/5 dark:border-white/5 shadow-xs p-10 md:p-16 my-16">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#012AFE]/5 dark:bg-[#012AFE]/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00C896]/3 dark:bg-[#00C896]/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(1, 42, 254, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(1, 42, 254, 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage: "linear-gradient(rgba(1, 42, 254, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(1, 42, 254, 0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2AABEE]/[0.1] border border-[#2AABEE]/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2AABEE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2AABEE]"></span>
              </span>
              <span className="text-[11px] font-bold text-[#2AABEE] tracking-wider uppercase">
                Bot Oficial Telegram
              </span>
            </div>

            <h2 
              className="text-4xl md:text-5xl lg:text-6xl text-[#0A0F2E] dark:text-white mb-4 leading-[0.9] tracking-[0.01em] uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AS MESMAS <span className="relative inline-block text-[#012AFE]">
                TIPS
                <span className="absolute left-0 -bottom-1 w-full h-[3px] rounded-full bg-linear-to-r from-[#012AFE] to-transparent opacity-40 dark:opacity-60" />
              </span> DIRETAMENTE NO SEU CELULAR
            </h2>
            
            <p className="text-[15px] text-[#0A0F2E]/60 dark:text-white/60 max-w-xl leading-[1.7]">
              Nossa inteligência artificial não dorme. Receba prognósticos ao vivo, alertas de valor esperado (EV+) e estatísticas exclusivas antes que as odds despenquem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link 
              href="https://t.me/GoatTipsBot" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-bold rounded-xl transition-all overflow-hidden shadow-sm hover:shadow-[0_0_24px_rgba(42,171,238,0.4)]"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
              
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.928 3.52099L18.665 19.851C18.423 20.94 17.755 21.22 16.822 20.697L11.758 16.963L9.30902 19.324C9.03802 19.595 8.81002 19.822 8.35402 19.822L8.71802 14.654L18.125 6.15599C18.534 5.79299 18.035 5.59099 17.491 5.95399L5.86002 13.284L0.864016 11.72C-0.222984 11.378 -0.242984 10.63 1.09202 10.108L20.65 2.57199C21.558 2.22999 22.355 2.77599 21.928 3.52099Z" fill="currentColor"/>
              </svg>
              ACESSAR BOT AGORA
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <p className="text-[12px] text-[#0A0F2E]/40 dark:text-white/40 max-w-[200px]">
              100% Gratuito. Sem spam, apenas red alerts cruciais para sua banca.
            </p>
          </motion.div>
        </div>

        {/* Right Column - Disrupted Visuals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative perspective-1000 mt-8 lg:mt-0"
        >
          {/* Floating Device / Dashboard mockup */}
          <div className="relative z-10 w-full max-w-sm ml-auto bg-[#F8F9FB] dark:bg-[#09090b] border border-black/5 dark:border-white/5 rounded-2xl shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] p-5 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
            {/* Fake Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/5 dark:border-white/5">
              <div className="w-10 h-10 rounded-full bg-[#2AABEE]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#2AABEE]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#0A0F2E] dark:text-white">Goat Tips Bot</div>
                <div className="text-[12px] text-[#2AABEE]">bot</div>
              </div>
            </div>

            {/* Fake Messages Stack */}
            <div className="space-y-4">
              {/* Message 1 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl rounded-tr-sm p-4 text-sm shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wide font-bold text-[#FF3B3B] flex items-center gap-1">
                    <Zap className="w-3 h-3" fill="currentColor" /> LIVE ALERT
                  </span>
                  <span className="text-[10px] text-[#0A0F2E]/40 dark:text-white/40">Agora</span>
                </div>
                <div className="font-semibold text-[#0A0F2E]/90 dark:text-white/90 mb-1">Man City vs Arsenal</div>
                <div className="text-[#0A0F2E]/60 dark:text-white/60 text-[13px] leading-relaxed">
                  Probabilidade de Gol do City subiu para <span className="text-[#00C896] font-bold">84%</span> nos próximos 15min. Pressão intensa!
                </div>
              </motion.div>

              {/* Message 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#012AFE]/[0.05] border border-[#012AFE]/20 rounded-2xl rounded-tr-sm p-4 text-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-[#012AFE]" />
                  <span className="text-[11px] uppercase tracking-wide font-bold text-[#012AFE]">
                    EV+ Encontrado
                  </span>
                </div>
                <div className="font-semibold text-[#0A0F2E]/90 dark:text-white/90 mb-1">Over 2.5 Gols @ 2.10</div>
                <div className="flex justify-between items-end mt-2">
                   <div className="text-[#012AFE] font-bold text-[14px]">Indicação de Entrada</div>
                   <button className="px-3 py-1 bg-[#012AFE] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                     Fazer Bet
                   </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 z-20 bg-white dark:bg-[#09090b] border border-black/5 dark:border-white/5 shadow-xl p-3 rounded-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#00C896]/10 flex items-center justify-center">
              <span className="text-[16px]">🎯</span>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#0A0F2E]/50 dark:text-white/50 tracking-wider">Acertos de Hoje</div>
              <div className="text-[16px] font-bold text-[#0A0F2E] dark:text-white">8/10 Greens</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
