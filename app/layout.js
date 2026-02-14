export const metadata = {
  title: "What The Frame – Engraving Tool",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={styles.body}>
        <header style={styles.header}>
          <strong>What The Frame</strong>
        </header>

        {children}
      </body>
    </html>
  );
}

const styles = {
  body: {
    margin: 0,
    background: "#f6f6f6",
    fontFamily: "sans-serif",
  },

  header: {
    padding: "14px 20px",
    borderBottom: "1px solid #eee",
    background: "#fff",
    fontWeight: 700,
  },
};
