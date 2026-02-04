export const metadata = {
  title: "What The Frame – Internal Tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <nav style={styles.nav}>
          <strong>What The Frame</strong>
          <div>
            <a href="/" style={styles.link}>New Enquiry</a>
            <a href="/recent" style={styles.link}>Recent</a>
          </div>
        </nav>

        <div style={styles.container}>{children}</div>
      </body>
    </html>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid #eee",
    background: "#fff",
  },
  link: {
    marginLeft: "16px",
    textDecoration: "none",
    color: "#000",
    fontWeight: 500,
  },
  container: {
    padding: "40px",
    background: "#f7f7f7",
    minHeight: "100vh",
  },
};
