import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePlayer, playerStore } from "@/store/player";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — XPVerse" }] }),
  component: Profile,
});

function Profile() {
  const p = usePlayer();
  const nav = useNavigate();
  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">— Operator File</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold tracking-tighter">{p.username}</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl glass p-8 text-center">
          <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple text-5xl font-bold animate-pulse-glow">{p.avatar}</div>
          <div className="mt-6 font-display text-2xl">{p.username}</div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Lv {p.level} · {p.charClass}</div>
        </div>
        <div className="rounded-2xl glass p-8 space-y-4">
          <Row label="Class" value={p.charClass} />
          <Row label="Coins" value={`${p.coins}¤`} />
          <Row label="Quests done" value={`${p.quests.filter(q => q.done).length}`} />
          <Row label="Achievements" value={`${p.achievements.filter(a => a.unlocked).length} / ${p.achievements.length}`} />
          <button onClick={() => { playerStore.reset(); nav({ to: "/" }); }}
            className="mt-4 w-full rounded-md bg-destructive/20 border border-destructive/40 py-3 font-mono text-xs uppercase tracking-widest text-destructive hover:bg-destructive/30">
            Reset progress
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between font-mono text-sm">
      <span className="text-muted-foreground uppercase text-xs tracking-widest">{label}</span>
      <span>{value}</span>
    </div>
  );
}
