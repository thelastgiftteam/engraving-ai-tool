export default function HomePage() {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        input, select, button {
          width: 100%;
          max-width: 100%;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 24px;
          }
        }
      `}</style>

      <main style={styles.wrapper}>
        {/* Brand */}
        <header style={styles.header}>
          <h1 className="title" style={styles.title}>WHAT THE FRAME</h1>
          <p style={styles.subtitle}>
            Engraving Mockup Generator · Internal Sales Tool
          </p>
        </header>

        {/* Form Card */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Create Mockup</h2>

          {/* Customer Name */}
          <label style={styles.label}>Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            style={styles.input}
          />

          {/* Phone Number */}
          <label style={styles.label}>Customer Phone Number</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            style={styles.input}
          />

          {/* Upload Image */}
          <label style={styles.label}>Upload Customer Image</label>
          <input
            type="file"
            accept="image/*"
            style={styles.input}
          />

          {/* Design Type */}
          <label style={styles.label}>Select Design Style</label>
          <select style={styles.input}>
            <option value="">Select style</option>
            <option>Ghibli Style</option>
            <option>Pencil Sketch</option>
            <option>Premium Engraving</option>
            <option>Minimal Line Art</option>
          </select>

          {/* Generate Button */}
          <button style={styles.button}>
            Generate Mockup
          </button>
        </section>

        <p style={styles.note}>
          Mockups will be generated and saved for follow-up.
        </p>
      </main>
    </>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f6fa",
    padding: "20px",
    fontFamily: "system-ui, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  card: {
    maxWidth: 420,
    margin: "0 auto",
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },

  label: {
    display: "block",
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 600,
  },

  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },

  button: {
    marginTop: 22,
    padding: 14,
    borderRadius: 10,
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },

  note: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 13,
    color: "#666",
  },
};
