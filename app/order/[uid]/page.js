"use client";

import { useState } from "react";

export default function OrderPage({ params }) {
  const { uid } = params;

  // mock images for UI preview
  const [images] = useState([
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400/000000",
  ]);

  const [engraver, setEngraver] = useState("");

  return (
    <main style={styles.wrapper}>
      <h2 style={styles.title}>Order #{uid}</h2>

      <div style={styles.grid}>
        {images.map((img, i) => (
          <div key={i} style={styles.card}>
            <img src={img} style={styles.image} />

            <button style={styles.download}>Download Image</button>

            <select
              style={styles.select}
              value={engraver}
              onChange={(e) => setEngraver(e.target.value)}
            >
              <option value="">Select Engraver</option>
              <option>Sreerag</option>
              <option>Arjun</option>
              <option>Nikhil</option>
            </select>

            <div style={styles.actions}>
              <button style={styles.start}>Start Engraving</button>
              <button style={styles.finish}>Finish Engraving</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  wrapper: {
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
  },

  title: {
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  image: {
    width: "100%",
    borderRadius: 10,
  },

  download: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    borderRadius: 8,
  },

  select: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  actions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  start: {
    flex: 1,
    padding: 10,
    background: "#2ecc71",
    color: "#fff",
    borderRadius: 8,
  },

  finish: {
    flex: 1,
    padding: 10,
    background: "#e74c3c",
    color: "#fff",
    borderRadius: 8,
  },
};
