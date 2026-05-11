import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — XPVerse" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Welcome back, hero");
    nav({ to: "/dashboard" });
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <ParticleBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-strong rounded-3xl p-8" style={{ boxShadow: "var(--shadow-purple)" }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Zap className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-bold gradient-text">XPVerse</span>
          </Link>
          <h1 className="font-display text-2xl font-bold mt-6">Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Continue your journey, hero.</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hero@xpverse.gg" type="email" required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border focus:border-primary outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Password" type="password" required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border focus:border-primary outline-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-display font-bold text-primary-foreground hover:scale-[1.02] transition"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-neon)" }}>
            Enter the verse
          </button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
        </div>
        <button onClick={() => { toast.success("Signed in with Google"); nav({ to: "/dashboard" }); }}
          className="w-full py-3 rounded-lg glass font-display font-bold hover:border-primary/60">
          Continue with Google
        </button>
        <p className="text-xs text-center text-muted-foreground mt-6">
          New here? <Link to="/character" className="text-primary hover:underline">Create your hero →</Link>
        </p>
      </motion.div>
    </div>
  );
}
