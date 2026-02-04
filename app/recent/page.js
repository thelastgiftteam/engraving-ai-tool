import Link from "next/link";

export default function RecentPage() {
  return (
    <main style={styles.wrapper}>
      {/* Top Bar */}
      <header style={styles.topBar}>
        <Link href="/" style={styles.backLink}>
          ← New Enquiry
        </Link>
        <h1 style={styles.title}>Recent Enquiries</h1>
      </header>

      <p style={styles.subtitle}>
        Tap an enquiry to continue order creation
      </p>

      {/* Enquiry List */}
      <section style={styles.list}>
        {mockData.map((item) => (
          <Link
            key={item.uid}
            href={`/order/${item.uid}`}
            style={styles.link}
          >
            <div style={styles.card}>
              {/* Thumbnails */}
              <div style={styles.thumbRow}>
                {item.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Mockup"
                    style={styles.thumb}
                  />
                ))}
              </div>

              {/* Details */}
              <div style={styles.details}>
                <h3 style={styles.name}>{item.customer}</h3>
                <p style={styles.uid}>UID: {item.uid}</p>

                {/* Status */}
                <div style={styles.statusRow}>
                  <span
                    style={{
                      ...styles.statusDot,
                      backgroundColor:
                        item.status === "paid" ? "#2ecc71" : "#e74c3c",
                    }}
                  />
                  <span style={styles.statusText}>
                    {item.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>

              <span style={styles.date}>{item.date}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

/* -------- MOCK DATA (UI ONLY) -------- */
const mockData = [
  {
    uid: "1001",
    customer: "Rahul",
    date: "04 Feb 2026",
    status: "paid",
    images: [
      "https://via.placeholder.com/80x80?text=1",
      "https://via.placeholder.com/80x80?text=2",
      "https://via.placeholder.com/80x80?text=3",
    ],
  },
  {
    uid: "1002",
    customer: "Anjali",
    date: "04 Feb 2026",
    status: "pending",
    images: [
      "https://via.placeholder.com/80x80?text=1",
      "https://via.placeholder.com/80x80?text=2",
      "https://via.placeholder.com/80x80?text=3",
    ],
  },
  {
    uid: "1003",
    customer: "Joseph",
    date: "03 Feb 2026",
    status: "pending",
    images: [
      "https://via.placeholder.com/80x80?text=1",
      "https://via.placeholder.com/80x80?text=2",
      "https://via.placeholder.com/80x80?text=3",
    ],
  },
];

/* -------- STYLES -------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
    padding: 20,
    fontFamily: "system-ui, sans-serif",
  },

  topBar: {
    maxWidth: 720,
    margin: "0 auto 10px",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  backLink: {
    textDecoration: "none",
    fontSize: 14,
    color: "#000",
    fontWeight: 600,
  },

  title: {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
  },

  subtitle: {
    maxWidth: 720,
    margin: "0 auto 20px",
    fontSize: 14,
    color: "#666",
  },

  list: {
    maxWidth: 720,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  link: {
    textDecoration: "none",
    color: "inherit",
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    display: "flex",
    gap: 16,
    alignItems: "center",
  },

  thumbRow: {
    display: "flex",
    gap: 8,
  },

  thumb: {
    width: 64,
    height: 64,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  details: {
    flex: 1,
  },

  name: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
  },

  uid: {
    margin: "4px 0",
    fontSize: 13,
    color: "#444",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },

  statusText: {
    fontSize: 13,
    fontWeight: 600,
  },

  date: {
    fontSize: 12,
    color: "#888",
    whiteSpace: "nowrap",
  },
};
