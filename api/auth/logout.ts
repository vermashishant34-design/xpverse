import type { VercelRequest, VercelResponse } from "@vercel/node";
import { logoutUser } from "../lib/auth-service";
import { runAuthHandler } from "../lib/handler";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return runAuthHandler(req, res, async () => logoutUser());
}
