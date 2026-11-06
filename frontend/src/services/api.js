// frontend/src/services/api.js
import { API_BASE } from "../config";

const api = {
  get: async (path, token) => {
    const res = await fetch(API_BASE + path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.json();
  },

  post: async (path, body, token) => {
    const res = await fetch(API_BASE + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  put: async (path, body, token) => {
    const res = await fetch(API_BASE + path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  delete: async (path, token) => {
    const res = await fetch(API_BASE + path, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default api;
