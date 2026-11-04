import React, { useEffect, useRef } from "react";

export default function CountUp({ value, duration = 1200, className = "" }) {
  const displayRef = useRef(null);
  const animatedRef = useRef(0);

  useEffect(() => {
    const start = animatedRef.current;
    const diff = value - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(start + diff * eased);
      if (displayRef.current) displayRef.current.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        animatedRef.current = value;
      }
    }

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value, duration]);

  return (
    <span ref={displayRef} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value.toLocaleString()}
    </span>
  );
}

export { CountUp };
