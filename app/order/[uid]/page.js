"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
function convertDrive(url) {
  if (!url) return "";

  // If already normal image, return as is
  if (!url.includes("drive.google.com")) return url;

  // Extract file id
  const match = url.match(/\/d\/(.*?)\//);

  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return url;
}

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
      <main style={styles.page}>
        <TopNav />
        <div style={styles.loading}>Loading order...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <TopNav />

      {/* ORDER HEADER CARD */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={styles.orderTitle}>Order #{order.orderNumber}</h2>
          <p style={styles.subText}>
            Select team member and start processing images
          </p>
        </div>

        <select
          value={member}
          onChange={(e) => setMember(e.target.value)}
          style={styles.memberSelect}
        >
          <option value="">Select Team Member</option>
          <option>Arjun</option>
          <option>Sreerag</option>
          <option>Akshay</option>
        </select>
      </div>

      {/* IMAGE GRID */}
      <div style={styles.grid}>
        {order.images?.map((img, i) => (
          <div key={i} style={styles.card}>
<img src={convertDrive(img)} style={styles.image} />

            <div style={styles.btnGroup}>
              <a href={img} target="_blank" style={styles.download}>
                Download
              </a>

              <button style={styles.startBtn}>
                Start
              </button>

              <button style={styles.completeBtn}>
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ---------- NAV ---------- */

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
  page: {
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
    gap: 10,
  },

  navBtn: {
    background: "#000",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
  },

  loading: {
    padding: 40,
    fontSize: 18,
  },

  /* HEADER CARD */

  headerCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
  },

  orderTitle: {
    fontSize: 24,
    fontWeight: 800,
  },

  subText: {
    color: "#666",
    marginTop: 4,
    fontSize: 14,
  },

  memberSelect: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontWeight: 600,
  },

  /* GRID */

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 14,
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
  },

  image: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
  },

  btnGroup: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  download: {
    flex: 1,
    textAlign: "center",
    background: "#000",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 700,
  },

  startBtn: {
    flex: 1,
    background: "#fff",
    border: "1px solid #000",
    borderRadius: 10,
    padding: 10,
    fontWeight: 600,
  },

  completeBtn: {
    flex: 1,
    background: "#22c55e",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    padding: 10,
    fontWeight: 700,
  },
};
