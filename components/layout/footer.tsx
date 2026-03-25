"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import * as Color from "color-bits";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback = "rgba(180,180,180,1)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;
  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const el = document.createElement("div");
      el.style.color = cssColor;
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el).color;
      document.body.removeChild(el);
      return Color.formatRGBA(Color.parse(computed));
    }
    return Color.formatRGBA(Color.parse(cssColor as string));
  } catch {
    return fallback;
  }
};

const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

// ── FlickeringGrid ────────────────────────────────────────────────────────────

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "New Amsterdam", sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, w / (2 * dpr), h / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const sw = squareSize * dpr;
          const sh = squareSize * dpr;

          const maskData = maskCtx.getImageData(x, y, sw, sh).data;
          const hasText = maskData.some((v, idx) => idx % 4 === 0 && v > 0);

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, sw, sh);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) squares[i] = Math.random() * maxOpacity;
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateSize = () => {
      const nw = width || container.clientWidth;
      const nh = height || container.clientHeight;
      setCanvasSize({ width: nw, height: nh });
      gridParams = setupCanvas(canvas, nw, nh);
    };

    updateSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, delta);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      rafId = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    const io = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    if (isInView) rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
};

// ── Config ────────────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  {
    title: "Produto",
    links: [
      { id: 1, title: "Home", url: "/" },
      { id: 2, title: "Ao Vivo", url: "/ao-vivo" },
      { id: 3, title: "Pré-jogo", url: "/pre-jogo" },
      { id: 4, title: "Analytics", url: "/analytics" },
    ],
  },
  {
    title: "IA",
    links: [
      { id: 5, title: "Tipster IA", url: "/tipster" },
      { id: 6, title: "Modelo xG", url: "#" },
      { id: 7, title: "StatsBomb", url: "#" },
      { id: 8, title: "FBref", url: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { id: 9, title: "Sobre", url: "#" },
      { id: 10, title: "Contato", url: "#" },
      { id: 11, title: "Termos", url: "#" },
      { id: 12, title: "Privacidade", url: "#" },
    ],
  },
];

// ── Trust badges ──────────────────────────────────────────────────────────────

function TrustBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border border-(--border2) bg-(--pill-bg)">
      <span
        className="text-[13px] leading-none text-[#012AFE]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </span>
      <span className="text-[8px] text-(--text3) font-medium mt-px leading-none text-center">
        {label}
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const check = () => setValue(window.matchMedia(query).matches);
    check();
    window.addEventListener("resize", check);
    window.matchMedia(query).addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      window.matchMedia(query).removeEventListener("change", check);
    };
  }, [query]);
  return value;
}

export function Footer() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer id="footer" className="w-full pb-0 border-t border-border mt-14">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-8 md:p-10 max-w-[1280px] mx-auto gap-10">
        {/* Brand column */}
        <div className="flex flex-col items-start gap-5 max-w-xs">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 shrink-0 relative">
              <Image src="/goat-tips-logo.svg" alt="Goat Tips" fill className="object-contain" />
            </div>
            <span
              className="text-[18px] uppercase tracking-[0.02em] text-(--text) leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GOAT <span className="text-[#012AFE]">TIPS</span>
            </span>
          </Link>

          <p className="text-[13px] text-(--text2) leading-[1.6] font-medium">
            Probabilidades calibradas com dados históricos, modelo xG ao vivo e análise de padrões. Sem viés humano, sem achismo.
          </p>

          <div className="flex items-center gap-2.5">
            <TrustBadge value="84%" label="Acurácia" />
            <TrustBadge value="1.8k" label="Partidas" />
            <TrustBadge value="3" label="APIs" />
          </div>

          <p className="text-[11px] text-(--text3)">
            © 2026 Goat Tips. Jogue com responsabilidade.
          </p>
        </div>

        {/* Links columns */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
          {FOOTER_LINKS.map((column, idx) => (
            <ul key={idx} className="flex flex-col gap-2">
              <li className="mb-1 text-[12px] font-semibold text-(--text) uppercase tracking-[0.08em]">
                {column.title}
              </li>
              {column.links.map((link) => (
                <li
                  key={link.id}
                  className="group inline-flex cursor-pointer items-center gap-1 text-[13px] text-(--text2)"
                >
                  <Link
                    href={link.url}
                    className="hover:text-[#012AFE] transition-colors duration-200 no-underline"
                  >
                    {link.title}
                  </Link>
                  <div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-100 text-(--text3)">
                    <ChevronRightIcon className="h-3 w-3" />
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Flickering grid bottom */}
      <div className="w-full h-40 md:h-56 relative mt-10 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-transparent to-(--bg) z-10 from-40%" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text={tablet ? "GOAT TIPS" : "GOAT TIPS"}
            fontSize={tablet ? 64 : 96}
            fontWeight={400}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#012AFE"
            maxOpacity={0.25}
            flickerChance={0.08}
          />
        </div>
      </div>
    </footer>
  );
}
