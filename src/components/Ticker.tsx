"use client";

import { type Layoff } from "@/lib/data";

interface Props {
  layoffs: Layoff[];
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

export default function Ticker({ layoffs }: Props) {
  const items = layoffs.map(
    (l) => `${l.emoji} ${l.company}: ${fmt(l.count)} jobs 💀`
  );

  // doubled for seamless loop
  const all = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-2.5 mb-6"
      style={{
        background: "rgba(255,59,59,0.06)",
        borderTop: "1px solid rgba(255,59,59,0.15)",
        borderBottom: "1px solid rgba(255,59,59,0.15)",
      }}
    >
      <div className="ticker-inner">
        {all.map((item, i) => (
          <span key={i} className="font-mono-custom text-xs whitespace-nowrap px-10" style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--muted)" }}>
            {item}
            {i % 2 === 0 && (
              <span className="mx-4" style={{ color: "var(--muted)" }}>///</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
