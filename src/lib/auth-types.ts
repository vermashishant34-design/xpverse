export type AuthResponse = {
  user: { id: string; email: string; displayName?: string };
  accessToken: string;
  refreshToken: string;
};

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isAuthResponse(data: unknown): data is AuthResponse {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const user = d.user;
  if (!user || typeof user !== "object") return false;
  const u = user as Record<string, unknown>;
  return (
    typeof d.accessToken === "string" &&
    d.accessToken.length > 10 &&
    typeof d.refreshToken === "string" &&
    d.refreshToken.length > 10 &&
    typeof u.email === "string" &&
    u.email.includes("@")
  );
}
