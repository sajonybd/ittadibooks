import {connectDb} from "@/lib/connectDb";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = await connectDb();
    const collections = await db
      .collection("bookCollections")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(collections);
  } catch (err) {
    // // // console.error("Error fetching collections:", err);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
}
