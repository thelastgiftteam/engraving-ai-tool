"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  // Load Orders
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();

        // Support both formats just in case
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed loading orders", err);
      }
    }

    loadOrders();
  }, []);

  return (
    <main style={styles.wrapper}>
      <h1 style={styles.title}>WHAT THE FRAME</h1>
      <p style={styles.subtitle}>Engraving Team Dashboard</p>

      <div style={styles.topBar}>
        <Link href="/upload" style={styles.uploadBtn}>
          + New Design Upload
        </Link>
      </div>

      {/* Orders Grid */}
      <div style={styles.grid}>
        {orders.length === 0 && (
          <div style={styles.empty}>
            No orders yet — upload a design to begin.
          </div>
        )}

        {orders.map((o) => (
<Link key={o.orderNumber} href={`/order/${o.orderNumber}`} style={styles.card}>
            <div style={styles.header}>
              <strong>Order #{o.orderNumber}</strong>
            </div>

            <div style={styles.meta}>
              Images Ready: {o.images?.length || 0}
            </div>

            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.dot,
                  background:
                    o.status === "completed"
                      ? "#22c55e"
                      : o.engraver
                      ? "#3b82f6"
                      : "#f59e0b",
                }}
              />
              <span>
                {o.status === "completed"
                  ? "Completed"
                  : o.engraver
                  ? "In Progress"
                  : "Pending"}
              </span>
            </div>

            {o.engraver && (
              <div style={styles.engraver}>
                Engraving by {o.engraver}
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}

const styles = {
  wrapper: {
    maxWidth: 1100,
    margin: "40px auto",
    padding: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: 800,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },

  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },

  uploadBtn: {
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: 16,
  },

  card: {
    padding: 16,
    borderRadius: 14,
    background: "#fff",
    textDecoration: "none",
    color: "#000",
    border: "1px solid #eee",
    transition: "0.2s",
  },

  header: {
    fontSize: 18,
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    color: "#666",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    fontWeight: 600,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
  },

  engraver: {
    marginTop: 10,
    fontSize: 13,
    color: "#444",
  },

  empty: {
    gridColumn: "1/-1",
    textAlign: "center",
    padding: 40,
    color: "#888",
    background: "#fff",
    borderRadius: 12,
    border: "1px dashed #ddd",
  },
};
