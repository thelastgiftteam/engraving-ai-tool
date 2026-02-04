"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);

  return (
    <>
      <h1>New Enquiry</h1>
      <p>Create mockups to share with the customer</p>

      <div style={styles.card}>
        <label>Customer Name</label>
        <input placeholder="Enter customer name" style={styles.input} />

        <label>Upload Image</label>
        <input
          type="file"
          onChange={(e) =>
            setImage(URL.createObjectURL(e.target.files[0]))
          }
        />

        {image && <img src={image} style={styles.preview} />}

        <label>Select Style</label>
        <div>
          <label><input type="radio" /> Ghibli Style</label><br />
          <label><input type="radio" /> Outline (Engraving)</label><br />
          <label><input type="radio" /> Romantic</label>
        </div>

        <button style={styles.button}>Generate Mockups</button>

        <p style={styles.note}>
          Mockups will appear here (UI only)
        </p>
      </div>
    </>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "500px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
  },
  preview: {
    width: "200px",
    margin: "12px 0",
    borderRadius: "8px",
  },
  button: {
    marginTop: "16px",
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
  note: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#666",
  },
};
