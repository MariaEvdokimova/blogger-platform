import { blacklistCollection } from "./mongo.db";

export async function initIndexes() {
  await blacklistCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 8 } // 8 дней
  );
}
