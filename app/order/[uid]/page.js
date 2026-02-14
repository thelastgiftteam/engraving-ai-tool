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

  if (!order) {
    return (
      <main style={styles.wrapper}>
        <TopNav />
        <h2>Loading order...</h2>
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      <TopNav />

      <div style={styles.headerBox}>
        <h2 style={styles.title}>Order #{order.orderNumber}</h2>

        <select
          value={member}
          onChange={(e) => setMember(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Team Member</option>
          <option>Arjun</option>
          <option>Sreerag</option>
          <option>Akshay</option>
        </select>
      </div>

      <div style={styles.grid}>
        {order.images?.map((img, i) => (
          <div key={i} style={styles.card}>
            <img src={img} style={styles.image} />

            <a href={img} target="_blank" style={styles.download}>
              Download Image
            </a>

            <button style={styles.startBtn}>
              Start Processing
            </button>

            <button style={styles.completeBtn}>
              Mark Complete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ---------- TOP NAV BAR ---------- */

function TopNav() {
  return (
    <div style={styles.nav}>
      <Link href="/" style={styles.brand}>
        WHAT THE FRAME
      </Link>

      <div style={styles.navRight}>
        <Link href="/" style={styles.navBtn}>
          Dashboard
        </Link>

        <Link href="/upload" style={styles.navBtn}>
          Upload
        </Link>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: 20,
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 10,
  },

  brand: {
    fontWeight: 800,
    fontSize: 18,
    textDecoration: "none",
    color: "#000",
  },

  navRight: {
    display: "flex",
    gap: 12,
  },

  navBtn: {
    padding: "8px 14px",
    borderRadius: 10,
    background: "#000",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
  },

  headerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
  },

  select: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
  },

  image: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },

  download: {
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: 8,
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
    marginBottom: 8,
  },

  startBtn: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #000",
    background: "#fff",
    marginBottom: 6,
    fontWeight: 600,
  },

  completeBtn: {
    padding: 8,
    borderRadius: 8,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    fontWeight: 700,
  },
};
