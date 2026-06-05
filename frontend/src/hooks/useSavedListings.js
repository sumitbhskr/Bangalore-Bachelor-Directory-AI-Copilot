// src/hooks/useSavedListings.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useApp } from "../context/AppContext";

export default function useSavedListings() {
  const { token, user } = useApp();
  const [savedIds, setSavedIds] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.savedListings) setSavedIds(user.savedListings.map(String));
  }, [user]);

  const fetchSaved = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const data = await api.get("/auth/me", token).catch(() => ({}));
    if (data.success) {
      setSavedIds((data.user.savedListings || []).map(String));
      setSavedList(data.user.savedListings || []);
    }
    setLoading(false);
  }, [token]);

  const toggleSave = useCallback(
    async (listingId) => {
      if (!token) return false;
      const data = await api
        .put(`/listings/${listingId}/save`, {}, token)
        .catch(() => ({}));
      if (data.success) {
        setSavedIds((prev) =>
          data.saved
            ? [...prev, String(listingId)]
            : prev.filter((id) => id !== String(listingId)),
        );
        return data.saved;
      }
      return null;
    },
    [token],
  );

  const isSaved = useCallback(
    (listingId) => savedIds.includes(String(listingId)),
    [savedIds],
  );

  return { savedIds, savedList, loading, fetchSaved, toggleSave, isSaved };
}
