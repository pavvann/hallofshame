"use client";

import { useState } from "react";
import { type Layoff, VIBES } from "@/lib/data";

type SortKey = "date" | "count" | "pct" | "company";
type SortDir = "asc" | "desc";

interface Props {
  data: Layoff[];
  total: number;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

function fmtDate(s: string) {
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  const active = col === sortKey;
  if (!active) return <span style={{ color: "var(--muted)", marginLeft: "4px" }}>⇅</span>;
  return <span style={{ color: "var(--accent)", marginLeft: "4px" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
}

export default function LayoffTable({ data, total, sortKey, sortDir, onSort }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    if (toastTimer) clearTimeout(toastTimer);
    setToast(msg);
    const t = setTimeout(() => setToast(null), 4000);
    setToastTimer(t);
  }

  const thStyle = {
    background: "var(--surface2)",
    color: "var(--muted)",
    padding: "0.85rem 1rem",
    textAlign: "left" as const,
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    userSelect: "none" as const,
    whiteSpace: "nowrap" as const,
    fontFamily: "Space Mono, monospace",
  };

  const tdBase = {
    padding: "0.9rem 1rem",
    borderBottom: "1px solid rgba(30,30,48,0.7)",
    verticalAlign: "middle" as const,
    fontSize: "0.875rem",
  };

  return (
    <>
      {/* Result count */}
      <div
        className="font-mono-custom text-xs px-4 py-2 rounded-t-2xl"
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          color: "var(--muted)",
        }}
      >
        Showing{" "}
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>{data.length}</span> of{" "}
        <span style={{ color: "var(--text)" }}>{total}</span> layoff events
        {data.length === 0 && " — maybe try a different search? (or just accept the grief)"}
      </div>

      <div
        className="overflow-hidden rounded-b-2xl"
        style={{ border: "1px solid var(--border)", borderTop: "none" }}
      >
        {data.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-3"
            style={{ background: "var(--surface)" }}
          >
            <span className="text-6xl">🤔</span>
            <p className="font-mono-custom text-sm" style={{ color: "var(--muted)" }}>
              No results. Maybe those companies are hiring?
            </p>
            <p className="font-mono-custom text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
              (jk, they&apos;re not)
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle} onClick={() => onSort("company")}>
                    Company <SortIcon col="company" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th style={thStyle} onClick={() => onSort("count")}>
                    Laid Off <SortIcon col="count" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th style={{ ...thStyle }} className="hidden sm:table-cell" onClick={() => onSort("pct")}>
                    % Cut <SortIcon col="pct" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th style={thStyle} onClick={() => onSort("date")}>
                    Date <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th style={thStyle}>Vibe Check</th>
                  <th style={thStyle} className="hidden lg:table-cell">The Tea ☕</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => {
                  const vibeInfo = VIBES[row.vibe];
                  const pctColor =
                    row.pct >= 20
                      ? "var(--accent)"
                      : row.pct >= 10
                      ? "var(--accent2)"
                      : "var(--muted)";

                  return (
                    <tr
                      key={row.id}
                      className="row-animate group cursor-pointer"
                      style={{
                        animationDelay: `${i * 0.025}s`,
                        background: "var(--surface)",
                      }}
                      onClick={() =>
                        showToast(`${row.emoji} ${row.company}: ${row.count.toLocaleString()} people. ${row.note}`)
                      }
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,59,59,0.04)";
                        const firstTd = (e.currentTarget as HTMLTableRowElement).firstElementChild as HTMLElement;
                        if (firstTd) firstTd.style.borderLeft = "3px solid var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "var(--surface)";
                        const firstTd = (e.currentTarget as HTMLTableRowElement).firstElementChild as HTMLElement;
                        if (firstTd) firstTd.style.borderLeft = "3px solid transparent";
                      }}
                    >
                      {/* Company */}
                      <td style={{ ...tdBase, borderLeft: "3px solid transparent", transition: "border-color 0.15s" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                            style={{
                              background: `${row.accentColor}22`,
                              border: `1px solid ${row.accentColor}44`,
                            }}
                          >
                            {row.emoji}
                          </div>
                          <div>
                            <div className="font-bold" style={{ color: "var(--text)", fontSize: "0.9rem" }}>
                              {row.company}
                            </div>
                            <div
                              className="font-mono-custom text-xs"
                              style={{ color: "var(--muted)" }}
                            >
                              {row.ticker}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Count */}
                      <td style={tdBase}>
                        <span
                          className="font-bebas text-3xl leading-none"
                          style={{
                            color: "var(--accent)",
                            filter: "drop-shadow(0 0 6px rgba(255,59,59,0.4))",
                          }}
                        >
                          {fmt(row.count)}
                        </span>
                      </td>

                      {/* Pct */}
                      <td style={tdBase} className="hidden sm:table-cell">
                        <div
                          className="font-mono-custom text-sm font-bold"
                          style={{ color: pctColor }}
                        >
                          {row.pct}%
                        </div>
                        <div
                          className="mt-1 h-1 w-24 rounded-full overflow-hidden"
                          style={{ background: "var(--border)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(row.pct, 100)}%`,
                              background: "linear-gradient(90deg, var(--accent), var(--accent2))",
                            }}
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td style={tdBase}>
                        <span
                          className="font-mono-custom text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          {fmtDate(row.date)}
                        </span>
                      </td>

                      {/* Vibe */}
                      <td style={tdBase}>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${vibeInfo.tw}`}
                        >
                          {vibeInfo.emoji} {vibeInfo.label}
                        </span>
                      </td>

                      {/* Note */}
                      <td
                        style={{ ...tdBase, color: "var(--muted)", maxWidth: "300px", lineHeight: "1.45", fontSize: "0.78rem" }}
                        className="hidden lg:table-cell"
                      >
                        {row.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl p-4 font-mono-custom text-xs leading-relaxed shadow-2xl transition-all"
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
          onClick={() => setToast(null)}
        >
          {toast}
          <div className="mt-1 opacity-40" style={{ fontSize: "0.6rem" }}>click to dismiss</div>
        </div>
      )}
    </>
  );
}
