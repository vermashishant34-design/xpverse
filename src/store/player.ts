import { useSyncExternalStore } from "react";

export type Quest = { id: string; title: string; xp: number; coins: number; skill: keyof Skills; done: boolean; createdAt: number };
export type Skills = { intelligence: number; strength: number; discipline: number; creativity: number; charisma: number };
export type Achievement = { id: string; title: string; desc: string; rarity: "common" | "rare" | "epic" | "legendary"; unlocked: boolean };
export type ScreenTimeEntry = { id: string; app: string; minutes: number; productivity: number; date: string };
export type NotificationItem = { id: string; text: string; tone: "xp" | "level" | "quest" | "skill" | "info"; at: number };

export type Player = {
  email: string;
  displayName: string;
  avatar: string;
  charClass: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDay: string | null;
  skills: Skills;
  quests: Quest[];
  achievements: Achievement[];
  screenTime: ScreenTimeEntry[];
  notifications: NotificationItem[];
  created: boolean;
};

export const xpForLevel = (lvl: number) => 100 * lvl + (lvl - 1) * 50;

const USERS_KEY = "xpverse:users:v1";
const CURRENT_USER_KEY = "xpverse:currentUser:v1";

const todayKey = () => new Date().toISOString().slice(0, 10);

const createInitialPlayer = (email: string): Player => ({
  email,
  displayName: email.split('@')[0],
  avatar: "◉",
  charClass: "Hacker",
  level: 1,
  xp: 0,
  coins: 0,
  streak: 0,
  lastActiveDay: null,
  skills: { intelligence: 1, strength: 1, discipline: 1, creativity: 1, charisma: 1 },
  quests: [
    { id: "q1", title: "Read 20 pages", xp: 60, coins: 10, skill: "intelligence", done: false, createdAt: Date.now() },
    { id: "q2", title: "30 min workout", xp: 80, coins: 15, skill: "strength", done: false, createdAt: Date.now() },
    { id: "q3", title: "Deep work session", xp: 120, coins: 20, skill: "discipline", done: false, createdAt: Date.now() },
    { id: "q4", title: "Create something new", xp: 100, coins: 18, skill: "creativity", done: false, createdAt: Date.now() },
    { id: "q5", title: "Reach out to a friend", xp: 50, coins: 8, skill: "charisma", done: false, createdAt: Date.now() },
  ],
  achievements: [
    { id: "a1", title: "First Step", desc: "Complete your first quest", rarity: "common", unlocked: false },
    { id: "a2", title: "Rising Star", desc: "Reach level 5", rarity: "rare", unlocked: false },
    { id: "a3", title: "Mind Forged", desc: "Intelligence ≥ 10", rarity: "epic", unlocked: false },
    { id: "a4", title: "Ascendant", desc: "Reach level 20", rarity: "legendary", unlocked: false },
    { id: "a5", title: "Streak Keeper", desc: "Maintain a 7-day streak", rarity: "rare", unlocked: false },
  ],
  screenTime: [
    { id: "s1", app: "VS Code", minutes: 145, productivity: 95, date: todayKey() },
    { id: "s2", app: "Notion", minutes: 62, productivity: 80, date: todayKey() },
    { id: "s3", app: "Twitter", minutes: 48, productivity: 20, date: todayKey() },
    { id: "s4", app: "YouTube", minutes: 35, productivity: 35, date: todayKey() },
  ],
  notifications: [],
  created: false,
});

const initial: Player = createInitialPlayer("wanderer@example.com");

interface UserData {
  [email: string]: Player;
}

let users: UserData = (() => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const loadedUsers: UserData = raw ? JSON.parse(raw) : {};
    return loadedUsers;
  } catch { return {}; }
})();

let currentEmail: string | null = (() => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch { return null; }
})();

let state: Player = (() => {
  if (typeof window === "undefined") return initial;
  if (currentEmail && users[currentEmail]) {
    const user = users[currentEmail];
    // Ensure displayName exists
    if (!user.displayName) {
      user.displayName = user.email.split('@')[0];
    }
    return user;
  }
  return initial;
})();

const listeners = new Set<() => void>();

const saveUsers = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

const saveCurrentUser = () => {
  if (typeof window !== "undefined" && currentEmail) {
    localStorage.setItem(CURRENT_USER_KEY, currentEmail);
  }
};

const emit = () => {
  if (currentEmail) {
    users[currentEmail] = state;
    saveUsers();
  }
  listeners.forEach(l => l());
};

const pushNotif = (text: string, tone: NotificationItem["tone"]) => {
  const n: NotificationItem = { id: `n${Date.now()}-${Math.random()}`, text, tone, at: Date.now() };
  state = { ...state, notifications: [n, ...state.notifications].slice(0, 30) };
};

const updateStreak = () => {
  const today = todayKey();
  if (state.lastActiveDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = state.lastActiveDay === yesterday ? state.streak + 1 : 1;
  state = { ...state, streak, lastActiveDay: today };
};

export const playerStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  get() { return state; },
  set(p: Partial<Player>) { state = { ...state, ...p }; emit(); },
  isEmailUnique(email: string): boolean {
    return !users[email.trim().toLowerCase()];
  },
  getAllEmails(): string[] {
    return Object.keys(users);
  },
  getUser(email: string): Player | undefined {
    return users[email.trim().toLowerCase()];
  },
  switchUser(email: string): boolean {
    const trimmedEmail = email.trim().toLowerCase();
    if (!users[trimmedEmail]) return false;
    currentEmail = trimmedEmail;
    state = users[trimmedEmail];
    saveCurrentUser();
    emit();
    return true;
  },
  createUser(email: string): boolean {
    const trimmedEmail = email.trim().toLowerCase();
    if (users[trimmedEmail]) return false;
    currentEmail = trimmedEmail;
    state = createInitialPlayer(trimmedEmail);
    users[trimmedEmail] = state;
    saveUsers();
    saveCurrentUser();
    emit();
    return true;
  },
  logout() {
    currentEmail = null;
    state = initial;
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    emit();
  },
  completeQuest(id: string): { leveledUp: boolean; xpGained: number; skillGained: keyof Skills | null } {
    const q = state.quests.find(x => x.id === id);
    if (!q || q.done) return { leveledUp: false, xpGained: 0, skillGained: null };
    let xp = state.xp + q.xp;
    let level = state.level;
    let leveled = false;
    while (xp >= xpForLevel(level)) { xp -= xpForLevel(level); level++; leveled = true; }
    const skillBoost = Math.max(1, Math.round(q.xp / 30));
    const skills = { ...state.skills, [q.skill]: state.skills[q.skill] + skillBoost };
    const quests = state.quests.map(x => x.id === id ? { ...x, done: true } : x);
    state = { ...state, xp, level, coins: state.coins + q.coins, skills, quests };
    updateStreak();
    const achievements = state.achievements.map(a => {
      if (a.unlocked) return a;
      if (a.id === "a1") return { ...a, unlocked: true };
      if (a.id === "a2" && state.level >= 5) return { ...a, unlocked: true };
      if (a.id === "a3" && state.skills.intelligence >= 10) return { ...a, unlocked: true };
      if (a.id === "a4" && state.level >= 20) return { ...a, unlocked: true };
      if (a.id === "a5" && state.streak >= 7) return { ...a, unlocked: true };
      return a;
    });
    state = { ...state, achievements };
    pushNotif(`+${q.xp} XP — ${q.title}`, "xp");
    pushNotif(`${q.skill} +${skillBoost}`, "skill");
    if (leveled) pushNotif(`Level Up → Lv ${level}`, "level");
    emit();
    return { leveledUp: leveled, xpGained: q.xp, skillGained: q.skill };
  },
  addQuest(title: string, skill: keyof Skills, xp = 70, coins = 12) {
    const q: Quest = { id: `q${Date.now()}`, title, xp, coins, skill, done: false, createdAt: Date.now() };
    state = { ...state, quests: [q, ...state.quests] };
    pushNotif(`New quest: ${title}`, "quest");
    emit();
  },
  deleteQuest(id: string) {
    state = { ...state, quests: state.quests.filter(q => q.id !== id) };
    emit();
  },
  logScreenTime(app: string, minutes: number, productivity: number) {
    const entry: ScreenTimeEntry = { id: `s${Date.now()}`, app, minutes, productivity, date: todayKey() };
    state = { ...state, screenTime: [entry, ...state.screenTime].slice(0, 20) };
    pushNotif(`Logged ${minutes}m on ${app}`, "info");
    emit();
  },
  removeScreenTime(id: string) {
    state = { ...state, screenTime: state.screenTime.filter(s => s.id !== id) };
    emit();
  },
  clearNotifications() { state = { ...state, notifications: [] }; emit(); },
  reset() {
    if (currentEmail) {
      state = createInitialPlayer(currentEmail);
      state.created = true;
      users[currentEmail] = state;
      saveUsers();
      emit();
    }
  },
};

const serverSnap = () => initial;
export function usePlayer() {
  return useSyncExternalStore(playerStore.subscribe, playerStore.get, serverSnap);
}
