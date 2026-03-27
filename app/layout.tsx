import type { Metadata } from "next";
import { New_Amsterdam, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingBot } from "@/components/layout/floating-bot";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ScrollReset } from "@/components/scroll-reset";
import { LenisProvider } from "@/components/lenis-provider";

const newAmsterdam = New_Amsterdam({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const notoSans = Noto_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOAT TIPS",
  description: "Tips que realmente convertem. Probabilidades calibradas com dados históricos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${newAmsterdam.variable} ${notoSans.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <LenisProvider>
          <ThemeProvider>
            <QueryProvider>
              <ScrollReset />
              <Navbar />
              <main className="pt-[60px] flex-1">{children}</main>
              <Footer />
              <FloatingBot />
            </QueryProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
