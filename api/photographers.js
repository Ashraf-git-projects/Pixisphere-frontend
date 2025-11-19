import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const RAW_URL =
      "https://raw.githubusercontent.com/Ashraf-git-projects/Pixisphere-frontend/refs/heads/main/db.json";

    const response = await fetch(RAW_URL);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to load DB" });
    }

    const db = await response.json();
    const data = db.photographers || [];

    // If /api/photographers?id=3
    if (req.query?.id) {
      const item = data.find(
        (p) => String(p.id) === String(req.query.id)
      );
      return res.status(200).json(item || null);
    }

    // Return full list
    return res.status(200).json(data);
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}
