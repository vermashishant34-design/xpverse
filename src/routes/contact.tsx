import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Studio Nilo" },
      { name: "description", content: "Start a conversation with Studio Nilo." },
    ],
  }),
  component: Contact,
});

const SERVICES = ["Brand systems", "Digital products", "Interface design", "Creative direction", "Other"];
const BUDGETS = ["< 25k", "25 — 75k", "75 — 150k", "150k +"];

function Contact() {
  const [service, setService] = useState(SERVICES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="pt-32 px-6 md:px-10 pb-24 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-12 gap-6 mb-16 md:mb-24">
          <p className="md:col-span-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">[ contact ]</p>
          <h1 className="md:col-span-9 text-balance text-4xl md:text-6xl font-light leading-[1.05]">
            <span className="text-foreground">Tell us about the project.</span>{" "}
            <span className="text-foreground/45">We reply within two working days.</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Form */}
          <div className="md:col-span-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="border-t hairline pt-12"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">[ received ]</p>
                <h2 className="mt-4 text-3xl md:text-5xl font-light">Thank you.</h2>
                <p className="mt-4 text-foreground/60 max-w-md">We've got your message. Expect a reply within two working days, from a real human.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="border-t hairline">
                <Field label="01 — Your name">
                  <input required placeholder="e.g. Maya Chen" className="w-full bg-transparent border-0 border-b hairline focus:border-foreground outline-none py-3 text-lg font-light placeholder:text-foreground/30" />
                </Field>
                <Field label="02 — Email">
                  <input required type="email" placeholder="you@company.com" className="w-full bg-transparent border-0 border-b hairline focus:border-foreground outline-none py-3 text-lg font-light placeholder:text-foreground/30" />
                </Field>
                <Field label="03 — Company">
                  <input placeholder="Optional" className="w-full bg-transparent border-0 border-b hairline focus:border-foreground outline-none py-3 text-lg font-light placeholder:text-foreground/30" />
                </Field>

                <Field label="04 — What do you need?">
                  <div className="flex flex-wrap gap-2 pt-3">
                    {SERVICES.map((s) => (
                      <button type="button" key={s} onClick={() => setService(s)}
                        className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition ${service === s ? "bg-foreground text-background border-foreground" : "border-border text-foreground/60 hover:border-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="05 — Budget (USD)">
                  <div className="flex flex-wrap gap-2 pt-3">
                    {BUDGETS.map((b) => (
                      <button type="button" key={b} onClick={() => setBudget(b)}
                        className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition ${budget === b ? "bg-foreground text-background border-foreground" : "border-border text-foreground/60 hover:border-foreground hover:text-foreground"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="06 — A few words about it">
                  <textarea required rows={4} placeholder="What you're working on, when you'd like to start, anything we should know." className="w-full bg-transparent border-0 border-b hairline focus:border-foreground outline-none py-3 text-base font-light placeholder:text-foreground/30 resize-none" />
                </Field>

                <div className="py-8 flex items-center justify-between border-b hairline">
                  <p className="text-xs text-muted-foreground">By sending you agree to our quiet privacy practice.</p>
                  <button type="submit" className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-60 transition">
                    send message <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Aside */}
          <aside className="md:col-span-4 space-y-10 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">direct</p>
              <a href="mailto:hello@studionilo.com" className="block text-lg hover:underline underline-offset-4">hello@studionilo.com</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">availability</p>
              <p className="text-foreground/70">Currently booking projects starting Q3 2026. Long-term retainers welcome.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">elsewhere</p>
              <a href="#" className="block hover:underline underline-offset-4">instagram</a>
              <a href="#" className="block hover:underline underline-offset-4 mt-1">are.na</a>
              <a href="#" className="block hover:underline underline-offset-4 mt-1">linkedin</a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-6 border-b hairline">
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
