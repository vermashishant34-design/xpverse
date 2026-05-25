import type { VercelRequest, VercelResponse } from "@vercel/node";
import { logoutUser } from "../../server/lib/auth-service";
import { runAuthHandler } from "../../server/lib/api-handler";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return runAuthHandler(req, res, async () => logoutUser());
}
