import { Chat } from "@/components/tipster/chat";

export default function TipsterPage() {
  return (
    <div className="px-6 py-6 max-w-[900px] mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1
          className="text-[clamp(36px,5vw,56px)] uppercase tracking-[0.01em] text-(--text) leading-none mb-[10px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Tipster <span className="text-[#012AFE]">IA</span>
        </h1>
        <p
          className="text-[14px] text-(--text2) leading-[1.6] max-w-[500px] mx-auto"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Pergunte sobre qualquer partida, jogador ou tendência. A IA analisa dados históricos e ao vivo para te responder.
        </p>
      </div>

      <Chat />
    </div>
  );
}
