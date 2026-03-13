"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  total: number;
  companies: number;
  biggest: number;
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const prevTarget = useRef(0);

  useEffect(() => {
    const from = prevTarget.current;
    prevTarget.current = target;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    function step(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

interface StatCardProps {
  label: string;
  emoji: string;
  value: number;
  unit: string;
  glowClass: string;
  numberColor: string;
  gradientFrom: string;
}

function StatCard({ label, emoji, value, unit, glowClass, numberColor, gradientFrom }: StatCardProps) {
  const displayed = useCountUp(value);

  return (
    <div
      className="relative overflow-hidden rounded-2xl flex-1 min-w-[190px] max-w-xs p-6 text-center transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* gradient tint */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${gradientFrom} 0%, transparent 70%)`,
        }}
      />
      <div
        className="font-mono-custom text-xs tracking-widest uppercase mb-2"
        style={{ color: "var(--muted)" }}
      >
        {emoji} {label}
      </div>
      <div
        className={`font-bebas text-6xl leading-none pop-in ${glowClass}`}
        style={{ color: numberColor }}
      >
        {fmt(displayed)}
      </div>
      <div className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>
        {unit}
      </div>
    </div>
  );
}

export default function DoomCounter({ total, companies, biggest }: Props) {
  return (
    <section className="flex justify-center gap-4 px-4 py-6 flex-wrap">
      <StatCard
        label="Total Casualties"
        emoji="💥"
        value={total}
        unit="human beings with mortgages"
        glowClass="glow-red"
        numberColor="var(--accent)"
        gradientFrom="rgba(255,59,59,0.12)"
      />
      <StatCard
        label="Companies Involved"
        emoji="🏢"
        value={companies}
        unit="did the right-sizing thing"
        glowClass="glow-orange"
        numberColor="var(--accent2)"
        gradientFrom="rgba(255,140,0,0.1)"
      />
      <StatCard
        label="Biggest Single Bloodbath"
        emoji="📉"
        value={biggest}
        unit="gone in one announcement"
        glowClass="glow-purple"
        numberColor="var(--accent3)"
        gradientFrom="rgba(168,85,247,0.1)"
      />
    </section>
  );
}
