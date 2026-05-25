import mongoose from "mongoose";
import { ensureUserIndexes } from "./indexes";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    setupPromise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseCache ?? { conn: null, setupPromise: null };
global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.setupPromise) {
    cached.setupPromise = (async () => {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 1,
      });
      await ensureUserIndexes();
      cached.conn = conn;
      return conn;
    })().catch((err) => {
      cached.setupPromise = null;
      cached.conn = null;
      throw err;
    });
  }

  return cached.setupPromise;
}
