import User from "./User";

let indexesReady = false;

/** Fix legacy Atlas indexes (e.g. unique username) that block new email signups. */
export async function ensureUserIndexes() {
  if (indexesReady) return;

  const collection = User.collection;
  const indexes = await collection.indexes();

  for (const index of indexes) {
    const name = index.name;
    if (!name || name === "_id_") continue;

    const keys = index.key ?? {};
    const isUsernameIndex = "username" in keys;
    const isLegacyEmailIndex = "email" in keys && !index.sparse;

    if (isUsernameIndex || isLegacyEmailIndex) {
      try {
        await collection.dropIndex(name);
        console.log(`Dropped legacy index: ${name}`);
      } catch (err) {
        console.warn(`Could not drop index ${name}:`, err);
      }
    }
  }

  await collection.createIndex({ email: 1 }, { unique: true, sparse: true, name: "email_1_sparse_unique" });

  indexesReady = true;
}
