


import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI;

if (!uri) {
  // Fail fast with a clear server log instead of returning confusing 500s.
  throw new Error(
    "Missing MongoDB connection string. Set MONGODB_URI (recommended) or NEXT_PUBLIC_MONGODB_URI."
  );
}

const dbNameFromUri = (() => {
  try {
    const pathname = new URL(uri).pathname || "";
    return pathname.replace("/", "");
  } catch {
    return "";
  }
})();
const dbName =
  process.env.MONGODB_DB_NAME ||
  process.env.NEXT_PUBLIC_MONGODB_DB_NAME ||
  dbNameFromUri ||
  "ittadibooks";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export const connectDb = async () => {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
};
