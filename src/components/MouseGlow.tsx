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
      className="pointer-events-none fixed z-[2] h-[200px] w-[200px] rounded-full opacity-60 blur-3xl transition-transform duration-100"
      style={{
        left: pos.x - 100, top: pos.y - 100,
        background: "radial-gradient(circle, oklch(0.85 0.2 190 / 0.5), transparent 70%)",
      }}
    />
  );
}
