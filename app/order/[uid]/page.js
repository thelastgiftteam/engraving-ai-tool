"use client";

import { useEffect, useState } from "react";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      const res = await fetch("/api/orders");
      const data = await res.json();

      const found = (Array.isArray(data) ? data : data.orders || []).find(
        (o) => o.uid === uid
      );

      setOrder(found || null);
    }

    loadOrder();
  }, [uid]);

  if (!order) {
    return <div style={{ padding: 40 }}>Loading order...</div>;
  }

  return (
    <main style={styles.wrapper}>
      <h2 style={styles.title}>Order #{order.orderNumber}</h2>

      <div style={styles.grid}>
        {order.images.map((link, i) => (
          <div key={i} style={styles.card}>
            {/* Preview Image */}
            <img
              src={convertDriveLink(link)}
              style={styles.image}
            />

            {/* Original Link */}
            <div style={styles.linkBox}>
              {link}
            </div>

            {/* Download Button */}
            <a href={link} target="_blank" style={styles.download}>
              Download Image
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}

/* Convert Google Drive link to preview image */
function convertDriveLink(url) {
  try {
    const id = url.split("/d/")[1].split("/")[0];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  } catch {
    return url;
  }
}

const styles = {
  wrapper: {
    maxWidth: 1100,
    margin: "40px auto",
    padding: 20,
  },

  title: {
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
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
  },

  linkBox: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
    wordBreak: "break-all",
  },

  download: {
    marginTop: 10,
    display: "block",
    padding: 10,
    background: "#000",
    color: "#fff",
    textAlign: "center",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
  },
};
