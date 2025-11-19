import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // json-server port from the assignment
  timeout: 5000,
});

export const fetchPhotographers = (params = {}) =>
  API.get("/photographers", { params }).then((res) => res.data);

export const fetchPhotographerById = (id) =>
  API.get(`/photographers/${id}`).then((res) => res.data);
