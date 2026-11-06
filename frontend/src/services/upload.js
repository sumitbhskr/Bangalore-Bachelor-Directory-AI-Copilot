// frontend/src/services/upload.js
import { API_BASE } from "../config";

// Upload images via backend (which sends to Cloudinary)
export const uploadImages = async (files, token) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_BASE}/listings/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};

// Upload verification documents
export const uploadDocuments = async (listingId, files, docTypes, token) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("documents", file));
  docTypes.forEach((type) => formData.append("docTypes", type));

  const res = await fetch(`${API_BASE}/verification/${listingId}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};
