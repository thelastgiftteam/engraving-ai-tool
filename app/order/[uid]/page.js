"use client";

import { useEffect, useState } from "react";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!uid) return;

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.orders || []).find(
          (o) => String(o.uid) === String(uid)
        );

        setOrder(found || null);
      });
  }, [uid]);

  if (!order) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Loading order...</h2>
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      <h1 style={styles.title}>Order #{order.orderNumber}</h1>

      <div style={styles.section}>
        <h3>Design Images</h3>

        {order.images?.map((img, i) => (
          <div key={i} style={styles.imageCard}>
            <a href={img} target="_blank">
              Open Drive Link
            </a>

            <a href={img} download style={styles.downloadBtn}>
              Download
            </a>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3>Status</h3>
        <p>{order.status}</p>
      </div>
    </main>
  );
}

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 20,
  },

  title: {
    fontSize: 28,
    marginBottom: 20,
  },

  section: {
    marginTop: 20,
  },

  imageCard: {
    display: "flex",
    gap: 12,
    marginTop: 10,
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 10,
  },

  downloadBtn: {
    background: "#000",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    textDecoration: "none",
  },
};
