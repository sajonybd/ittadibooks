import { connectDb } from "@/lib/connectDb";

let authorsCache = null;
let categoriesCache = null;
let lastFetched = 0;

const CACHE_TTL = 5 * 60 * 1000;

async function refreshCacheIfNeeded(forceRefresh = false) {
  const now = Date.now();

  if (
    forceRefresh ||
    !authorsCache ||
    !categoriesCache ||
    now - lastFetched > CACHE_TTL
  ) {
    const db = await connectDb();

    const [authors, categories] = await Promise.all([
      db
        .collection("authors")
        .find({}, { projection: { _id: 0, name: 1, nameBn: 1 } })
        .sort({ nameBn: 1 })
        .toArray(),
      db
        .collection("categories")
        .find({}, { projection: { _id: 0, bn: 1, en: 1, slug: 1 } })
        .sort({ bn: 1 })
        .toArray(),
    ]);

    authorsCache = JSON.parse(JSON.stringify(authors));
    categoriesCache = JSON.parse(JSON.stringify(categories));
    lastFetched = now;
  }
}

export async function getNavbarAuthors(forceRefresh = false) {
  await refreshCacheIfNeeded(forceRefresh);
  return authorsCache;
}

export async function getCategories(forceRefresh = false) {
  await refreshCacheIfNeeded(forceRefresh);
  return categoriesCache;
}
