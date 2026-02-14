"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const params = useParams();
  const orderId = params.uid;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
      });
  }, [orderId]);

  if (!order) {
    return (
      <main style={{ padding: 20 }}>
        <h2>Loading order...</h2>
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      <h2 style={styles.title}>Order #{order.orderNumber}</h2>

      <div style={styles.section}>
        <strong>Status:</strong> {order.status}
      </div>

      {order.engraver && (
        <div style={styles.section}>
          Engraving by: {order.engraver}
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>Design Images</h3>

      <div style={styles.grid}>
        {order.images?.map((img, i) => (
          <div key={i} style={styles.card}>
            <a href={img} target="_blank">
              <img src={img} style={styles.image} />
            </a>

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
    margin: "40px auto",
    padding: 20,
  },

  title: {
    fontSize: 26,
    marginBottom: 20,
  },

  section: {
    marginTop: 10,
  },

  grid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 16,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    border: "1px solid #eee",
  },

  image: {
    width: "100%",
    borderRadius: 10,
  },

  download: {
    display: "block",
    marginTop: 10,
    background: "#000",
    color: "#fff",
    textAlign: "center",
    padding: "8px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
  },
};
