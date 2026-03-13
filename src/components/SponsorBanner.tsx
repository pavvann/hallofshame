"use client";

import CarbonAds from "./CarbonAds";

// When you land a direct sponsor, drop their details here and set IS_SPONSORED = true
const IS_SPONSORED = false;
const SPONSOR = {
  name: "Acme Corp",
  tagline: "We still have employees (for now)",
  url: "https://example.com",
  logo: null as string | null, // "/sponsor-logo.png"
};

// Your contact email for ad inquiries
const AD_EMAIL = "YOUR_EMAIL@here.com";

export default function SponsorBanner() {
  return (
    <div className="mx-auto max-w-6xl px-4 mb-6">
      {IS_SPONSORED ? (
        /* ── ACTIVE SPONSOR SLOT ── */
        <a
          href={SPONSOR.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 group"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(168,85,247,0.3)",
            boxShadow: "0 0 24px rgba(168,85,247,0.08)",
            textDecoration: "none",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="font-mono-custom text-xs tracking-widest uppercase"
              style={{ color: "var(--muted)" }}
            >
              SPONSOR
            </div>
            <div
              className="w-px h-6"
              style={{ background: "var(--border)" }}
            />
            {SPONSOR.logo ? (
              <img src={SPONSOR.logo} alt={SPONSOR.name} className="h-7 object-contain" />
            ) : (
              <span
                className="font-bebas text-2xl leading-none"
                style={{ color: "var(--accent3)" }}
              >
                {SPONSOR.name}
              </span>
            )}
            <span
              className="font-mono-custom text-xs hidden sm:block"
              style={{ color: "var(--muted)" }}
            >
              {SPONSOR.tagline}
            </span>
          </div>
          <span
            className="font-mono-custom text-xs transition-colors group-hover:text-white"
            style={{ color: "var(--muted)" }}
          >
            Visit →
          </span>
        </a>
      ) : (
        /* ── EMPTY SLOT — shows Carbon Ads or "buy this spot" CTA ── */
        <div
          className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "var(--surface)",
            border: "1px dashed rgba(168,85,247,0.25)",
          }}
        >
          <CarbonAds />

          {/* Fallback / always-visible CTA */}
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <div>
              <div
                className="font-bebas text-2xl leading-none"
                style={{ color: "var(--accent3)" }}
              >
                YOUR BRAND HERE
              </div>
              <div
                className="font-mono-custom text-xs mt-0.5"
                style={{ color: "var(--muted)" }}
              >
                while you still have employees, presumably
              </div>
            </div>
          </div>

          <a
            href={`mailto:${AD_EMAIL}?subject=Sponsoring Hall of Shame&body=Hi, I'd like to sponsor hallofshame.`}
            className="font-mono-custom text-xs rounded-xl px-5 py-2.5 transition-all duration-200 hover:scale-105 whitespace-nowrap"
            style={{
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.35)",
              color: "var(--accent3)",
              textDecoration: "none",
            }}
          >
            🤝 Advertise here
          </a>
        </div>
      )}
    </div>
  );
}
