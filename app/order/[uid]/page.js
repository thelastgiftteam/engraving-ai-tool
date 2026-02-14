"use client";

import { useEffect, useState } from "react";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${uid}`); // ✅ PLURAL orders
      const data = await res.json();
      setOrder(data.order);
    }

    load();
  }, [uid]);

  if (!order) {
    return (
      <main style={{ padding: 30 }}>
        <h2>Loading order...</h2>
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      <h2 style={styles.title}>Order #{order.orderNumber}</h2>

      <div style={styles.grid}>
        {order.images?.map((img, i) => (
          <div key={i} style={styles.card}>
            <img src={img} style={styles.image} />

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
    maxWidth: 900,
    margin: "40px auto",
    padding: 20,
  },

  title: {
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #eee",
  },

  image: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },

  download: {
    display: "block",
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: 8,
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
  },
};
