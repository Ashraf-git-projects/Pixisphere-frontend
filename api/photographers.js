// api/photographers.js

export default async function handler(req, res) {
  try {
    const RAW_URL =
      "https://raw.githubusercontent.com/Ashraf-git-projects/Pixisphere-frontend/refs/heads/main/db.json";

    // use global fetch (available on Vercel Node runtimes)
    const response = await fetch(RAW_URL);

    if (!response.ok) {
      console.error("Raw fetch failed:", response.status, response.statusText);
      return res.status(502).json({ error: "Failed to fetch DB from GitHub", status: response.status });
    }

    const db = await response.json();
    const data = Array.isArray(db.photographers) ? db.photographers : [];

    const { id } = req.query || {};
    if (id) {
      const item = data.find((p) => String(p.id) === String(id));
      return res.status(200).json(item || null);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error && (error.stack || error.message || error));
    return res.status(500).json({ error: "Server error" });
  }
}
