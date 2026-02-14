"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- TOP NAV ---------- */

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

/* ---------- MAIN PAGE ---------- */

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);
  const [member, setMember] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${uid}`);
      const data = await res.json();
      setOrder(data.order);
      if (data.order?.teamMember) {
        setMember(data.order.teamMember);
      }
    }
    load();
  }, [uid]);

  async function updateStatus(index, status) {
    await fetch(`/api/orders/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamMember: member,
        imageIndex: index,
        status,
      }),
    });

    const res = await fetch(`/api/orders/${uid}`);
    const data = await res.json();
    setOrder(data.order);
  }

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

      {/* HEADER CARD */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={styles.title}>Order #{order.orderNumber}</h2>
          <p style={styles.subText}>
            Assign a team member and process each frame
          </p>
        </div>

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

      {/* IMAGE CARDS */}
      <div style={styles.grid}>
        {order.images?.map((img, i) => {
          const status =
            typeof img === "string"
              ? "pending"
              : img.status || "pending";

          const url =
            typeof img === "string" ? img : img.url;

          return (
            <div key={i} style={styles.card}>
              <div style={styles.cardHeader}>
                Frame #{i + 1}
                <span style={styles.statusBadge(status)}>
                  {status}
                </span>
              </div>

              <a
                href={url}
                target="_blank"
                style={styles.download}
              >
                Download Image
              </a>

              <div style={styles.btnGroup}>
                <button
                  style={styles.startBtn}
                  onClick={() => updateStatus(i, "processing")}
                >
                  Start
                </button>

                <button
                  style={styles.completeBtn}
                  onClick={() => updateStatus(i, "completed")}
                >
                  Complete
                </button>
              </div>
            </div>
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

  title: {
    fontSize: 24,
    fontWeight: 800,
  },

  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  select: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 700,
  },

  statusBadge: (status) => ({
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
    textTransform: "capitalize",
    background:
      status === "completed"
        ? "#22c55e"
        : status === "processing"
        ? "#3b82f6"
        : "#f59e0b",
    color: "#fff",
  }),

  download: {
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: 10,
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 700,
  },

  btnGroup: {
    display: "flex",
    gap: 8,
  },

  startBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #000",
    background: "#fff",
    fontWeight: 600,
  },

  completeBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    fontWeight: 700,
  },
};
