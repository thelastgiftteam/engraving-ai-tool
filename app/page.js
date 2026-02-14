"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- TOP NAV ---------- */

function TopNav() {
  return (
    <div style={styles.nav}>
      <div style={styles.brand}>WHAT THE FRAME</div>

      <div style={styles.navRight}>
        <Link href="/upload" style={styles.navBtn}>
          Upload Order
        </Link>
      </div>
    </div>
  );
}

/* ---------- DASHBOARD ---------- */

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []));
  }, []);

  function getStatus(o) {
    if (!o.images || o.images.length === 0) return "pending";

    const processing = o.images.some(
      (img) =>
        typeof img === "object" &&
        img.status === "processing"
    );

    const completed = o.images.every(
      (img) =>
        typeof img === "object" &&
        img.status === "completed"
    );

    if (completed) return "completed";
    if (processing) return "processing";
    return "pending";
  }

  return (
    <main style={styles.page}>
      <TopNav />

      <h2 style={styles.title}>Engraving Dashboard</h2>

      <div style={styles.grid}>
        {orders.map((o) => {
          const status = getStatus(o);

          return (
            <Link
              key={o.uid}
              href={`/order/${o.uid}`}
              style={styles.card}
            >
              <div style={styles.cardHeader}>
                <strong>Order #{o.orderNumber}</strong>
              </div>

              <div style={styles.meta}>
                Frames: {o.images?.length || 0}
              </div>

              <div style={styles.statusRow}>
                <span style={styles.dot(status)} />

                <span>
                  {status === "processing"
                    ? `Processing by ${o.teamMember || "Team"}`
                    : status === "completed"
                    ? "Completed"
                    : "Pending"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
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

  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 700,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 18,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    border: "1px solid #eee",
    textDecoration: "none",
    color: "#000",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  cardHeader: {
    fontSize: 18,
  },

  meta: {
    color: "#666",
    fontSize: 14,
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 600,
  },

  dot: (status) => ({
    width: 10,
    height: 10,
    borderRadius: 10,
    background:
      status === "completed"
        ? "#22c55e"
        : status === "processing"
        ? "#3b82f6"
        : "#f59e0b",
  }),
};
