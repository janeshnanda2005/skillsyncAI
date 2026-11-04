import React from "react";

export default function StatBlock({ value, label, sublabel, className = "" }) {
  return (
    <div className={["flex flex-col gap-1", className].join(" ")}>
      <span className="text-3xl font-bold text-fg tabular-nums font-heading">{value}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-fg-muted">
        {label}
      </span>
      {sublabel && (
        <span className="text-xs text-fg-subtle">{sublabel}</span>
      )}
    </div>
  );
}


export { StatBlock };
