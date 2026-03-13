"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { layoffs as allLayoffs, VIBES, type Layoff, type VibeKey } from "@/lib/data";
import DoomCounter from "./DoomCounter";
import Ticker from "./Ticker";
import LayoffTable from "./LayoffTable";

type SortKey = "date" | "count" | "pct" | "company";
type SortDir = "asc" | "desc";

interface Props {
  initialData: Layoff[];
}

export default function LayoffTracker({ initialData }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [vibeFilter, setVibeFilter] = useState<VibeKey | "all">("all");

  const filtered = useMemo(() => {
    let data = [...initialData];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.company.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q) ||
          r.vibe.toLowerCase().includes(q)
      );
    }

    if (vibeFilter !== "all") {
      data = data.filter((r) => r.vibe === vibeFilter);
    }

    data.sort((a, b) => {
      let diff = 0;
      if (sortKey === "company") diff = a.company.localeCompare(b.company);
      else if (sortKey === "date") diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortKey === "count") diff = a.count - b.count;
      else if (sortKey === "pct") diff = a.pct - b.pct;
      return sortDir === "asc" ? diff : -diff;
    });

    return data;
  }, [initialData, search, sortKey, sortDir, vibeFilter]);

  const totalCasualties = filtered.reduce((s, r) => s + r.count, 0);
  const biggestSingle   = filtered.length ? Math.max(...filtered.map((r) => r.count)) : 0;
  const companiesHit    = new Set(filtered.map((r) => r.company)).size;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const vibeKeys: (VibeKey | "all")[] = ["all", "nuclear", "cursed", "cope", "yikes", "dead"];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── HEADER ── */}
      <header className="relative overflow-hidden pt-12 pb-6 text-center px-4">
        {/* radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,59,59,0.15) 0%, transparent 65%)",
          }}
        />

        <p
          className="font-mono-custom text-xs tracking-widest uppercase mb-2 blink"
          style={{ color: "var(--accent)" }}
        >
          ⚠ BREAKING: ECONOMY TOTALLY FINE ⚠
        </p>

        <h1
          className="font-bebas glitch select-none leading-none"
          style={{
            fontSize: "clamp(3.5rem, 14vw, 9rem)",
            background: "linear-gradient(135deg, #ff3b3b 0%, #ff8c00 45%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(255,59,59,0.35))",
          }}
        >
          HALL OF SHAME
        </h1>

        <p
          className="font-mono-custom mt-3 text-xs tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          LAYOFF TRACKER 2022-2025 &nbsp;·&nbsp;{" "}
          <span style={{ color: "var(--accent2)" }}>they said the economy was fine 💀</span>
          &nbsp;·&nbsp; updated in our nightmares
        </p>
      </header>

      {/* ── DOOM COUNTERS ── */}
      <DoomCounter
        total={totalCasualties}
        companies={companiesHit}
        biggest={biggestSingle}
      />

      {/* ── TICKER ── */}
      <Ticker layoffs={initialData} />

      {/* ── DISCLAIMER BANNER ── */}
      <div className="mx-auto max-w-6xl px-4 mb-6">
        <div
          className="rounded-xl px-4 py-3 text-center font-mono-custom text-xs leading-relaxed"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,59,59,0.06), rgba(255,140,0,0.06), rgba(168,85,247,0.06))",
            border: "1px solid rgba(255,59,59,0.15)",
            color: "var(--muted)",
          }}
        >
          <span style={{ color: "var(--accent2)" }}>DISCLAIMER:</span> This page is satire. The
          numbers are real. Which is somehow worse. &nbsp;|&nbsp; &quot;Synergies realized&quot; =
          your entire team. &nbsp;|&nbsp; &quot;Restructuring&quot; = bruh. &nbsp;|&nbsp;
          &quot;Difficult decision&quot; = the board&apos;s yacht payment.
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="mx-auto max-w-6xl px-4 mb-4 flex flex-col sm:flex-row gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "var(--muted)" }}>🔍</span>
          <input
            type="text"
            placeholder="Search companies, vibes, suffering..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none transition-all"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,59,59,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Sort */}
        <select
          value={`${sortKey}-${sortDir}`}
          onChange={(e) => {
            const [k, d] = e.target.value.split("-") as [SortKey, SortDir];
            setSortKey(k);
            setSortDir(d);
          }}
          className="rounded-xl py-2.5 px-4 text-sm outline-none cursor-pointer"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            fontFamily: "inherit",
            appearance: "none",
            paddingRight: "2.2rem",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2355556a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
          }}
        >
          <option value="count-desc">Most Brutal 💀</option>
          <option value="count-asc">Least Brutal (lol)</option>
          <option value="date-desc">Newest First 📅</option>
          <option value="date-asc">Oldest First ⌛</option>
          <option value="pct-desc">Worst % Cut ✂️</option>
          <option value="company-asc">A–Z 🔡</option>
        </select>

        {/* Vibe filter chips */}
        <div className="flex gap-2 flex-wrap">
          {vibeKeys.map((v) => {
            const isAll = v === "all";
            const active = vibeFilter === v;
            const info = isAll ? null : VIBES[v];
            return (
              <button
                key={v}
                onClick={() => setVibeFilter(v)}
                className="font-mono-custom rounded-lg px-3 py-2 text-xs transition-all cursor-pointer"
                style={{
                  background: active ? "rgba(255,59,59,0.12)" : "var(--surface)",
                  border: active ? "1px solid rgba(255,59,59,0.5)" : "1px solid var(--border)",
                  color: active ? "var(--accent)" : "var(--muted)",
                }}
              >
                {isAll ? "All 💥" : `${info!.emoji} ${info!.label}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <LayoffTable
          data={filtered}
          total={initialData.length}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </div>

      {/* ── FOOTER ── */}
      <footer
        className="text-center py-8 px-4 font-mono-custom text-xs leading-relaxed"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
        }}
      >
        <div>💀 HALL OF SHAME · &quot;Disrupting&quot; the concept of job security since 2022</div>
        <div className="mt-1">
          Data sourced from public announcements, press releases &amp; collective grief. Not
          financial advice. Just vibes.
        </div>
        <div className="mt-1" style={{ color: "var(--accent)", fontSize: "0.65rem" }}>
          Every number is a person. Dark humor, not dark hearts. ❤️
        </div>
      </footer>
    </div>
  );
}
