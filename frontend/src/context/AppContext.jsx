// src/context/AppContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../services/api";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("bbd_token"));
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showAuth, setShowAuth] = useState(null); // 'login' | 'register'

  // ── Restore session ──────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    api
      .get("/auth/me", token)
      .then((data) => {
        if (data.success) setUser(data.user);
        else {
          setToken(null);
          localStorage.removeItem("bbd_token");
        }
      })
      .catch(() => {});
  }, [token]);

  // ── Toast ────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Auth actions ─────────────────────────────────────────
  const login = useCallback(
    async (email, password) => {
      const data = await api.post("/auth/login", { email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("bbd_token", data.token);
        setShowAuth(null);
        showToast(`Welcome back, ${data.user.name}!`);
        return true;
      }
      showToast(data.message || "Login failed", "error");
      return false;
    },
    [showToast],
  );

  const register = useCallback(
    async (formData) => {
      const data = await api.post("/auth/register", formData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("bbd_token", data.token);
        setShowAuth(null);
        showToast(
          `Welcome to Bangalore Bachelor Directory, ${data.user.name}!`,
        );
        return true;
      }
      showToast(data.message || "Registration failed", "error");
      return false;
    },
    [showToast],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("bbd_token");
    setPage("home");
    showToast("Logged out successfully");
  }, [showToast]);

  // ── Navigation ───────────────────────────────────────────
  const navigate = useCallback((pg, listing = null) => {
    setPage(pg);
    if (listing) setSelectedListing(listing);
    window.scrollTo(0, 0);
  }, []);

  return (
    <AppCtx.Provider
      value={{
        user,
        token,
        showAuth,
        setShowAuth,
        login,
        register,
        logout,
        showToast,
        page,
        navigate,
        selectedListing,
      }}
    >
      {children}

      {/* Global Toast */}
      {toast && (
        <div className={`toast ${toast.type} fade-in`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
