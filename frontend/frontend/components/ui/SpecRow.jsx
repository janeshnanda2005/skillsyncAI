import React from "react";

export default function SpecRow({ label, value, className = "" }) {
  return (
    <div
      className={[
        "flex items-baseline justify-between py-2 px-4 border-b border-border/50 last:border-0",
        className,
      ].join(" ")}
    >
      <span
        className="text-xs font-bold uppercase tracking-widest text-fg-subtle"
        style={{ letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <span className="text-sm font-semibold text-fg tabular-nums">{value}</span>
    </div>
  );
}


export { SpecRow };
