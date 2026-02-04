export default function Recent() {
  return (
    <>
      <h1>Recent Enquiries</h1>

      <input
        placeholder="Search by UID"
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />

      <div style={styles.list}>
        {[1001, 1002, 1003].map((uid) => (
          <a key={uid} href={`/order/${uid}`} style={styles.card}>
            <strong>UID: {uid}</strong>
            <p>Customer: Demo Name</p>
            <small>Status: Mockup Sent</small>
          </a>
        ))}
      </div>
    </>
  );
}

const styles = {
  list: {
    display: "grid",
    gap: "12px",
    maxWidth: "400px",
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#000",
  },
};
