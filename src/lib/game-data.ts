export type Rank = "Beginner" | "Apprentice" | "Elite" | "Legend";

export const xpForLevel = (level: number) => 100 * level + (level - 1) * 50;

export const rankForLevel = (level: number): Rank => {
  if (level >= 30) return "Legend";
  if (level >= 15) return "Elite";
  if (level >= 5) return "Apprentice";
  return "Beginner";
};

export type Skill = "Intelligence" | "Strength" | "Wisdom" | "Charisma" | "Discipline";

export type Quest = {
  id: string;
  title: string;
  description?: string;
  xp: number;
  skill: Skill;
  completed: boolean;
  difficulty: "Easy" | "Medium" | "Hard" | "Epic";
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export const initialQuests: Quest[] = [
  { id: "q1", title: "Master React Hooks", description: "Complete an advanced hooks tutorial", xp: 80, skill: "Intelligence", completed: false, difficulty: "Medium" },
  { id: "q2", title: "30 minute focus session", description: "Run a Pomodoro without distractions", xp: 40, skill: "Discipline", completed: true, difficulty: "Easy" },
  { id: "q3", title: "Ship a side-project feature", xp: 150, skill: "Intelligence", completed: false, difficulty: "Hard" },
  { id: "q4", title: "Read 20 pages", xp: 35, skill: "Wisdom", completed: false, difficulty: "Easy" },
  { id: "q5", title: "Workout: 100 push-ups", xp: 60, skill: "Strength", completed: false, difficulty: "Medium" },
  { id: "q6", title: "Network with 1 new dev", xp: 50, skill: "Charisma", completed: false, difficulty: "Easy" },
];

export const initialAchievements: Achievement[] = [
  { id: "a1", name: "Night Owl", description: "Complete a quest after midnight", icon: "🌙", unlocked: true },
  { id: "a2", name: "Consistency King", description: "7-day streak", icon: "👑", unlocked: true },
  { id: "a3", name: "Java Warrior", description: "Complete 10 coding quests", icon: "⚔️", unlocked: false },
  { id: "a4", name: "Focus Master", description: "10 Pomodoro sessions", icon: "🎯", unlocked: false },
  { id: "a5", name: "Iron Will", description: "30-day streak", icon: "🛡️", unlocked: false },
  { id: "a6", name: "Polymath", description: "Level all skills to 5", icon: "🧠", unlocked: false },
];

export const leaderboard = [
  { rank: 1, name: "NeoSamurai", level: 42, xp: 18420, streak: 64, class: "Hacker" },
  { rank: 2, name: "Pixel_Mage", level: 38, xp: 16210, streak: 51, class: "Developer" },
  { rank: 3, name: "ZenWolf", level: 35, xp: 14990, streak: 87, class: "Monk" },
  { rank: 4, name: "VoltKnight", level: 32, xp: 13540, streak: 28, class: "Warrior" },
  { rank: 5, name: "GhostCEO", level: 30, xp: 12880, streak: 44, class: "Entrepreneur" },
  { rank: 6, name: "CodeRonin", level: 27, xp: 11200, streak: 19, class: "Hacker" },
  { rank: 7, name: "AstralFox", level: 24, xp: 9800, streak: 33, class: "Developer" },
  { rank: 8, name: "ShadowSage", level: 22, xp: 8650, streak: 12, class: "Monk" },
];

export const characterClasses = [
  { id: "hacker", name: "Hacker", icon: "💻", color: "neon-cyan", description: "Bend systems to your will. +XP on tech quests." },
  { id: "warrior", name: "Warrior", icon: "⚔️", color: "neon-pink", description: "Forge an unbreakable body. +XP on Strength." },
  { id: "developer", name: "Developer", icon: "🛠️", color: "neon-blue", description: "Build the future. +XP on Intelligence." },
  { id: "monk", name: "Monk", icon: "🧘", color: "neon-green", description: "Master the inner world. +XP on Discipline." },
  { id: "entrepreneur", name: "Entrepreneur", icon: "🚀", color: "neon-purple", description: "Lead and create value. +XP on Charisma." },
];
