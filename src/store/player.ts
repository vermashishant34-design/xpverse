import { useEffect, useSyncExternalStore } from "react";
import { initialQuests, initialAchievements, type Quest, type Achievement, type Skill, xpForLevel } from "@/lib/game-data";

export type Player = {
  username: string;
  avatar: string;
  charClass: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  skills: Record<Skill, number>;
  quests: Quest[];
  achievements: Achievement[];
};

const KEY = "xpverse:player";

const defaultPlayer: Player = {
  username: "Hero",
  avatar: "🦊",
  charClass: "developer",
  level: 7,
  xp: 320,
  coins: 1240,
  streak: 12,
  skills: { Intelligence: 8, Strength: 4, Wisdom: 5, Charisma: 3, Discipline: 6 },
  quests: initialQuests,
  achievements: initialAchievements,
};

let state: Player = load();
const listeners = new Set<() => void>();

function load(): Player {
  if (typeof window === "undefined") return defaultPlayer;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultPlayer, ...JSON.parse(raw) };
  } catch {}
  return defaultPlayer;
}
function save() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
}
function emit() { listeners.forEach((l) => l()); }

export function setPlayer(updater: (p: Player) => Player) {
  state = updater(state);
  save();
  emit();
}

export function usePlayer(): Player {
  const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
  // SSR-safe
  return useSyncExternalStore(subscribe, () => state, () => defaultPlayer);
}

export function useHydratePlayer() {
  useEffect(() => { state = load(); emit(); }, []);
}

export function addXP(amount: number): { leveledUp: boolean; newLevel: number } {
  let leveledUp = false;
  let newLevel = state.level;
  setPlayer((p) => {
    let xp = p.xp + amount;
    let level = p.level;
    while (xp >= xpForLevel(level)) {
      xp -= xpForLevel(level);
      level += 1;
      leveledUp = true;
    }
    newLevel = level;
    return { ...p, xp, level, coins: p.coins + Math.floor(amount / 4) };
  });
  return { leveledUp, newLevel };
}

export function completeQuest(id: string) {
  const quest = state.quests.find((q) => q.id === id);
  if (!quest || quest.completed) return null;
  setPlayer((p) => ({
    ...p,
    quests: p.quests.map((q) => (q.id === id ? { ...q, completed: true } : q)),
    skills: { ...p.skills, [quest.skill]: p.skills[quest.skill] + 1 },
  }));
  return addXP(quest.xp);
}

export function addQuest(q: Omit<Quest, "id" | "completed">) {
  setPlayer((p) => ({
    ...p,
    quests: [{ ...q, id: `q${Date.now()}`, completed: false }, ...p.quests],
  }));
}

export function deleteQuest(id: string) {
  setPlayer((p) => ({ ...p, quests: p.quests.filter((q) => q.id !== id) }));
}
