import { put } from "@vercel/blob";

const S = (v, n) => String(v ?? "").trim().slice(0, n);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const b = req.body || {};
  const sub = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 10),
    ts: Date.now(),
    firstName: S(b.firstName, 100),
    lastName: S(b.lastName, 100),
    phone: S(b.phone, 40),
    email: S(b.email, 120),
    service: S(b.service, 120),
    details: S(b.details, 3000),
    source: S(b.source, 120)
  };
  if (!sub.firstName && !sub.lastName && !sub.phone && !sub.email) {
    return res.status(400).json({ error: "empty submission" });
  }

  await put("quotes/" + sub.id + ".json", JSON.stringify(sub), {
    access: "public",
    contentType: "application/json"
  });
  return res.status(200).json({ ok: true });
}
