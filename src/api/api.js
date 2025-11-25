import data from "../../db.json"; // path adjust if needed

export async function fetchPhotographers() {
  return data.photographers || [];
}

export async function fetchPhotographerById(id) {
  return (data.photographers || []).find((p) => String(p.id) === String(id));
}
