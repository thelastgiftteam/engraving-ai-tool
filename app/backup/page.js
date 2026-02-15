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
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edge-config-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage("✅ Backup downloaded successfully!");
    } catch (error) {
      setMessage("❌ Failed to create backup: " + error.message);
    }
  }

  async function handleRestore(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setRestoring(true);
      setMessage("⏳ Restoring data...");

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
          `✅ Data restored!\n\n` +
          `Orders: ${result.stats.orders}\n` +
          `Employees: ${result.stats.employees}\n` +
          `Products: ${result.stats.productTypes}\n` +
          `Logs: ${result.stats.processingLogs}`
        );
      } else {
        setMessage("⚠️ " + result.message);
      }
    } catch (error) {
      setMessage("❌ Failed to restore: " + error.message);
    } finally {
      setRestoring(false);
    }
  }

  return (
    <main style={styles.wrapper}>
      {/* Compact Mobile Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.navBrand}>
            <span style={styles.logo}>🖼️</span>
            <span style={styles.brandText}>What The Frame</span>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={styles.menuBtn}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div style={styles.navDesktop}>
          <Link href="/" style={styles.navBtn}>Dashboard</Link>
          <Link href="/upload" style={styles.navBtn}>+ New Order</Link>
          <Link href="/analytics" style={styles.navBtn}>📊 Analytics</Link>
          <Link href="/recent" style={styles.navBtn}>📋 Recent</Link>
          <Link href="/settings" style={styles.navBtn}>⚙️ Settings</Link>
          <Link href="/backup" style={{...styles.navBtn, ...styles.navBtnActive}}>🔄 Backup</Link>
        </div>

        {/* Mobile Dropdown Menu */}
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
              <span style={styles.mobileMenuIcon}>📋</span> Recent Orders
            </Link>
            <Link href="/settings" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>⚙️</span> Settings
            </Link>
            <Link href="/backup" style={{...styles.mobileMenuItem, ...styles.mobileMenuItemActive}} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>🔄</span> Backup
            </Link>
          </div>
        )}
      </nav>

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔄 Backup & Restore</h1>
          <p style={styles.subtitle}>
            Save your data before deployments and restore after.
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
              Save all orders, employees, products, and logs as JSON.
            </p>
            <button onClick={downloadBackup} style={styles.primaryBtn}>
              ⬇️ Download Backup
            </button>
          </div>

          {/* Restore Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📤 Restore Backup</h2>
            <p style={styles.sectionDesc}>
              Upload a backup file to restore your data.
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
              <li><strong>Deploy:</strong> Push code to GitHub</li>
              <li><strong>After:</strong> Upload backup file</li>
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
    padding: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "8px",
    color: "#1f2937",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  warning: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    background: "#fef3c7",
    border: "2px solid #fbbf24",
    borderRadius: "10px",
    marginBottom: "24px",
    color: "#92400e",
    alignItems: "flex-start",
  },

  warningIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },

  warningText: {
    fontSize: "13px",
    lineHeight: "1.5",
  },

  section: {
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: "2px solid #e5e7eb",
  },

  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "6px",
    color: "#1f2937",
  },

  sectionDesc: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "16px",
    lineHeight: "1.5",
  },

  primaryBtn: {
    width: "100%",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    transition: "all 0.2s",
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
    padding: "12px 20px",
    background: "#10b981",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
    textAlign: "center",
    transition: "all 0.2s",
  },

  message: {
    padding: "16px",
    background: "#f3f4f6",
    borderRadius: "10px",
    marginBottom: "24px",
  },

  messageText: {
    fontSize: "12px",
    fontFamily: "monospace",
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#1f2937",
    lineHeight: "1.6",
  },

  instructions: {
    background: "#eff6ff",
    padding: "16px",
    borderRadius: "10px",
  },

  instructionsTitle: {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#1e40af",
  },

  instructionsList: {
    paddingLeft: "20px",
    margin: 0,
    color: "#1e40af",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  "@media (min-width: 769px)": {
    container: {
      margin: "40px auto",
      padding: "0 20px",
    },
    card: {
      padding: "40px",
      borderRadius: "20px",
    },
    title: {
      fontSize: "32px",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "16px",
      marginBottom: "30px",
    },
    warning: {
      padding: "16px",
      marginBottom: "30px",
    },
    warningIcon: {
      fontSize: "24px",
    },
    warningText: {
      fontSize: "14px",
    },
    section: {
      marginBottom: "40px",
      paddingBottom: "40px",
    },
    sectionTitle: {
      fontSize: "20px",
      marginBottom: "8px",
    },
    sectionDesc: {
      fontSize: "14px",
      marginBottom: "20px",
    },
    primaryBtn: {
      width: "auto",
      padding: "14px 28px",
      fontSize: "16px",
    },
    uploadBtn: {
      width: "auto",
      display: "inline-block",
      padding: "14px 28px",
      fontSize: "16px",
    },
    message: {
      padding: "20px",
      marginBottom: "30px",
    },
    messageText: {
      fontSize: "14px",
    },
    instructions: {
      padding: "20px",
    },
    instructionsTitle: {
      fontSize: "18px",
      marginBottom: "12px",
    },
    instructionsList: {
      fontSize: "14px",
    },
  },

  "@media (max-width: 768px)": {
    menuBtn: {
      display: "block",
    },
    navDesktop: {
      display: "none",
    },
  },
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @media (hover: hover) {
      button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      }

      .uploadBtn:hover {
        background: #059669;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
      }

      .mobileMenuItem:hover {
        background: #f9fafb;
      }
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}
