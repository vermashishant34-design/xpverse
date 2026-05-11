import { createFileRoute } from "@tanstack/react-router";
import { usePlayer, setPlayer } from "@/store/player";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — XPVerse" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const player = usePlayer();
  const [name, setName] = useState(player.username);
  const [avatar, setAvatar] = useState(player.avatar);

  const save = () => {
    setPlayer((p) => ({ ...p, username: name, avatar }));
    toast.success("Profile saved");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-widest font-display text-primary">// Configuration</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Settings</h1>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Hero Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary outline-none" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest font-display text-muted-foreground">Avatar</label>
          <div className="mt-2 flex gap-2 flex-wrap">
            {["🦊","🐉","🤖","🥷","🧙","👾","🦅","🐺","⚔️","🚀"].map((a) => (
              <button key={a} onClick={() => setAvatar(a)}
                className={`h-12 w-12 rounded-lg text-2xl border transition ${avatar === a ? "border-primary bg-primary/15" : "border-border hover:border-primary/50"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <button onClick={save} className="px-6 py-2.5 rounded-lg font-display font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>Save</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display font-bold mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-3">Reset your hero and erase all progress.</p>
        <button onClick={() => { localStorage.removeItem("xpverse:player"); location.reload(); }} className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 text-sm font-display">
          Reset Character
        </button>
      </div>
    </div>
  );
}
