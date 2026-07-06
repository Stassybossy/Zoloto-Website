import { list } from "@vercel/blob";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "x-api-key");
  if (req.method === "OPTIONS") return res.status(200).end();

  if ((req.headers["x-api-key"] || "") !== process.env.CRM_SYNC_KEY || !process.env.CRM_SYNC_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const { blobs } = await list({ prefix: "quotes/", limit: 1000 });
  const subs = await Promise.all(
    blobs.map(async (b) => {
      try { return await (await fetch(b.url)).json(); } catch { return null; }
    })
  );
  const clean = subs.filter(Boolean).sort((a, b) => (a.ts || 0) - (b.ts || 0));
  return res.status(200).json(clean);
}
