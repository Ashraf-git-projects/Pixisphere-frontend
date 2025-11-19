// src/api/api.js

const API_BASE =
  "https://pixisphere-frontend-murex.vercel.app/api/photographers";

// Get ALL photographers
export async function fetchPhotographers() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch photographers");
  return res.json();
}

// Get photographer by ID
export async function fetchPhotographerById(id) {
  const url = `${API_BASE}?id=${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch photographer");
  return res.json();
}
