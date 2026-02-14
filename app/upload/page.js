"use client";

import { useState } from "react";

export default function UploadPage() {
  const [orderId, setOrderId] = useState("");
  const [links, setLinks] = useState([""]);

  function addField() {
    setLinks([...links, ""]);
  }

  function updateLink(i, value) {
    const copy = [...links];
    copy[i] = value;
    setLinks(copy);
  }

  function submit() {
    alert("UI Ready — Order will be created later");
  }

  return (
    <main style={styles.wrapper}>
      <h2 style={styles.title}>Create Engraving Order</h2>

      <input
        placeholder="Order Number"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={styles.input}
      />

      <h3>Design Image Links (Google Drive)</h3>

      {links.map((l, i) => (
        <input
          key={i}
          placeholder="Paste Drive Image Link"
          value={l}
          onChange={(e) => updateLink(i, e.target.value)}
          style={styles.input}
        />
      ))}

      <button onClick={addField} style={styles.addBtn}>
        + Add Another Image
      </button>

      <button onClick={submit} style={styles.createBtn}>
        Create Order
      </button>
    </main>
  );
}

const styles = {
  wrapper: {
    maxWidth: 700,
    margin: "40px auto",
    padding: 20,
    background: "#fff",
    borderRadius: 14,
  },

  title: {
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  addBtn: {
    marginTop: 12,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #000",
    background: "#fff",
  },

  createBtn: {
    marginTop: 20,
    padding: "12px 16px",
    background: "#000",
    color: "#fff",
    borderRadius: 10,
    fontWeight: 700,
  },
};
