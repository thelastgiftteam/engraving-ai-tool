"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);
  const [member, setMember] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${uid}`);
      const data = await res.json();
      setOrder(data.order);
    }
    load();
  }, [uid]);

  async function updateStatus(newStatus) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        status: newStatus,
        teamMember: member,
      }),
    });

    const res = await fetch(`/api/orders/${uid}`);
    const data = await res.json();
    setOrder(data.order);
  }

  if (!order) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Loading order...</h2>
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      {/* Top Nav */}
      <div style={styles.nav}>
        <strong>WHAT THE FRAME</strong>

        <div style={styles.navRight}>
          <Link href="/" style={styles.navBtn}>Dashboard</Link>
          <Link href="/upload" style={styles.navBtn}>Upload</Link>
        </div>
      </div>

      <h2 style={styles.title}>Order #{order.orderNumber}</h2>

      {/* Team Member */}
      <select
        value={member}
        onChange={(e) => setMember(e.target.value)}
        style={styles.select}
      >
        <option value="">Select Team Member</option>
        <option>Arun</option>
        <option>Sreerag</option>
        <option>Ajmal</option>
      </select>

      <div style={styles.grid}>
        {order.images?.map((img, i) => (
          <div key={i} style={styles.card}>
            <a href={img} target="_blank">
              <img src={img} style={styles.image} />
            </a>

            <a href={img} target="_blank" style={styles.download}>
              Download Image
            </a>

            <button
              style={styles.start}
              onClick={() => updateStatus("processing")}
            >
              Start Processing
            </button>

            <button
              style={styles.complete}
              onClick={() => updateStatus("completed")}
            >
              Mark Complete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  wrapper: {
    maxWidth: 1100,
    margin: "30px auto",
    padding: 20,
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 10,
  },

  navRight: {
    display: "flex",
    gap: 10,
  },

  navBtn: {
    padding: "8px 14px",
    background: "#000",
    color: "#fff",
    borderRadius: 8,
    textDecoration: "none",
  },

  title: {
    marginBottom: 20,
  },

  select: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: 16,
  },

  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #eee",
  },

  image: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
  },

  download: {
    display: "block",
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    textDecoration: "none",
  },

  start: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  complete: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    background: "#22c55e",
    color: "#fff",
  },
};
