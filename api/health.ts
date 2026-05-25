import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    ok: true,
    mongoConfigured: Boolean(process.env.MONGODB_URI),
    jwtConfigured: Boolean(process.env.JWT_SECRET && process.env.JWT_REFRESH_SECRET),
  });
}
