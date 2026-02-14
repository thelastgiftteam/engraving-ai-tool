"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);
  const [teamMember, setTeamMember] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${uid}`);
      const data = await res.json();
      setOrder(data.order);
      setTeamMember(data.order?.teamMember || "");
    }

    load();
  }, [uid]);

  async function startProcessing() {
    if (!teamMember) {
      alert("Select team member first");
      return;
    }

    await fetch(`/api/orders/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "processing",
        teamMember,
      }),
    });

    location.reload();
  }

  async function markComplete() {
    await fetch(`/api/orders/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "completed",
      }),
    });

    location.reload();
  }

  if (!order) {
    return (
      <main style={{ padding: 30 }}>
        <h2>Loading order...</h2>
      </main>
    );
  }

  const locked = order.status !== "pending";

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

      <h2 style={styles.title}>Order #{order.orderNumber}</h2>

      {/* TEAM CLAIM SECTION */}
      <div style={styles.claimBox}>
        <select
          value={teamMember}
          disabled={locked}
          onChange={(e) => setTeamMember(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Team Member</option>
          <option>Arun</option>
          <option>Sreerag</option>
          <option>Rahul</option>
        </select>

        {order.status === "pending" && (
          <button style={styles.startBtn} onClick={startProcessing}>
            Start Processing
          </button>
        )}

        {order.status === "processing" && (
          <button style={styles.processingBtn} disabled>
            Processing by {order.teamMember}
          </button>
        )}

        {order.status !== "completed" && (
          <button style={styles.completeBtn} onClick={markComplete}>
            Mark Complete
          </button>
        )}
      </div>

      {/* IMAGE GRID */}
      <div style={styles.grid}>
        {order.images?.map((img, i) => (
          <div key={i} style={styles.card}>
            <a href={img} target="_blank" style={styles.download}>
              Download Image
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles = {
  wrapper: {
    maxWidth: 1000,
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

  claimBox: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 30,
  },

  select: {
    padding: 10,
    borderRadius: 8,
  },

  startBtn: {
    padding: "10px 16px",
    background: "#000",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
  },

  processingBtn: {
    padding: "10px 16px",
    background: "#3b82f6",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
  },

  completeBtn: {
    padding: "10px 16px",
    background: "#22c55e",
    color: "#fff",
    borderRadius: 10,
    border: "none",
    fontWeight: 700,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
    gap: 20,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    border: "1px solid #eee",
    background: "#fff",
  },

  download: {
    display: "block",
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: 10,
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
  },
};
