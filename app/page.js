"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>What The Frame</h1>
      <p style={styles.subtitle}>
        Turn your photos into beautiful engraving-ready artwork
      </p>

      <label style={styles.uploadBox}>
        Upload an image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </label>

      {image && (
        <div style={styles.previewBox}>
          <p style={styles.previewText}>Preview</p>
          <img src={image} alt="Preview" style={styles.image} />
        </div>
      )}
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: "#f7f7f7",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    fontSize: "48px",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "40px",
    textAlign: "center",
    maxWidth: "500px",
  },
  uploadBox: {
    padding: "14px 28px",
    borderRadius: "8px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "30px",
  },
  previewBox: {
    marginTop: "20px",
    textAlign: "center",
  },
  previewText: {
    marginBottom: "10px",
    fontWeight: "500",
  },
  image: {
    maxWidth: "320px",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
};
