import mongoose, { Schema, Document } from "mongoose";

export interface IQuest {
  id: string;
  text: string;
  done: boolean;
  xp: number;
}

export interface ISkill {
  INT: number;
  STR: number;
  DIS: number;
  CRE: number;
  CHA: number;
}

export interface IAchievement {
  id: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface IUser extends Document {
  username: string;
  email?: string;
  password?: string;
  xp: number;
  level: number;
  class: string;
  avatar: string;
  streak: number;
  lastActive: Date;
  quests: IQuest[];
  achievements: IAchievement[];
  skill: ISkill;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestSchema = new Schema<IQuest>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  xp: { type: Number, default: 50 },
});

const SkillSchema = new Schema<ISkill>({
  INT: { type: Number, default: 1 },
  STR: { type: Number, default: 1 },
  DIS: { type: Number, default: 1 },
  CRE: { type: Number, default: 1 },
  CHA: { type: Number, default: 1 },
});

const AchievementSchema = new Schema<IAchievement>({
  id: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  class: { type: String, default: "Hacker" },
  avatar: { type: String, default: "👨‍💻" },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  quests: { type: [QuestSchema], default: [] },
  achievements: { type: [AchievementSchema], default: [] },
  skill: { type: SkillSchema, default: { INT: 1, STR: 1, DIS: 1, CRE: 1, CHA: 1 } },
  refreshTokens: { type: [String], default: [] },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
