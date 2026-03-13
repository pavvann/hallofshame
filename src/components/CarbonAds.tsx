"use client";

import { useEffect, useRef } from "react";

// Replace with your Carbon Ads serve ID from https://www.carbonads.net
const CARBON_SERVE_ID = "YOUR_CARBON_SERVE_ID";
const CARBON_PLACEMENT = "YOUR_PLACEMENT";

export default function CarbonAds() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || CARBON_SERVE_ID === "YOUR_CARBON_SERVE_ID") return;

    // Remove any existing Carbon script to avoid duplication on re-renders
    const existing = ref.current.querySelector("#_carbonads_js");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "_carbonads_js";
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE_ID}&placement=${CARBON_PLACEMENT}`;
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  if (CARBON_SERVE_ID === "YOUR_CARBON_SERVE_ID") return null;

  return <div ref={ref} />;
}
