// src/api/api.js

// Raw GitHub URL for db.json (read-only API)
const RAW_DB_URL =
  "https://raw.githubusercontent.com/Ashraf-git-projects/Pixisphere-frontend/refs/heads/main/db.json";

// Fetch the entire JSON file
async function fetchDB() {
  const response = await fetch(RAW_DB_URL, {
    headers: { "Cache-Control": "no-cache" },
  });

  if (!response.ok) {
    throw new Error("Failed to load data from GitHub");
  }

  return response.json();
}

// Get ALL photographers
export async function fetchPhotographers(params = {}) {
  const db = await fetchDB();
  let items = db.photographers || [];

  // If someone passes params (like ?location=), this keeps compatibility
  if (params.q) {
    const q = params.q.toLowerCase();
    items = items.filter((p) =>
      (p.name + p.bio + p.location + p.tags?.join(" ") + p.styles?.join(" "))
        .toLowerCase()
        .includes(q)
    );
  }

  return items;
}

// Get photographer by ID
export async function fetchPhotographerById(id) {
  const db = await fetchDB();
  return db.photographers?.find((p) => String(p.id) === String(id)) || null;
}
