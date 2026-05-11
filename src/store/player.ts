import { useSyncExternalStore } from "react";

export type Quest = { id: string; title: string; xp: number; coins: number; skill: keyof Skills; done: boolean };
export type Skills = { intelligence: number; strength: number; discipline: number; creativity: number; charisma: number };
export type Achievement = { id: string; title: string; desc: string; rarity: "common" | "rare" | "epic" | "legendary"; unlocked: boolean };

export type Player = {
  username: string;
  avatar: string;
  charClass: string;
  level: number;
  xp: number;
  coins: number;
  skills: Skills;
  quests: Quest[];
  achievements: Achievement[];
  created: boolean;
};

export const xpForLevel = (lvl: number) => 100 * lvl + (lvl - 1) * 50;

const KEY = "xpverse:player:v1";

const initial: Player = {
  username: "Wanderer",
  avatar: "◉",
  charClass: "Hacker",
  level: 1,
  xp: 0,
  coins: 0,
  skills: { intelligence: 1, strength: 1, discipline: 1, creativity: 1, charisma: 1 },
  quests: [
    { id: "q1", title: "Read 20 pages", xp: 60, coins: 10, skill: "intelligence", done: false },
    { id: "q2", title: "30 min workout", xp: 80, coins: 15, skill: "strength", done: false },
    { id: "q3", title: "Deep work session", xp: 120, coins: 20, skill: "discipline", done: false },
    { id: "q4", title: "Create something new", xp: 100, coins: 18, skill: "creativity", done: false },
    { id: "q5", title: "Reach out to a friend", xp: 50, coins: 8, skill: "charisma", done: false },
  ],
  achievements: [
    { id: "a1", title: "First Step", desc: "Complete your first quest", rarity: "common", unlocked: false },
    { id: "a2", title: "Rising Star", desc: "Reach level 5", rarity: "rare", unlocked: false },
    { id: "a3", title: "Mind Forged", desc: "Intelligence ≥ 10", rarity: "epic", unlocked: false },
    { id: "a4", title: "Ascendant", desc: "Reach level 20", rarity: "legendary", unlocked: false },
  ],
};

let state: Player = (() => {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch { return initial; }
})();

const listeners = new Set<() => void>();
const emit = () => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach(l => l());
};

export const playerStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  get() { return state; },
  set(p: Partial<Player>) { state = { ...state, ...p }; emit(); },
  completeQuest(id: string): { leveledUp: boolean; xpGained: number } {
    const q = state.quests.find(x => x.id === id);
    if (!q || q.done) return { leveledUp: false, xpGained: 0 };
    let xp = state.xp + q.xp;
    let level = state.level;
    let leveled = false;
    while (xp >= xpForLevel(level)) { xp -= xpForLevel(level); level++; leveled = true; }
    const skills = { ...state.skills, [q.skill]: state.skills[q.skill] + 1 };
    const quests = state.quests.map(x => x.id === id ? { ...x, done: true } : x);
    const achievements = state.achievements.map(a => {
      if (a.unlocked) return a;
      if (a.id === "a1") return { ...a, unlocked: true };
      if (a.id === "a2" && level >= 5) return { ...a, unlocked: true };
      if (a.id === "a3" && skills.intelligence >= 10) return { ...a, unlocked: true };
      if (a.id === "a4" && level >= 20) return { ...a, unlocked: true };
      return a;
    });
    state = { ...state, xp, level, coins: state.coins + q.coins, skills, quests, achievements };
    emit();
    return { leveledUp: leveled, xpGained: q.xp };
  },
  addQuest(title: string, skill: keyof Skills) {
    const q: Quest = { id: `q${Date.now()}`, title, xp: 70, coins: 12, skill, done: false };
    state = { ...state, quests: [q, ...state.quests] };
    emit();
  },
  reset() { state = initial; emit(); },
};

const serverSnap = () => initial;
export function usePlayer() {
  return useSyncExternalStore(playerStore.subscribe, playerStore.get, serverSnap);
}
