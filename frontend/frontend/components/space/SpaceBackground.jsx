import React, { useEffect, useRef } from "react";

export default function SpaceBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    let stars = [];

    function resize() {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      initStars();
    }

    function initStars() {
      stars = [];
      const layers = [
        { count: 60, size: 0.5, speed: 0.1, opacity: 0.3, depth: 0.2 },
        { count: 100, size: 1, speed: 0.3, opacity: 0.6, depth: 0.5 },
        { count: 40, size: 1.5, speed: 0.6, opacity: 0.9, depth: 0.8 },
      ];
      layers.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: layer.size,
            speed: layer.speed,
            baseOpacity: layer.opacity,
            depth: layer.depth,
            phase: Math.random() * Math.PI * 2,
          });
        }
      });
    }

    let time = 0;
    function animate() {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + s.phase);
        const opacity = s.baseOpacity * (0.5 + 0.5 * twinkle);
        const driftX = s.x + Math.sin(time * s.speed) * 20;
        const driftY = s.y + Math.cos(time * s.speed * 0.7) * 15;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(driftX, driftY, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

export { SpaceBackground };
