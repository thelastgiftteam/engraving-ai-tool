"use client";

import { useState } from "react";
import Link from "next/link";

export default function OrderPage({ params }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [status, setStatus] = useState("pending");

  return (
    <main style={styles.wrapper}>
      {/* Top Bar */}
      <header style={styles.topBar}>
        <Link href="/recent" style={styles.backLink}>
          ← Recent Enquiries
        </Link>
        <div style={styles.uidBox}>UID: {params.uid}</div>
      </header>

      {/* Page Title */}
      <h1 style={styles.title}>Create Order</h1>

      {/* Status */}
      <div style={styles.statusRow}>
        <span
          style={{
            ...styles.statusDot,
            backgroundColor: status === "paid" ? "#2ecc71" : "#e74c3c",
          }}
        />
        <span style={styles.statusText}>
          {status === "paid" ? "Paid" : "Pending Payment"}
        </span>
      </div>

      {/* Main Card */}
      <section style={styles.card}>
        {/* Customer */}
        <div style={styles.section}>
          <label style={styles.label}>Customer Name</label>
          <input
            value="Demo Customer"
            disabled
            style={{ ...styles.input, background: "#f2f2f2" }}
          />
        </div>

        {/* Mockups */}
        <div style={styles.section}>
          <label style={styles.label}>Select Mockup</label>
          <div style={styles.mockupRow}>
            {mockImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Mockup"
                onClick={() => setSelectedImage(index)}
                style={{
                  ...styles.mockup,
                  border:
                    selectedImage === index
                      ? "3px solid #000"
                      : "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </div>

        {/* Product */}
        <div style={styles.section}>
          <label style={styles.label}>Product Type</label>
          <select style={styles.input}>
            <option>Frame Stand</option>
            <option>Keychain</option>
          </select>
        </div>

        {/* Sales Partner */}
        <div style={styles.section}>
          <label style={styles.label}>Sales Partner Name</label>
          <input
            placeholder="Enter employee name"
            style={styles.input}
          />
        </div>

        {/* Address */}
        <div style={styles.section}>
          <label style={styles.label}>Delivery Address</label>
          <textarea
            placeholder="Enter full address"
            style={styles.textarea}
          />
        </div>

        {/* Order Value */}
        <div style={styles.section}>
          <label style={styles.label}>Order Value (₹)</label>
          <input
            placeholder="Eg: 4500"
            style={styles.input}
          />
        </div>

        {/* Payment Proof */}
        <div style={styles.section}>
          <label style={styles.label}>Payment Proof</label>
          <input type="file" />
        </div>

        {/* Action */}
        <button style={styles.button}>
          Create Order
        </button>
      </section>
    </main>
  );
}

/* -------- MOCK IMAGES -------- */
const mockImages = [
  "https://via.placeholder.com/160x160?text=Style+1",
  "https://via.placeholder.com/160x160?text=Style+2",
  "https://via.placeholder.com/160x160?text=Style+3",
];

/* -------- STYLES -------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
    padding: 20,
    fontFamily: "system-ui, sans-serif",
  },

  topBar: {
    maxWidth: 800,
    margin: "0 auto 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backLink: {
    textDecoration: "none",
    fontSize: 14,
    color: "#000",
    fontWeight: 600,
  },

  uidBox: {
    fontSize: 14,
    fontWeight: 700,
    background: "#fff",
    padding: "6px 12px",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 10,
  },

  statusRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
  },

  statusText: {
    fontSize: 14,
    fontWeight: 600,
  },

  card: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  section: {
    marginBottom: 18,
  },

  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 600,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    minHeight: 80,
    fontSize: 14,
  },

  mockupRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  mockup: {
    width: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: 10,
    cursor: "pointer",
  },

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 10,
  },
};
