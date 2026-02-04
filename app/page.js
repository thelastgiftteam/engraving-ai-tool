export default function HomePage() {
  return (
    <main style={styles.wrapper}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.brand}>WHAT THE FRAME</h1>
        <p style={styles.tagline}>
          Internal Sales Tool · AI Engraving Mockups
        </p>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>
          Create Engraving Mockups in Seconds
        </h2>
        <p style={styles.heroDesc}>
          Add customer details, generate multiple mockup styles, 
          and send previews instantly via WhatsApp.
        </p>
      </section>

      {/* Form Card */}
      <section style={styles.card}>
        <h3 style={styles.cardTitle}>Customer Details</h3>

        <label style={styles.label}>Customer Name</label>
        <input
          placeholder="Enter customer name"
          style={styles.input}
        />

        <label style={styles.label}>Text on Frame (Optional)</label>
        <input
          placeholder="Eg: Forever in our hearts"
          style={styles.input}
        />

        <label style={styles.label}>Select Frame Type</label>
        <select style={styles.input}>
          <option>Classic Wooden Frame</option>
          <option>Modern Black Frame</option>
          <option>Golden Memorial Frame</option>
        </select>

        <label style={styles.label}>Select Mockup Styles</label>
        <div style={styles.checkboxRow}>
          <label><input type="checkbox" /> Minimal</label>
          <label><input type="checkbox" /> Premium</label>
          <label><input type="checkbox" /> Artistic</label>
        </div>

        <button style={styles.primaryBtn}>
          Generate Mockups
        </button>
      </section>

      {/* Footer hint */}
      <p style={styles.footerHint}>
        Mockups will be saved with a unique ID for follow-up.
      </p>
    </main>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8f9fb, #eef1f5)",
    padding: "32px 16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: 32,
  },

  brand: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "1px",
    marginBottom: 6,
  },

  tagline: {
    color: "#555",
    fontSize: 14,
  },

  hero: {
    maxWidth: 720,
    margin: "0 auto 32px",
    textAlign: "center",
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 12,
  },

  heroDesc: {
    fontSize: 16,
    color: "#444",
  },

  card: {
    maxWidth: 520,
    margin: "0 auto",
    background: "#fff",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },

  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginTop: 16,
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  checkboxRow: {
    display: "flex",
    gap: 16,
    marginTop: 8,
    fontSize: 14,
  },

  primaryBtn: {
    marginTop: 24,
    width: "100%",
    padding: "14px",
    borderRadius: 10,
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },

  footerHint: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
    color: "#666",
  },
};
