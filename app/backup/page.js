"use client";

import { useState } from "react";
import Link from "next/link";

export default function BackupPage() {
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
 
  async function downloadBackup() {
    try {
      setMessage("⏳ Creating backup...");
      const response = await fetch('/api/backup');
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage("✅ Backup downloaded!");
    } catch (error) {
      setMessage("❌ Failed: " + error.message);
    }
  }

  async function handleRestore(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setRestoring(true);
      setMessage("⏳ Restoring...");

      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch('/api/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setMessage(
          `✅ Restored!\n\n` +
          `Orders: ${result.stats.orders}\n` +
          `Employees: ${result.stats.employees}\n` +
          `Products: ${result.stats.productTypes}\n` +
          `Logs: ${result.stats.processingLogs}`
        );
      } else {
        setMessage("⚠️ " + result.message);
      }
    } catch (error) {
      setMessage("❌ Failed: " + error.message);
    } finally {
      setRestoring(false);
    }
  }

  return (
    <main style={styles.wrapper}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navBrand}>
            <span style={styles.logo}>🖼️</span>
            <span style={styles.brandText}>What The Frame</span>
          </div>

          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={styles.menuBtn}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        <div style={styles.navDesktop}>
          <Link href="/" style={styles.navBtn}>Dashboard</Link>
          <Link href="/upload" style={styles.navBtn}>+ New Order</Link>
          <Link href="/analytics" style={styles.navBtn}>📊 Analytics</Link>
          <Link href="/recent" style={styles.navBtn}>📋 Recent</Link>
          <Link href="/settings" style={styles.navBtn}>⚙️ Settings</Link>
        </div>

        {menuOpen && (
          <div style={styles.mobileMenu}>
            <Link href="/" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>🏠</span> Dashboard
            </Link>
            <Link href="/upload" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>➕</span> New Order
            </Link>
            <Link href="/analytics" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>📊</span> Analytics
            </Link>
            <Link href="/recent" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>📋</span> Recent
            </Link>
            <Link href="/settings" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>⚙️</span> Settings
            </Link>
          </div>
        )}
      </nav>

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔄 Backup & Restore</h1>
          <p style={styles.subtitle}>
            Save data before deployments and restore after.
          </p>

          <div style={styles.warning}>
            <span style={styles.warningIcon}>⚠️</span>
            <div style={styles.warningText}>
              <strong>Important:</strong> Always backup before redeploying!
            </div>
          </div>

          {/* Backup Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📥 Download Backup</h2>
            <p style={styles.sectionDesc}>
              Save all orders, employees, products, and logs.
            </p>
            <button onClick={downloadBackup} style={styles.primaryBtn}>
              ⬇️ Download Backup
            </button>
          </div>

          {/* Restore Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📤 Restore Backup</h2>
            <p style={styles.sectionDesc}>
              Upload a backup file to restore data.
            </p>
            <label style={styles.uploadLabel}>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                disabled={restoring}
                style={styles.fileInput}
              />
              <span style={styles.uploadBtn}>
                {restoring ? "⏳ Restoring..." : "📁 Choose File"}
              </span>
            </label>
          </div>

          {/* Message Display */}
          {message && (
            <div style={styles.message}>
              <pre style={styles.messageText}>{message}</pre>
            </div>
          )}

          {/* Instructions */}
          <div style={styles.instructions}>
            <h3 style={styles.instructionsTitle}>📋 How to Use</h3>
            <ol style={styles.instructionsList}>
              <li><strong>Before:</strong> Download backup</li>
              <li><strong>Deploy:</strong> Push to GitHub</li>
              <li><strong>After:</strong> Upload backup</li>
              <li><strong>Done:</strong> Data restored!</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    paddingBottom: "40px",
  },

  nav: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
  },

  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logo: {
    fontSize: "24px",
  },

  brandText: {
    fontSize: "18px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  menuBtn: {
    fontSize: "24px",
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    padding: "8px",
    display: "none",
  },

  navDesktop: {
    display: "flex",
    gap: "8px",
    padding: "0 16px 12px",
    flexWrap: "wrap",
  },

  navBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s",
    background: "transparent",
    color: "#1f2937",
    whiteSpace: "nowrap",
  },

  navBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 2px 10px rgba(102, 126, 234, 0.4)",
  },

  mobileMenu: {
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
  },

  mobileMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    textDecoration: "none",
    color: "#1f2937",
    fontWeight: "600",
    fontSize: "15px",
    borderBottom: "1px solid #f3f4f6",
    transition: "background 0.2s",
  },

  mobileMenuItemActive: {
    background: "#f0f9ff",
    color: "#667eea",
  },

  mobileMenuIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },

  container: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "0 16px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },

  title: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "6px",
    color: "#1f2937",
    wordBreak: "break-word",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "16px",
    lineHeight: "1.5",
  },

  warning: {
    display: "flex",
    gap: "8px",
    padding: "10px",
    background: "#fef3c7",
    border: "2px solid #fbbf24",
    borderRadius: "10px",
    marginBottom: "20px",
    color: "#92400e",
    alignItems: "flex-start",
  },

  warningIcon: {
    fontSize: "18px",
    flexShrink: 0,
    marginTop: "2px",
  },

  warningText: {
    fontSize: "12px",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },

  section: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e5e7eb",
  },

  sectionTitle: {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#1f2937",
  },

  sectionDesc: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "12px",
    lineHeight: "1.4",
  },

  primaryBtn: {
    width: "100%",
    padding: "12px 16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },

  uploadLabel: {
    display: "block",
    cursor: "pointer",
  },

  fileInput: {
    display: "none",
  },

  uploadBtn: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    background: "#10b981",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
    textAlign: "center",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },

  message: {
    padding: "12px",
    background: "#f3f4f6",
    borderRadius: "10px",
    marginBottom: "20px",
    overflow: "auto",
  },

  messageText: {
    fontSize: "11px",
    fontFamily: "monospace",
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#1f2937",
    lineHeight: "1.5",
    wordBreak: "break-word",
  },

  instructions: {
    background: "#eff6ff",
    padding: "14px",
    borderRadius: "10px",
  },

  instructionsTitle: {
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1e40af",
  },

  instructionsList: {
    paddingLeft: "18px",
    margin: 0,
    color: "#1e40af",
    fontSize: "12px",
    lineHeight: "1.6",
  },
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 768px) {
      .menuBtn {
        display: block !important;
      }
      .navDesktop {
        display: none !important;
      }
    }

    @media (min-width: 769px) {
      .menuBtn {
        display: none !important;
      }
    }

    @media (hover: hover) {
      button:hover:not(:disabled) {
        transform: translateY(-2px);
      }
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}
