import { cn } from "@/lib/utils";

interface StatBar {
  label: string;
  value: string;
  fill: number;
  color?: "blue" | "red" | "green" | "amber";
}

interface CalibrationItem {
  num: string;
  label: string;
}

interface AnalyticsCardProps {
  title: string;
  badge?: string;
  fullWidth?: boolean;
  stats?: StatBar[];
  calibrationItems?: CalibrationItem[];
  children?: React.ReactNode;
  className?: string;
}

const BAR_COLORS = {
  blue: "#012AFE",
  red: "#FF3B3B",
  green: "#00C896",
  amber: "#FFB800",
};

export function AnalyticsCard({
  title,
  badge,
  fullWidth = false,
  stats,
  calibrationItems,
  children,
  className,
}: AnalyticsCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-[14px] p-6",
        fullWidth && "md:col-span-2",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-[18px]">
        <div
          className="text-[18px] uppercase tracking-[0.04em] text-(--text)"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </div>
        {badge && (
          <span className="text-[11px] font-semibold bg-(--blue-dim) text-[#012AFE] px-2 py-[3px] rounded-[4px]">
            {badge}
          </span>
        )}
      </div>

      {stats && (
        <div className="flex flex-col gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-[5px]">
              <div className="flex justify-between text-[13px] text-(--text2)">
                <span>{stat.label}</span>
                <span className="font-semibold text-(--text)">{stat.value}</span>
              </div>
              <div className="bg-(--bg3) rounded-[4px] h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-[4px] transition-all duration-1000"
                  style={{
                    width: `${stat.fill}%`,
                    background: BAR_COLORS[stat.color ?? "blue"],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {calibrationItems && (
        <div className="grid grid-cols-2 gap-3">
          {calibrationItems.map((item, i) => (
            <div key={i} className="bg-(--bg2) rounded-lg p-[14px] text-center">
              <div
                className="text-[28px] text-[#012AFE] leading-none mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.num}
              </div>
              <div className="text-[11px] text-(--text2) font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
