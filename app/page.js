"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [style, setStyle] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
  }

  function handleGenerate() {
    if (!image || !style) {
      alert("Please upload an image and select a style.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>What The Frame</h1>
      <p style={styles.subtitle}>
        Create engraving-ready artwork from your memories
      </p>

      {/* Upload */}
      <label style={styles.uploadBox}>
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </label>

      {/* Preview */}
      {image && (
        <img src={image} alt="Preview" style={styles.image} />
      )}

      {/* Style Selection */}
      <div style={styles.section}>
        <h3>Select Style</h3>

        <label style={styles.radio}>
          <input
            type="radio"
            name="style"
            value="ghibli"
            onChange={(e) => setStyle(e.target.value)}
          />
          Ghibli-style Illustration
        </label>

        <label style={styles.radio}>
          <input
            type="radio"
            name="style"
            value="outline"
            onChange={(e) => setStyle(e.target.value)}
          />
          Clean Outline (Engraving Ready)
        </label>

        <label style={styles.radio}>
          <input
            type="radio"
            name="style"
            value="romantic"
            onChange={(e) => setStyle(e.target.value)}
          />
          Romantic Soft Portrait
        </label>
      </div>

      {/* Text Input */}
      <div style={styles.section}>
        <h3>Text on Frame (Optional)</h3>
        <input
          type="text"
          placeholder="Eg: Forever in our hearts"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.textInput}
        />
      </div>

      {/* Generate */}
      <button style={styles.button} onClick={handleGenerate}>
        Generate Preview
      </button>

      {/* Confirmation */}
      {submitted && (
        <div style={styles.confirmBox}>
          <h3>Details Collected ✅</h3>
          <p><strong>Style:</strong> {style}</p>
          {text && <p><strong>Text:</strong> {text}</p>}
          <p>AI processing will be added next.</p>
        </div>
      )}
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f7f7f7",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    fontSize: "48px",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "30px",
    textAlign: "center",
  },
  uploadBox: {
    padding: "14px 26px",
    background: "#000",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  image: {
    maxWidth: "300px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  section: {
    width: "100%",
    maxWidth: "400px",
    marginBottom: "25px",
  },
  radio: {
    display: "block",
    marginBottom: "10px",
    cursor: "pointer",
  },
  textInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "14px 30px",
    background: "#000",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  confirmBox: {
    marginTop: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
};
