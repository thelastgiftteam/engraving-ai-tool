export default function HomePage() {
  return (
    <>
      {/* GLOBAL RESPONSIVE STYLES */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        input, select, button {
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 22px;
          }

          .brand {
            font-size: 26px;
          }

          .card {
            padding: 18px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 20px;
          }

          .hero-desc {
            font-size: 14px;
          }
        }
      `}</style>

      <main style={styles.wrapper}>
        {/* Header */}
        <header style={styles.header}>
          <h1 className="brand" style={styles.brand}>
            WHAT THE FRAME
          </h1>
          <p style={styles.tagline}>
            Internal Sales Tool · AI Engraving Mockups
          </p>
        </header>

        {/* Hero */}
        <section style={styles.hero}>
          <h2 className="hero-title" style={styles.heroTitle}>
            Create Engraving Mockups in Seconds
          </h2>
          <p className="hero-desc" style={styles.heroDesc}>
            Add customer details, generate multiple mockup styles,
            and send previews instantly via WhatsApp.
          </p>
        </section>

        {/* Form Card */}
        <section className="card" style={styles.card}>
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

          <label style={styles.label}>Mockup Styles</label>
          <div style={styles.checkboxRow}>
            <label style={styles.checkbox}><input type="checkbox" /> Minimal</label>
            <label style={styles.checkbox}><input type="checkbox" /> Premium</label>
            <label style={styles.checkbox}><input type="checkbox" /> Artistic</label>
          </div>

          <button style={styles.primaryBtn}>
            Generate Mockups
          </button>
        </section>

        <p style={styles.footerHint}>
          Mockups will be saved with a unique ID for follow-up.
        </p>
      </main>
    </>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8f9fb, #eef1f5)",
    padding: "24px 12px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: 28,
  },

  brand: {
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: "1px",
    marginBottom: 6,
  },

  tagline: {
    color: "#555",
    fontSize: 14,
  },

  hero: {
    maxWidth: "90vw",
    width: 720,
    margin: "0 auto 28px",
    textAlign: "center",
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 10,
  },

  heroDesc: {
    fontSize: 16,
    color: "#444",
    lineHeight: 1.5,
  },

  card: {
    maxWidth: "92vw",
    width: 520,
    margin: "0 auto",
    background: "#fff",
    padding: 22,
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
    marginTop: 14,
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    outline: "none",
  },

  checkboxRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 8,
  },

  checkbox: {
    fontSize: 14,
  },

  primaryBtn: {
    marginTop: 22,
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
    marginTop: 22,
    fontSize: 13,
    color: "#666",
  },
};
