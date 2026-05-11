import { useEffect, useState } from "react";

export function MouseGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-[2] h-[500px] w-[500px] rounded-full opacity-40 blur-3xl transition-transform duration-100"
      style={{
        left: pos.x - 250, top: pos.y - 250,
        background: "radial-gradient(circle, oklch(0.7 0.22 255 / 0.35), transparent 70%)",
      }}
    />
  );
}
