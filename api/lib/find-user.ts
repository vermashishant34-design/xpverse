import User from "./User";

export function normalizeLoginId(value: string): string {
  return value.trim().toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function findUserByLoginId(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!id) return null;

  if (id.includes("@")) {
    const byEmail = await User.findOne({ email: id });
    if (byEmail) return byEmail;
  }

  const byLegacyUsername = await User.findOne({
    username: { $regex: new RegExp(`^\\s*${escapeRegex(id)}\\s*$`, "i") },
  });
  if (byLegacyUsername) return byLegacyUsername;

  return User.findOne({ email: id });
}

export function getAccountEmail(user: { email?: string; username?: string }): string {
  if (user.email) return user.email;
  if (user.username) return normalizeLoginId(user.username);
  return "";
}
