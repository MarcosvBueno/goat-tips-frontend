import type { Lineup } from "@/types/api";

interface LineupDisplayProps {
  lineup: Lineup;
}

export function LineupDisplay({ lineup }: LineupDisplayProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div
        className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-4 font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Escalações
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { side: lineup.home, label: "Mandante" },
          { side: lineup.away, label: "Visitante" },
        ].map(({ side, label }) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-bold text-(--text)">
                {side.team.name}
              </span>
              <span className="text-[11px] bg-(--blue-dim) text-[#012AFE] px-2 py-[2px] rounded-[4px] font-semibold">
                {side.formation}
              </span>
            </div>

            <div className="text-[11px] text-(--text3) uppercase font-semibold mb-1.5">
              Titulares
            </div>
            <div className="flex flex-col gap-1 mb-3">
              {side.starting_xi.map((p) => (
                <div
                  key={p.number}
                  className="flex items-center gap-2 text-[12px]"
                >
                  <span className="w-6 h-6 rounded-full bg-(--bg3) flex items-center justify-center text-[10px] font-bold text-(--text2) shrink-0">
                    {p.number}
                  </span>
                  <span className="text-(--text)">{p.name}</span>
                  <span className="text-(--text3) text-[10px]">{p.position}</span>
                </div>
              ))}
            </div>

            {side.substitutes.length > 0 && (
              <>
                <div className="text-[11px] text-(--text3) uppercase font-semibold mb-1.5">
                  Reservas
                </div>
                <div className="flex flex-col gap-1">
                  {side.substitutes.map((p) => (
                    <div
                      key={p.number}
                      className="flex items-center gap-2 text-[12px] opacity-60"
                    >
                      <span className="w-6 h-6 rounded-full bg-(--bg3) flex items-center justify-center text-[10px] font-bold text-(--text3) shrink-0">
                        {p.number}
                      </span>
                      <span className="text-(--text2)">{p.name}</span>
                      <span className="text-(--text3) text-[10px]">{p.position}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
