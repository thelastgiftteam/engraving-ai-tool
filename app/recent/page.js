import Link from "next/link";

export default function RecentPage() {
  return (
    <main style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Recent Enquiries</h1>
        <p style={styles.subtitle}>
          Tap an enquiry to continue order creation
        </p>
      </header>

      {/* List */}
      <section style={styles.list}>
        {mockData.map((item) => (
          <Link
            key={item.uid}
            href={`/order/${item.uid}`}
            style={styles.link}
          >
            <div style={styles.card}>
              <div>
                <h3 style={styles.name}>{item.customer}</h3>
                <p style={styles.uid}>UID: {item.uid}</p>
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
  { uid: "1001", customer: "Rahul", date: "04 Feb 2026" },
  { uid: "1002", customer: "Anjali", date: "04 Feb 2026" },
  { uid: "1003", customer: "Joseph", date: "03 Feb 2026" },
  { uid: "1004", customer: "Sneha", date: "03 Feb 2026" },
];

/* -------- STYLES -------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
    padding: 20,
    fontFamily: "system-ui, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
  },

  list: {
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  link: {
    textDecoration: "none",
    color: "inherit",
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
  },

  name: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
  },

  uid: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#444",
  },

  date: {
    fontSize: 12,
    color: "#888",
    whiteSpace: "nowrap",
  },
};
