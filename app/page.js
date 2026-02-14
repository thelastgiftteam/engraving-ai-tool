"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    }

    load();
  }, []);

  function getStatus(order) {
    if (order.status === "completed") {
      return { text: "Completed", color: "#22c55e" };
    }

    if (order.status === "processing") {
      return {
        text: `Processing by ${order.teamMember || "Team"}`,
        color: "#3b82f6",
      };
    }

    return { text: "Pending", color: "#f59e0b" };
  }

  return (
    <main style={styles.wrapper}>
      {/* TOP NAV */}
      <div style={styles.nav}>
        <strong>WHAT THE FRAME</strong>

        <div style={styles.navRight}>
          <Link href="/" style={styles.navBtn}>
            Dashboard
          </Link>

          <Link href="/upload" style={styles.navBtn}>
            Upload
          </Link>
        </div>
      </div>

      <h1 style={styles.title}>Engraving Team Dashboard</h1>

      <div style={styles.grid}>
        {orders.map((o) => {
          const status = getStatus(o);

          return (
            <Link key={o.uid} href={`/order/${o.uid}`} style={styles.card}>
              <div style={styles.header}>
                <strong>Order #{o.orderNumber}</strong>
              </div>

              <div style={styles.meta}>
                Images: {o.images?.length || 0}
              </div>

              <div style={styles.statusRow}>
                <span
                  style={{
                    ...styles.dot,
                    background: status.color,
                  }}
                />
                <span>{status.text}</span>
              </div>
            </Link>
          );
        })}
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
    textAlign: "center",
    marginBottom: 30,
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
};
