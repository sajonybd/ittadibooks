import { MongoClient } from "mongodb";

const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URI || process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "ittadi-books";
const oldCloud = process.env.OLD_CLOUDINARY_CLOUD_NAME;
const newCloud = process.env.NEW_CLOUDINARY_CLOUD_NAME;
const dryRun = process.env.DRY_RUN === "1";

if (!mongoUri || !oldCloud || !newCloud) {
  console.error("Missing env vars");
  process.exit(1);
}

const oldHost = `res.cloudinary.com/${oldCloud}/`;
const newHost = `res.cloudinary.com/${newCloud}/`;

function replaceInValue(value) {
  if (typeof value === "string") {
    return value.includes(oldHost) ? value.replaceAll(oldHost, newHost) : value;
  }
  if (Array.isArray(value)) {
    return value.map(replaceInValue);
  }
  if (
    value &&
    typeof value === "object" &&
    value.constructor === Object &&
    !value._bsontype
  ) {
    const updated = {};
    for (const [key, v] of Object.entries(value)) {
      updated[key] = replaceInValue(v);
    }
    return updated;
  }
  return value;
}

function hasCloudinaryString(value) {
  if (typeof value === "string") return value.includes(oldHost);
  if (Array.isArray(value)) return value.some(hasCloudinaryString);
  if (value && typeof value === "object") {
    return Object.values(value).some(hasCloudinaryString);
  }
  return false;
}

async function main() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);

  const collections = await db.listCollections().toArray();
  let touched = 0;

  for (const colInfo of collections) {
    const col = db.collection(colInfo.name);
    const cursor = col.find({});

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc || !hasCloudinaryString(doc)) continue;

      const updatedDoc = replaceInValue(doc);
      if (!dryRun) {
        await col.replaceOne({ _id: doc._id }, updatedDoc);
      }
      touched += 1;
    }
  }

  await client.close();
  console.log(`Done. Updated docs: ${touched}. DryRun: ${dryRun}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
