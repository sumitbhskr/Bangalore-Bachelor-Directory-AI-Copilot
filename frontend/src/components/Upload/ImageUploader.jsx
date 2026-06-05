// src/components/Upload/ImageUploader.jsx
import React, { useState, useRef } from "react";

export default function ImageUploader({ onImagesSelected, maxFiles = 5 }) {
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, maxFiles);

    const newPreviews = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxFiles));
    onImagesSelected?.(valid);
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border2)"}`,
          borderRadius: "var(--radius)",
          padding: "28px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "var(--accent-dim)" : "var(--bg3)",
          transition: "all 0.2s",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
        <div style={{ color: "var(--text2)", fontSize: 14 }}>
          Drag & drop images here or{" "}
          <span style={{ color: "var(--accent)" }}>click to browse</span>
        </div>
        <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 4 }}>
          Max {maxFiles} images · JPG, PNG, WebP · Max 5MB each
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Previews */}
      {previews.length > 0 && (
        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}
        >
          {previews.map((p, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={p.url}
                alt={p.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
              <button
                onClick={() => removeImage(i)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--danger)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
