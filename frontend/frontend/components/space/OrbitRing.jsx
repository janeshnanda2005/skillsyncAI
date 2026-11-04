import React from "react";

export default function OrbitRing({ className = "", size = 200, color = "var(--glow-orbit)" }) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size * 0.6,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        opacity: 0.35,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
          opacity: 0.9,
          transform: "translate(-50%, -50%)",
          animation: `orbit 60s linear infinite`,
        }}
      />
      <style>
        {`
          @keyframes orbit {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export { OrbitRing };
