import { useEffect, useRef } from "react";

/**
 * Interactive particle-wave background.
 * A grid of points oscillates in a cinematic sine wave; the cursor warps
 * the field, pushing particles outward and dragging brightness with it.
 */
export function ParticleWave({
  spacing = 28,
  color = "255, 255, 255",
  accent = "180, 200, 255",
}: {
  spacing?: number;
  color?: string;
  accent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, t = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    type P = { x: number; y: number; bx: number; by: number };
    let points: P[] = [];

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      const cols = Math.ceil(w / spacing) + 2;
      const rows = Math.ceil(h / spacing) + 2;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const bx = x * spacing - spacing;
          const by = y * spacing - spacing;
          points.push({ x: bx, y: by, bx, by });
        }
      }
    };
    build();

    const onResize = () => build();
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    const tick = () => {
      t += 0.015;
      ctx.clearRect(0, 0, w, h);

      const radius = 180;
      const radiusSq = radius * radius;

      for (const p of points) {
        // base wave displacement
        const wave =
          Math.sin(p.bx * 0.012 + t) * 6 +
          Math.cos(p.by * 0.014 + t * 1.1) * 6;

        let dx = 0, dy = 0, glow = 0;
        if (mouse.active) {
          const ddx = p.bx - mouse.x;
          const ddy = p.by - mouse.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < radiusSq) {
            const f = 1 - d2 / radiusSq;
            const d = Math.sqrt(d2) || 1;
            const push = f * 40;
            dx = (ddx / d) * push;
            dy = (ddy / d) * push;
            glow = f;
          }
        }

        p.x += ((p.bx + dx + Math.cos(t + p.by * 0.01) * 2) - p.x) * 0.18;
        p.y += ((p.by + dy + wave) - p.y) * 0.18;

        const size = 1 + glow * 2.2;
        const alpha = 0.18 + glow * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = glow > 0.15
          ? `rgba(${accent}, ${alpha})`
          : `rgba(${color}, ${alpha})`;
        if (glow > 0.3) {
          ctx.shadowBlur = 12 * glow;
          ctx.shadowColor = `rgba(${accent}, ${glow})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [spacing, color, accent]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />;
}
