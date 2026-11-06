const API_ORIGIN = (
  process.env.REACT_APP_API_ORIGIN || "http://localhost:5000"
).replace(/\/$/, "");

export const API_BASE = `${API_ORIGIN}/api`;
export const SOCKET_URL = API_ORIGIN;
