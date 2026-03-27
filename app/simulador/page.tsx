"use client";

import {
  Settings2,
  Shield,
  ChevronDown,
  Activity,
  Cpu,
  Cloud,
  Target,
  BarChart3,
  TriangleAlert,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReferees, useTeams } from "@/hooks/use-analytics";
import { useLiveMatches, useUpcomingMatches } from "@/hooks/use-matches";
import {
  useSimulatorInplay,
  useSimulatorPrediction,
} from "@/hooks/use-predictions";
import type { Prediction } from "@/types/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const preMatchSchema = z.object({
  home: z.string().min(1, "Selecione o time da casa"),
  away: z.string().min(1, "Selecione o time visitante"),
  referee: z.string().optional(),
  stadium: z.string().optional(),
  city: z.string().optional(),
  match_hour_utc: z
    .number()
    .int()
    .min(0, "Mínimo: 0")
    .max(23, "Máximo: 23")
    .optional()
    .or(z.nan().transform(() => undefined)),
});

const inplaySchema = z.object({
  home: z.string().min(1, "Selecione o time da casa"),
  away: z.string().min(1, "Selecione o time visitante"),
  referee: z.string().optional(),
  home_goals: z.number().int().min(0),
  away_goals: z.number().int().min(0),
  minute: z.number().int().min(1).max(120),
  home_red: z.number().int().min(0).optional(),
  away_red: z.number().int().min(0).optional(),
});

type PreMatchValues = z.infer<typeof preMatchSchema>;
type InplayValues = z.infer<typeof inplaySchema>;
type TeamInfo = { id: string; name: string; image_url?: string };

const NONE_VALUE = "__none__";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

function TeamBadge({
  team,
  size = 64,
}: {
  team: TeamInfo | null;
  size?: number;
}) {
  if (!team) {
    return (
      <div
        className="rounded-full bg-muted/60 border-2 border-dashed border-border flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-muted-foreground text-lg">?</span>
      </div>
    );
  }

  const containerClass =
    "relative rounded-full bg-card shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-border flex items-center justify-center overflow-hidden";

  if (!team.image_url) {
    return (
      <div className={containerClass} style={{ width: size, height: size }}>
        <span
          className="font-black text-foreground"
          style={{ fontFamily: "var(--font-display)", fontSize: size * 0.28 }}
        >
          {team.name.slice(0, 3).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClass} style={{ width: size, height: size }}>
      <Image
        src={team.image_url}
        alt={team.name}
        width={size}
        height={size}
        className="object-contain p-2.5"
      />
    </div>
  );
}

function MatchPreviewCard({
  homeTeam,
  awayTeam,
  mode,
}: {
  homeTeam: TeamInfo | null;
  awayTeam: TeamInfo | null;
  mode: "pre-match" | "inplay";
}) {
  const hasTeams = homeTeam && awayTeam;

  return (
    <motion.div
      className="relative bg-card border border-border rounded-2xl p-6 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-destructive/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex items-center justify-center gap-2 mb-4">
        <Image
          src="/premier-logo.png"
          alt="Premier League"
          width={20}
          height={20}
          className="opacity-60"
        />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          Premier League · {mode === "pre-match" ? "Simulação" : "Ao Vivo"}
        </span>
      </div>

      <div className="flex items-center justify-center gap-6 md:gap-10 relative">
        <motion.div
          className="flex flex-col items-center gap-2.5"
          animate={
            homeTeam ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.4 }
          }
          transition={{ duration: 0.3 }}
        >
          <TeamBadge team={homeTeam} size={72} />
          <div className="text-center">
            <div
              className="text-[13px] font-bold text-foreground leading-tight max-w-[100px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {homeTeam?.name ?? "Casa"}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Casa</div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center">
          {hasTeams ? (
            <motion.div
              className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span
                className="text-primary font-black text-sm italic"
                style={{ fontFamily: "var(--font-display)" }}
              >
                VS
              </span>
            </motion.div>
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center">
              <span className="text-muted-foreground text-xs font-bold">
                VS
              </span>
            </div>
          )}
        </div>

        <motion.div
          className="flex flex-col items-center gap-2.5"
          animate={
            awayTeam ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.4 }
          }
          transition={{ duration: 0.3 }}
        >
          <TeamBadge team={awayTeam} size={72} />
          <div className="text-center">
            <div
              className="text-[13px] font-bold text-foreground leading-tight max-w-[100px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {awayTeam?.name ?? "Fora"}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Visitante
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] text-muted-foreground/80 uppercase tracking-widest font-bold">
        {label}
      </Label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-destructive font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamSelectFieldWithIcon({
  id,
  label,
  value,
  onChange,
  teams,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  teams: TeamInfo[];
  error?: string;
}) {
  return (
    <FormField label={label} error={error}>
      <div className="relative flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-1">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
          <span className="text-slate-400 text-sm">🛡️</span>
        </div>
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger
            id={id}
            className="border-0 focus:ring-0 bg-transparent h-10 text-slate-900 dark:text-slate-100 text-xs"
          >
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {teams.map((t) => (
              <SelectItem key={t.id} value={t.name}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormField>
  );
}

function PreMatchForm({
  onSubmit,
  isLoading,
  onTeamsChange,
}: {
  onSubmit: (data: PreMatchValues) => void;
  isLoading: boolean;
  onTeamsChange: (home: string, away: string) => void;
}) {
  const { data: teamsData } = useTeams();
  const { data: refereesData } = useReferees();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PreMatchValues>({
    resolver: zodResolver(preMatchSchema),
    defaultValues: { home: "", away: "", referee: "", stadium: "", city: "" },
  });

  const homeValue = watch("home");
  const awayValue = watch("away");
  const allTeams = teamsData?.teams ?? [];

  function setHome(v: string) {
    setValue("home", v, { shouldValidate: true });
    onTeamsChange(v, awayValue);
  }

  function setAway(v: string) {
    setValue("away", v, { shouldValidate: true });
    onTeamsChange(homeValue, v);
  }

  return (
    <TooltipProvider delayDuration={100}>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-2 ml-1 tracking-tighter">
              Time da Casa
            </label>
            <div
              className={`relative flex items-center bg-muted/30 border ${errors.home ? "border-red-500" : "border-border/50"} rounded-lg p-1`}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <select
                value={homeValue}
                onChange={(e) => setHome(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-foreground text-xs py-2 px-2 appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-muted-foreground">
                  Selecione
                </option>
                {allTeams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground mr-2 pointer-events-none" />
            </div>
            {errors.home && (
              <p className="text-[10px] text-red-500 mt-1 ml-1">
                {errors.home.message}
              </p>
            )}
          </div>

          <div className="group">
            <label className="block text-[10px] text-muted-foreground uppercase font-bold mb-2 ml-1 tracking-tighter">
              Time Visitante
            </label>
            <div
              className={`relative flex items-center bg-muted/30 border ${errors.away ? "border-red-500" : "border-border/50"} rounded-lg p-1`}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <select
                value={awayValue}
                onChange={(e) => setAway(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-foreground text-xs py-2 px-2 appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-muted-foreground">
                  Selecione
                </option>
                {allTeams
                  .filter((t) => t.name !== homeValue)
                  .map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground mr-2 pointer-events-none" />
            </div>
            {errors.away && (
              <p className="text-[10px] text-red-500 mt-1 ml-1">
                {errors.away.message}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="group">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold mb-1 ml-1 tracking-tighter">
            Árbitro (Opcional)
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}>
                <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="w-56 text-center text-xs text-slate-200">
                  O árbitro escolhido pode influenciar em até{" "}
                  <strong className="text-white">12%</strong> na precisão final
                  do xG e nas métricas disciplinares (Pênaltis e Cartões).
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          <div className="relative">
            <select
              {...register("referee")}
              className="w-full bg-muted/30 border border-border/50 focus:border-primary focus:ring-0 text-foreground text-sm py-3 px-4 appearance-none rounded-lg cursor-pointer transition-colors"
            >
              <option value="" className="text-muted-foreground">
                Nenhum
              </option>
              {refereesData?.referees.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Activity className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-4 h-4" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold mb-1 ml-1 tracking-tighter">
              Estádio
              <Tooltip>
                <TooltipTrigger type="button" tabIndex={-1}>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="w-56 text-center text-xs text-slate-200">
                    Jogar no próprio estádio ativa o fator{" "}
                    <em>Mando de Campo (Home Advantage)</em>, influenciando o
                    favoritismo e as linhas de Over Gols.
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <input
              {...register("stadium")}
              className="w-full bg-muted/30 border border-border/50 focus:border-primary focus:ring-0 text-foreground text-xs py-3 px-4 rounded-lg outline-none transition-colors"
              placeholder="Ex: Villa Park"
              type="text"
            />
          </div>
          <div className="group">
            <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold mb-1 ml-1 tracking-tighter">
              Cidade
              <Tooltip>
                <TooltipTrigger type="button" tabIndex={-1}>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="w-56 text-center text-xs text-slate-200">
                    A cidade nos ajuda a cruzar dados do clima em tempo real que
                    afetam diretamente a performance da partida e probabilidade
                    de gols.
                  </p>
                </TooltipContent>
              </Tooltip>
            </label>
            <input
              {...register("city")}
              className="w-full bg-muted/30 border border-border/50 focus:border-primary focus:ring-0 text-foreground text-xs py-3 px-4 rounded-lg outline-none transition-colors"
              placeholder="Ex: Birmingham"
              type="text"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="group">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold mb-1 ml-1 tracking-tighter">
            Horário (UTC)
            <Tooltip>
              <TooltipTrigger type="button" tabIndex={-1}>
                <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="w-56 text-center text-xs text-slate-200">
                  Partidas noturnas vs. diurnas ou diferenças de fuso horário
                  podem impactar a intensidade do jogo e o desgaste físico da
                  inteligência artificial.
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          <div className="relative">
            <select
              {...register("match_hour_utc", { valueAsNumber: true })}
              className="w-full bg-muted/30 border border-border/50 focus:border-primary focus:ring-0 text-foreground text-xs py-3 px-4 appearance-none rounded-lg cursor-pointer transition-colors"
            >
              <option value="" className="text-muted-foreground">
                Qualquer
              </option>
              {Array.from({ length: 24 }).map((_, i) => (
                <option
                  key={i}
                  value={i}
                >{`${i.toString().padStart(2, "0")}:00`}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground w-3 h-3" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-white font-black font-headline text-xl uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all rounded-lg shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingDots /> Simulando
              </span>
            ) : (
              "Simular Partida"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setValue("home", "");
              setValue("away", "");
              setValue("referee", "");
              setValue("stadium", "");
              setValue("city", "");
              setValue("match_hour_utc", undefined);
              onTeamsChange("", "");
            }}
            className="w-full py-2 bg-transparent text-muted-foreground font-bold text-[10px] uppercase tracking-widest hover:text-foreground transition-all border border-transparent hover:border-border rounded-lg"
          >
            Limpar Escolhas
          </button>
        </motion.div>
      </motion.form>
    </TooltipProvider>
  );
}

function InplayForm({
  onSubmit,
  isLoading,
  onTeamsChange,
}: {
  onSubmit: (data: InplayValues) => void;
  isLoading: boolean;
  onTeamsChange: (home: string, away: string) => void;
}) {
  const { data: teamsData } = useTeams();
  const { data: refereesData } = useReferees();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InplayValues>({
    resolver: zodResolver(inplaySchema),
    defaultValues: {
      home: "",
      away: "",
      referee: "",
      home_goals: 0,
      away_goals: 0,
      minute: 45,
      home_red: 0,
      away_red: 0,
    },
  });

  const homeValue = watch("home");
  const awayValue = watch("away");
  const allTeams = teamsData?.teams ?? [];

  function setHome(v: string) {
    setValue("home", v, { shouldValidate: true });
    onTeamsChange(v, awayValue);
  }

  function setAway(v: string) {
    setValue("away", v, { shouldValidate: true });
    onTeamsChange(homeValue, v);
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
    >
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <FormField label="Time da casa" error={errors.home?.message}>
          <Select value={homeValue || undefined} onValueChange={setHome}>
            <SelectTrigger
              id="home-ip"
              className="w-full h-11 bg-background/60 backdrop-blur-sm"
            >
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {allTeams.map((t) => (
                <SelectItem key={t.id} value={t.name}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Time visitante" error={errors.away?.message}>
          <Select value={awayValue || undefined} onValueChange={setAway}>
            <SelectTrigger
              id="away-ip"
              className="w-full h-11 bg-background/60 backdrop-blur-sm"
            >
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {allTeams
                .filter((t) => t.name !== homeValue)
                .map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormField>
      </motion.div>

      <motion.div variants={fadeUp}>
        <FormField label="Árbitro (opcional)">
          <Select
            value={watch("referee") || NONE_VALUE}
            onValueChange={(v) =>
              setValue("referee", v === NONE_VALUE ? "" : v, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full h-11 bg-background/60 backdrop-blur-sm">
              <SelectValue placeholder="Nenhum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_VALUE}>Nenhum</SelectItem>
              {refereesData?.referees.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="relative bg-background/40 backdrop-blur-sm border border-border rounded-xl p-4">
          <div className="absolute -top-2.5 left-3 px-2 bg-card text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Placar atual
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <FormField label="Casa" error={errors.home_goals?.message}>
              <Input
                type="number"
                min={0}
                className="h-14 text-center text-2xl font-black bg-transparent"
                {...register("home_goals", { valueAsNumber: true })}
              />
            </FormField>
            <div className="flex items-center justify-center pb-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-black text-sm">×</span>
              </div>
            </div>
            <FormField label="Fora" error={errors.away_goals?.message}>
              <Input
                type="number"
                min={0}
                className="h-14 text-center text-2xl font-black bg-transparent"
                {...register("away_goals", { valueAsNumber: true })}
              />
            </FormField>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <FormField label="Minuto do jogo" error={errors.minute?.message}>
          <div className="relative">
            <Input
              type="number"
              min={1}
              max={120}
              className="h-10 bg-background/60 backdrop-blur-sm pr-10"
              {...register("minute", { valueAsNumber: true })}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
              min
            </span>
          </div>
        </FormField>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <FormField label="Vermelhos casa">
          <Input
            type="number"
            min={0}
            className="h-10 text-center bg-background/60 backdrop-blur-sm"
            {...register("home_red", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Vermelhos fora">
          <Input
            type="number"
            min={0}
            className="h-10 text-center bg-background/60 backdrop-blur-sm"
            {...register("away_red", { valueAsNumber: true })}
          />
        </FormField>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-[14px] font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(1,42,254,0.3)] hover:shadow-[0_6px_28px_rgba(1,42,254,0.45)] transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingDots /> Simulando
            </span>
          ) : (
            "Simular Ao Vivo"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function ResultsDashboard({
  prediction,
  isInplay,
  teamMap,
}: {
  prediction: Prediction;
  isInplay: boolean;
  teamMap: Map<string, TeamInfo>;
}) {
  const homeTeam = teamMap.get(prediction.home_team) ?? null;
  const awayTeam = teamMap.get(prediction.away_team) ?? null;
  const homeProb = prediction.home_win_prob;
  const drawProb = prediction.draw_prob;
  const awayProb = prediction.away_win_prob;

  return (
    <motion.div
      className="flex flex-col gap-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Match Header Card */}
      <motion.div
        className="relative bg-card border border-border rounded-2xl overflow-hidden"
        variants={scaleIn}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--primary)_0%,transparent_60%)] opacity-[0.03] dark:opacity-[0.06]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <div className="relative p-6 pb-5">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Image
              src="/premier-logo.png"
              alt="Premier League"
              width={18}
              height={18}
              className="opacity-50"
            />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Premier League
            </span>
            {isInplay && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full ml-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                AO VIVO
              </span>
            )}
          </div>

          <div className="flex items-center justify-between px-4">
            <motion.div
              className="flex flex-col items-center gap-3 flex-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease }}
            >
              <TeamBadge team={homeTeam} size={80} />
              <div className="text-center">
                <div
                  className="text-[15px] font-bold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {prediction.home_team}
                </div>
                <div className="text-[10px] text-muted-foreground">Casa</div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center mx-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                {prediction.most_likely_score}
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="mt-1 text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                Mais provável
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3 flex-1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease }}
            >
              <TeamBadge team={awayTeam} size={80} />
              <div className="text-center">
                <div
                  className="text-[15px] font-bold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {prediction.away_team}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Visitante
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Probability bar inline */}
        <div className="px-6 pb-5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="text-[#012AFE]">
              {Math.round(homeProb * 100)}%
            </span>
            <span className="text-muted-foreground">
              {Math.round(drawProb * 100)}%
            </span>
            <span className="text-[#FF3B3B]">
              {Math.round(awayProb * 100)}%
            </span>
          </div>
          <div className="flex h-2 w-full rounded-full overflow-hidden gap-0.5">
            <motion.div
              className="bg-[#012AFE] rounded-l-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(homeProb * 100)}%` }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
            />
            <motion.div
              className="bg-muted-foreground/30"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(drawProb * 100)}%` }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
            />
            <motion.div
              className="bg-[#FF3B3B] rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(awayProb * 100)}%` }}
              transition={{ duration: 0.8, ease, delay: 0.7 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>{prediction.home_team}</span>
            <span>Empate</span>
            <span>{prediction.away_team}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={stagger}
      >
        {[
          {
            label: "Expectativa de Gols Casa",
            value: prediction.lambda_home.toFixed(2),
            sub: prediction.home_team,
            color: "#012AFE",
          },
          {
            label: "Expectativa de Gols Fora",
            value: prediction.lambda_away.toFixed(2),
            sub: prediction.away_team,
            color: "#FF3B3B",
          },
          {
            label: "Over 2.5",
            value: `${(prediction.over_2_5_prob * 100).toFixed(0)}%`,
            color: undefined,
          },
          {
            label: "BTTS",
            value: `${(prediction.btts_prob * 100).toFixed(0)}%`,
            color: undefined,
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="group relative bg-card border border-border rounded-xl p-4 text-center overflow-hidden hover:border-primary/30 transition-colors"
            variants={fadeUp}
            whileHover={{ y: -2 }}
          >
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
              {s.label}
            </div>
            <div
              className="text-[28px] font-black"
              style={{
                fontFamily: "var(--font-display)",
                color: s.color ?? "var(--foreground)",
              }}
            >
              {s.value}
            </div>
            {s.sub && (
              <div className="text-[11px] text-muted-foreground mt-1">
                {s.sub}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Top Scores */}
      <motion.div
        className="bg-card border border-border rounded-2xl p-6"
        variants={fadeUp}
      >
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-4">
          Placares mais prováveis
        </div>
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-5 gap-3"
          variants={stagger}
        >
          {prediction.top_scores.slice(0, 5).map(([score, prob], i) => (
            <motion.div
              key={score}
              className={`relative rounded-xl border px-4 py-3 text-center transition-colors ${i === 0 ? "bg-primary/10 border-primary/30" : "bg-card border-border hover:border-primary/20"}`}
              variants={fadeUp}
              whileHover={{ y: -2, scale: 1.02 }}
            >
              {i === 0 && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Top
                </div>
              )}
              <div
                className={`text-[18px] font-black ${i === 0 ? "text-primary" : "text-foreground"}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {score}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {(prob * 100).toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Score Matrix */}
      {prediction.score_matrix && prediction.score_matrix.length > 0 && (
        <motion.div
          className="bg-card border border-border rounded-2xl p-6 overflow-hidden"
          variants={fadeUp}
        >
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-4">
            Matriz de probabilidade
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr>
                  <th className="p-1.5 text-muted-foreground text-[9px] uppercase">
                    {prediction.home_team?.slice(0, 3)}\
                    {prediction.away_team?.slice(0, 3)}
                  </th>
                  {prediction.score_matrix[0]?.slice(0, 6).map((_, j) => (
                    <th
                      key={j}
                      className="p-1.5 text-muted-foreground font-bold"
                    >
                      {j}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prediction.score_matrix.slice(0, 6).map((row, i) => (
                  <tr key={i}>
                    <td className="p-1.5 text-muted-foreground font-bold">
                      {i}
                    </td>
                    {row.slice(0, 6).map((val, j) => {
                      const intensity = Math.min(val * 10, 1);
                      return (
                        <motion.td
                          key={j}
                          className="p-1.5 text-center font-medium rounded-md"
                          style={{
                            background: `rgba(1,42,254,${intensity * 0.55})`,
                            color:
                              intensity > 0.25
                                ? "#fff"
                                : "var(--muted-foreground)",
                          }}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: (i * 6 + j) * 0.02,
                            duration: 0.3,
                          }}
                        >
                          {(val * 100).toFixed(1)}
                        </motion.td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Half-Time + Meta Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prediction.half_time && (
          <motion.div
            className="bg-card border border-border rounded-2xl p-5"
            variants={fadeUp}
          >
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-3">
              Previsão 1° Tempo
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                {
                  label: prediction.home_team?.slice(0, 3) ?? "CAS",
                  value: prediction.half_time.home_win_prob,
                  color: "#012AFE",
                },
                {
                  label: "EMP",
                  value: prediction.half_time.draw_prob,
                  color: "var(--muted-foreground)",
                },
                {
                  label: prediction.away_team?.slice(0, 3) ?? "FOR",
                  value: prediction.half_time.away_win_prob,
                  color: "#FF3B3B",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-muted/50 rounded-xl p-2.5 text-center"
                >
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    {item.label}
                  </div>
                  <div
                    className="text-lg font-black"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: item.color,
                    }}
                  >
                    {(item.value * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">
                  Over 0.5
                </div>
                <div
                  className="text-[15px] font-bold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {(prediction.half_time.over_0_5_prob * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">
                  Over 1.5
                </div>
                <div
                  className="text-[15px] font-bold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {(prediction.half_time.over_1_5_prob * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                <div className="text-[10px] text-muted-foreground mb-0.5">
                  Placar HT
                </div>
                <div
                  className="text-[15px] font-bold text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {prediction.half_time.most_likely_score}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3"
          variants={fadeUp}
        >
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
            Informações
          </div>
          {prediction.weather_condition && (
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
              <span className="text-base">🌤</span>
              <span className="font-semibold text-foreground">
                {prediction.weather_condition}
              </span>
              {prediction.weather_factor !== undefined &&
                prediction.weather_factor < 1 && (
                  <span className="text-[11px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md font-semibold ml-auto">
                    -{((1 - prediction.weather_factor) * 100).toFixed(0)}% gols
                  </span>
                )}
            </div>
          )}
          <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
            <span className="text-[11px] text-muted-foreground">Confiança</span>
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-md ml-auto"
              style={{
                background:
                  prediction.confidence === "Alta"
                    ? "rgba(0,200,150,0.12)"
                    : prediction.confidence === "Média"
                      ? "rgba(255,184,0,0.12)"
                      : "rgba(255,59,59,0.12)",
                color:
                  prediction.confidence === "Alta"
                    ? "#00C896"
                    : prediction.confidence === "Média"
                      ? "#FFB800"
                      : "#FF3B3B",
              }}
            >
              {prediction.confidence}
            </span>
          </div>
          {prediction.model_note && (
            <div className="text-[11px] text-muted-foreground italic bg-muted/40 rounded-lg px-3 py-2">
              {prediction.model_note}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PreMatchResultsDashboard({
  prediction,
  isInplay,
  teamMap,
}: {
  prediction: Prediction;
  isInplay: boolean;
  teamMap: Map<string, TeamInfo>;
}) {
  const homeTeam = teamMap.get(prediction.home_team) ?? null;
  const awayTeam = teamMap.get(prediction.away_team) ?? null;
  const homeProb = prediction.home_win_prob;
  const drawProb = prediction.draw_prob;
  const awayProb = prediction.away_win_prob;

  return (
    <motion.div
      className="w-full space-y-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Section 1: Confronto */}
      <motion.div
        variants={fadeUp}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-clinical p-8 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--primary)_0%,transparent_60%)] opacity-[0.03] dark:opacity-[0.06]" />

        <div className="flex flex-col items-center gap-1 mb-8 relative">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Premier League
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center px-8 relative mb-10">
          <div className="flex flex-col items-center gap-3 w-32">
            <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center shadow-sm overflow-hidden text-muted-foreground/40">
              {homeTeam?.image_url ? (
                <img
                  src={homeTeam.image_url}
                  alt={prediction.home_team}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <Shield className="w-10 h-10" />
              )}
            </div>
            <div className="text-center">
              <h3 className="font-headline text-sm font-black uppercase tracking-tight text-foreground">
                {prediction.home_team}
              </h3>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                Casa
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-headline font-black text-foreground tracking-widest">
              {prediction.most_likely_score.replace("-", " - ")}
            </div>
            <div className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              Mais Provável
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 w-32">
            <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center shadow-sm overflow-hidden text-muted-foreground/40">
              {awayTeam?.image_url ? (
                <img
                  src={awayTeam.image_url}
                  alt={prediction.away_team}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <Shield className="w-10 h-10" />
              )}
            </div>
            <div className="text-center">
              <h3 className="font-headline text-sm font-black uppercase tracking-tight text-foreground">
                {prediction.away_team}
              </h3>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                Visitante
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 space-y-2 relative">
          <div className="flex justify-between text-[10px] font-black">
            <span className="text-primary">{Math.round(homeProb * 100)}%</span>
            <span className="text-muted-foreground">
              {Math.round(drawProb * 100)}%
            </span>
            <span className="text-red-500">{Math.round(awayProb * 100)}%</span>
          </div>
          <div className="flex h-2 w-full rounded-full overflow-hidden">
            <div
              className="bg-primary h-full"
              style={{ width: `${homeProb * 100}%` }}
            ></div>
            <div
              className="bg-muted-foreground/30 h-full border-x border-background"
              style={{ width: `${drawProb * 100}%` }}
            ></div>
            <div
              className="bg-red-500 h-full"
              style={{ width: `${awayProb * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[8px] font-bold uppercase tracking-tight text-muted-foreground">
            <span>{prediction.home_team.slice(0, 10)}</span>
            <span>Empate</span>
            <span>{prediction.away_team.slice(0, 10)}</span>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Odds Possíveis */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div
          variants={fadeUp}
          className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            XG CASA
          </span>
          <div className="text-4xl font-headline font-black text-primary mb-1">
            {prediction.lambda_home.toFixed(2)}
          </div>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-nowrap">
            {prediction.home_team.slice(0, 10)}
          </span>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            XG FORA
          </span>
          <div className="text-4xl font-headline font-black text-red-500 mb-1">
            {prediction.lambda_away.toFixed(2)}
          </div>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest text-nowrap">
            {prediction.away_team.slice(0, 10)}
          </span>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            OVER 2.5
          </span>
          <div className="text-4xl font-headline font-black text-foreground mb-1">
            {Math.round(prediction.over_2_5_prob * 100)}%
          </div>
          <div className="w-12 h-0.5 bg-foreground rounded-full mt-2"></div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            BTTS
          </span>
          <div className="text-4xl font-headline font-black text-foreground mb-1">
            {Math.round(prediction.btts_prob * 100)}%
          </div>
          <div className="w-12 h-0.5 bg-foreground rounded-full mt-2"></div>
        </motion.div>
      </motion.div>

      {/* Section 3: Placares Mais Prováveis */}
      <motion.div
        variants={fadeUp}
        className="bg-card p-6 rounded-xl border border-border shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
            Placares mais prováveis
          </h3>
          <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
            Top {Math.min(prediction.top_scores.length, 5)} Resultados
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {prediction.top_scores.slice(0, 5).map(([score, prob], i) => (
            <div
              key={score}
              className={`border rounded-xl p-5 text-center relative ${i === 0 ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10 overflow-hidden" : "bg-muted/30 dark:bg-slate-900 border-border"}`}
            >
              {i === 0 && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-black bg-primary text-white px-3 py-0.5 rounded-b uppercase tracking-tighter">
                  Top
                </span>
              )}
              <div
                className={`text-2xl font-headline font-black ${i === 0 ? "text-primary mt-2" : "text-foreground"}`}
              >
                {score}
              </div>
              <div className="text-[11px] text-muted-foreground font-bold uppercase mt-1">
                {(prob * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 4: Matriz de Probabilidade */}
      {prediction.score_matrix && prediction.score_matrix.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="bg-card p-8 rounded-xl border border-border shadow-clinical overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-1">
                Matriz de Probabilidade
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium">
                Cores mais intensas indicam maior probabilidade estatística para
                o placar correspondente.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase font-black tracking-widest">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-muted/50 border border-border"></span>
                Baixa
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary"></span> Alta
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-bold border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <th className="p-2 text-muted-foreground/60 italic font-medium">
                    {prediction.home_team.slice(0, 3).toUpperCase()} \{" "}
                    {prediction.away_team.slice(0, 3).toUpperCase()}
                  </th>
                  {prediction.score_matrix[0]?.slice(0, 6).map((_, j) => (
                    <th key={j} className="p-2 text-foreground">
                      {j}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center">
                {prediction.score_matrix.slice(0, 6).map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 text-foreground">{i}</td>
                    {row.slice(0, 6).map((val, j) => {
                      const probPercentage = val * 100;
                      let bgClass = "bg-muted/10 text-muted-foreground/60";
                      if (probPercentage >= 10)
                        bgClass =
                          "bg-primary text-white shadow-lg shadow-primary/20 ring-2 ring-primary";
                      else if (probPercentage >= 7)
                        bgClass = "bg-[rgba(1,42,254,0.8)] text-white";
                      else if (probPercentage >= 5)
                        bgClass = "bg-[rgba(1,42,254,0.6)] text-white";
                      else if (probPercentage >= 3)
                        bgClass = "bg-[rgba(1,42,254,0.4)] text-foreground";
                      else if (probPercentage >= 1.5)
                        bgClass =
                          "bg-[rgba(1,42,254,0.15)] text-muted-foreground";
                      else if (probPercentage > 0.4)
                        bgClass =
                          "bg-[rgba(1,42,254,0.08)] text-muted-foreground";

                      return (
                        <td
                          key={j}
                          className={`p-3 rounded-lg matrix-cell ${bgClass} transition-all duration-200 hover:scale-105 hover:z-10`}
                        >
                          {probPercentage > 0
                            ? probPercentage.toFixed(1)
                            : "0.0"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Section 5: Previsão 1° Tempo & Infos */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column: Previsão 1° Tempo */}
        {prediction.half_time && (
          <motion.div
            variants={fadeUp}
            className="bg-card p-6 rounded-xl border border-border shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                Previsão 1º Tempo
              </h3>
              <span className="text-[9px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase">
                Half-Time
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Card: Casa */}
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1 truncate max-w-full">
                  {prediction.home_team.slice(0, 3)}
                </span>
                <span className="text-xl font-headline font-black text-primary">
                  {Math.round(prediction.half_time.home_win_prob * 100)}%
                </span>
              </div>
              {/* Card: Empate */}
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1">
                  EMP
                </span>
                <span className="text-xl font-headline font-black text-muted-foreground">
                  {Math.round(prediction.half_time.draw_prob * 100)}%
                </span>
              </div>
              {/* Card: Fora */}
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1 truncate max-w-full">
                  {prediction.away_team.slice(0, 3)}
                </span>
                <span className="text-xl font-headline font-black text-red-500">
                  {Math.round(prediction.half_time.away_win_prob * 100)}%
                </span>
              </div>
              {/* Card: Over 0.5 */}
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1">
                  Over 0.5
                </span>
                <span className="text-xl font-headline font-black text-foreground">
                  {Math.round(prediction.half_time.over_0_5_prob * 100)}%
                </span>
              </div>
              {/* Card: Over 1.5 */}
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1">
                  Over 1.5
                </span>
                <span className="text-xl font-headline font-black text-foreground">
                  {Math.round((prediction.half_time.over_1_5_prob ?? 0) * 100)}%
                </span>
              </div>
              {/* Card: Placar HT */}
              <div className="bg-muted/40 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-1">
                  Placar HT
                </span>
                <span className="text-xl font-headline font-black text-primary">
                  {prediction.half_time.most_likely_score}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={fadeUp}
          className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-3"
        >
          <div className="text-[11px] uppercase tracking-widest text-foreground font-bold">
            Informações Adicionais
          </div>
          {prediction.weather_condition && (
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-muted/40 border border-border/50 rounded-lg px-3 py-2">
              <Cloud className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {prediction.weather_condition}
              </span>
              {prediction.weather_factor !== undefined &&
                prediction.weather_factor < 1 && (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-semibold ml-auto border border-amber-500/20">
                    -{((1 - prediction.weather_factor) * 100).toFixed(0)}% gols
                  </span>
                )}
            </div>
          )}
          <div className="flex items-center gap-2 bg-muted/40 border border-border/50 rounded-lg px-3 py-2">
            <span className="text-[11px] text-muted-foreground font-semibold">
              Confiança do Modelo
            </span>
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-md ml-auto"
              style={{
                background:
                  prediction.confidence === "Alta"
                    ? "rgba(0,255,100,0.1)"
                    : prediction.confidence === "Média"
                      ? "rgba(255,184,0,0.1)"
                      : "rgba(255,59,59,0.1)",
                color:
                  prediction.confidence === "Alta"
                    ? "#00C896"
                    : prediction.confidence === "Média"
                      ? "#FFB800"
                      : "#FF3B3B",
                borderColor:
                  prediction.confidence === "Alta"
                    ? "rgba(0,255,100,0.2)"
                    : prediction.confidence === "Média"
                      ? "rgba(255,184,0,0.2)"
                      : "rgba(255,59,59,0.2)",
                borderWidth: "1px",
              }}
            >
              {prediction.confidence}
            </span>
          </div>
          {prediction.model_note && (
            <div className="text-[11px] text-muted-foreground italic bg-muted/40 border border-border/50 rounded-lg px-3 py-2">
              {prediction.model_note}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const SidebarWidgets = ({ confidenceValue }: { confidenceValue: number }) => (
  <>
    <motion.div
      variants={fadeUp}
      className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tighter">
          <span className="text-muted-foreground">Confidence Interval</span>
          <span className="text-primary">{confidenceValue.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${confidenceValue}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>

    <motion.div
      variants={fadeUp}
      className="bg-card dark:bg-slate-950 text-foreground p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Status da Engine IA
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Confiança Simulação
            </span>
            <span className="text-xs font-headline font-black text-green-500 uppercase">
              Alta
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Versão do Modelo
            </span>
            <span className="text-xs font-mono font-medium text-foreground">
              Goat-V4.2.Alpha
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Dataset Last Update
            </span>
            <span className="text-xs font-mono font-medium text-foreground">
              03.12.2024
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <motion.span
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Engine Status: Real-Time Active
        </span>
      </div>
    </motion.div>
  </>
);

function PreMatchView({
  onTeamsChange,
  homeTeamInfo,
  awayTeamInfo,
  isLoading,
  prediction,
  error,
  teamMap,
  onSubmit,
}: {
  onTeamsChange: (home: string, away: string) => void;
  homeTeamInfo: TeamInfo | null;
  awayTeamInfo: TeamInfo | null;
  isLoading: boolean;
  prediction: Prediction | undefined;
  error: Error | null;
  teamMap: Map<string, TeamInfo>;
  onSubmit: (data: PreMatchValues) => void;
}) {
  const [confidenceValue] = useState(98.4);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Sidebar: Controls */}
      <motion.div
        className="xl:col-span-4 space-y-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="bg-card p-6 rounded-xl border border-border shadow-clinical"
        >
          <div className="flex items-center gap-2 mb-8">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Parâmetros de Entrada
            </h2>
          </div>
          <PreMatchForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            onTeamsChange={onTeamsChange}
          />
        </motion.div>

        {/* Desktop Widgets */}
        <div className="hidden xl:flex flex-col space-y-6">
          <SidebarWidgets confidenceValue={confidenceValue} />
        </div>
      </motion.div>

      {/* Right Content: Simulation Results */}
      <div className="xl:col-span-8 flex flex-col gap-8">
        {prediction ? (
          <PreMatchResultsDashboard
            prediction={prediction}
            isInplay={false}
            teamMap={teamMap}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {!isLoading && !error && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--primary)_0%,transparent_70%)] opacity-[0.02] dark:opacity-[0.04]" />
                  <BarChart3 className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <div
                    className="text-[18px] text-foreground font-bold mb-2 relative"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Monte seu cenário
                  </div>
                  <div className="text-[13px] text-muted-foreground max-w-xs leading-relaxed relative">
                    Selecione os times e veja as probabilidades calculadas pelo
                    modelo Poisson.
                  </div>
                </div>
              )}

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden shadow-sm"
                >
                  <div className="relative mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-full border-2 border-primary/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 w-16 h-16 rounded-full border-t-2 border-primary"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                  <div
                    className="text-[15px] text-foreground font-bold mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Processando modelo
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    Calculando distribuição Poisson...
                  </div>
                </motion.div>
              )}

              {error && !prediction && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-destructive/30 rounded-2xl p-8"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                      <TriangleAlert className="text-destructive w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-destructive mb-1">
                        Erro na simulação
                      </div>
                      <div className="text-[13px] text-muted-foreground">
                        {error.message ??
                          "Ocorreu um erro inesperado. Tente novamente."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile Widgets - at the very bottom */}
        <div className="xl:hidden flex flex-col space-y-6 w-full">
          <SidebarWidgets confidenceValue={confidenceValue} />
        </div>
      </div>
    </div>
  );
}

export default function SimuladorPage() {
  const [mode, setMode] = useState<"pre-match" | "inplay">("pre-match");
  const [selectedTeams, setSelectedTeams] = useState<{
    home: string;
    away: string;
  }>({ home: "", away: "" });
  const preMatchMutation = useSimulatorPrediction();
  const inplayMutation = useSimulatorInplay();

  const { data: teamsData } = useTeams();
  const { data: liveMatches } = useLiveMatches();
  const { data: upcomingMatches } = useUpcomingMatches();

  const teamMap = useMemo(() => {
    const map = new Map<string, TeamInfo>();
    teamsData?.teams.forEach((t) =>
      map.set(t.name, { id: t.id, name: t.name }),
    );
    const allMatches = [...(liveMatches ?? []), ...(upcomingMatches ?? [])];
    allMatches.forEach((m) => {
      if (m.home.image_url) {
        const existing = map.get(m.home.name);
        if (existing)
          map.set(m.home.name, { ...existing, image_url: m.home.image_url });
      }
      if (m.away.image_url) {
        const existing = map.get(m.away.name);
        if (existing)
          map.set(m.away.name, { ...existing, image_url: m.away.image_url });
      }
    });
    return map;
  }, [teamsData, liveMatches, upcomingMatches]);

  const homeTeamInfo = teamMap.get(selectedTeams.home) ?? null;
  const awayTeamInfo = teamMap.get(selectedTeams.away) ?? null;

  const activeMutation =
    mode === "pre-match" ? preMatchMutation : inplayMutation;
  const prediction = activeMutation.data;
  const isLoading = activeMutation.isPending;
  const error = activeMutation.error;

  function handlePreMatchSubmit(data: PreMatchValues) {
    preMatchMutation.mutate({
      home: data.home,
      away: data.away,
      referee: data.referee || undefined,
      stadium: data.stadium || undefined,
      city: data.city || undefined,
      match_hour_utc: data.match_hour_utc,
    });
  }

  function handleInplaySubmit(data: InplayValues) {
    inplayMutation.mutate({
      home: data.home,
      away: data.away,
      home_goals: data.home_goals,
      away_goals: data.away_goals,
      minute: data.minute,
      referee: data.referee || undefined,
      home_red: data.home_red || undefined,
      away_red: data.away_red || undefined,
    });
  }

  function switchMode(m: "pre-match" | "inplay") {
    setMode(m);
    setSelectedTeams({ home: "", away: "" });
    preMatchMutation.reset();
    inplayMutation.reset();
  }

  function handleTeamsChange(home: string, away: string) {
    setSelectedTeams({ home, away });
  }

  return (
    <div className="relative px-6 py-8 max-w-7xl mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/3 dark:bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <Image
            src="/premier-complete-logo.png"
            alt="Premier League"
            width={32}
            height={32}
            className="dark:brightness-[3] dark:contrast-75"
          />
          <div className="h-5 w-px bg-border" />
          <h1
            className="text-[28px] md:text-[36px] uppercase tracking-tight text-foreground leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulador
          </h1>
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
              Poisson
            </span>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground max-w-md">
          Monte qualquer cenário e receba uma previsão calibrada em tempo real.
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="inline-flex bg-card border border-border rounded-2xl p-1.5 shadow-sm">
          {[
            { id: "pre-match" as const, label: "Pré-jogo", icon: "📋" },
            { id: "inplay" as const, label: "Ao vivo", icon: "⚡" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id)}
              className={`relative px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 cursor-pointer ${mode === tab.id ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              {mode === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-[0_2px_12px_rgba(1,42,254,0.35)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Match Preview */}
      <div className="mb-6">
        <MatchPreviewCard
          homeTeam={homeTeamInfo}
          awayTeam={awayTeamInfo}
          mode={mode}
        />
      </div>

      {/* Main Content - Mode Switching */}
      <AnimatePresence mode="wait">
        {mode === "pre-match" ? (
          <motion.div
            key="pre-match-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <PreMatchView
              onTeamsChange={handleTeamsChange}
              homeTeamInfo={homeTeamInfo}
              awayTeamInfo={awayTeamInfo}
              isLoading={isLoading}
              prediction={prediction}
              error={error}
              teamMap={teamMap}
              onSubmit={handlePreMatchSubmit}
            />
          </motion.div>
        ) : (
          <motion.div
            key="inplay-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-5 shadow-sm overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/3 dark:bg-primary/6 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <InplayForm
                    onSubmit={handleInplaySubmit}
                    isLoading={inplayMutation.isPending}
                    onTeamsChange={handleTeamsChange}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {!prediction && !isLoading && !error && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--primary)_0%,transparent_70%)] opacity-[0.02] dark:opacity-[0.04]" />
                    <Image
                      src="/premier-complete-logo.png"
                      alt="Premier League"
                      width={48}
                      height={48}
                      className="opacity-10 mb-4 dark:brightness-[3] dark:contrast-75"
                    />
                    <div
                      className="text-[18px] text-foreground font-bold mb-2 relative"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Monte seu cenário
                    </div>
                    <div className="text-[13px] text-muted-foreground max-w-xs leading-relaxed relative">
                      Selecione os times e veja as probabilidades calculadas
                      pelo modelo Poisson.
                    </div>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden"
                  >
                    <div className="relative mb-6">
                      <motion.div
                        className="w-16 h-16 rounded-full border-2 border-primary/20"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 w-16 h-16 rounded-full border-t-2 border-primary"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/premier-logo.png"
                          alt=""
                          width={24}
                          height={24}
                          className="opacity-40"
                        />
                      </div>
                    </div>
                    <div
                      className="text-[15px] text-foreground font-bold mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Processando modelo
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      Calculando distribuição Poisson...
                    </div>
                  </motion.div>
                )}

                {error && !prediction && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-destructive/30 rounded-2xl p-8"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <span className="text-destructive text-lg font-bold">
                          !
                        </span>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-destructive mb-1">
                          Erro na simulação
                        </div>
                        <div className="text-[13px] text-muted-foreground">
                          {error.message ??
                            "Ocorreu um erro inesperado. Tente novamente."}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {prediction && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultsDashboard
                      prediction={prediction}
                      isInplay={true}
                      teamMap={teamMap}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
