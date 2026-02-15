"use client";

import { useState } from "react";

export default function BackupPage() {
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState("");
 
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
          `✅ Data restored successfully!\n\n` +
          `Orders: ${result.stats.orders}\n` +
          `Employees: ${result.stats.employees}\n` +
          `Product Types: ${result.stats.productTypes}\n` +
          `Logs: ${result.stats.processingLogs}`
        );
      } else {
        setMessage("⚠️ " + result.message + "\n\nResults: " + JSON.stringify(result.results, null, 2));
      }
    } catch (error) {
      setMessage("❌ Failed to restore: " + error.message);
    } finally {
      setRestoring(false);
    }
  }

  return (
    <main style={styles.wrapper}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.logo}>🖼️</span>
          <span style={styles.brandText}>What The Frame</span>
        </div>
        <a href="/" style={styles.navBtn}>← Back</a>
      </nav>

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🔄 Backup & Restore</h1>
          <p style={styles.subtitle}>
            Use this page to backup your data before deployments and restore it after.
          </p>

          <div style={styles.warning}>
            <span style={styles.warningIcon}>⚠️</span>
            <div>
              <strong>Important:</strong> Always create a backup before making code changes or redeploying!
            </div>
          </div>

          {/* Backup Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📥 Download Backup</h2>
            <p style={styles.sectionDesc}>
              Download a JSON file containing all your orders, employees, product types, and logs.
            </p>
            <button onClick={downloadBackup} style={styles.primaryBtn}>
              ⬇️ Download Backup
            </button>
          </div>

          {/* Restore Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📤 Restore from Backup</h2>
            <p style={styles.sectionDesc}>
              Upload a previously downloaded backup file to restore your data.
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
                {restoring ? "⏳ Restoring..." : "📁 Choose Backup File"}
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
            <h3 style={styles.instructionsTitle}>📋 How to Use:</h3>
            <ol style={styles.instructionsList}>
              <li><strong>Before Deployment:</strong> Click "Download Backup" to save your data</li>
              <li><strong>Make Changes:</strong> Update your code and push to GitHub</li>
              <li><strong>After Deployment:</strong> Come back here and click "Choose Backup File"</li>
              <li><strong>Select File:</strong> Choose the JSON file you downloaded in step 1</li>
              <li><strong>Done!</strong> Your data is restored</li>
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
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    fontSize: "32px",
  },
  brandText: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
  },
  navBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
  },
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "0 20px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "30px",
  },
  warning: {
    display: "flex",
    gap: "12px",
    padding: "16px",
    background: "#fef3c7",
    border: "2px solid #fbbf24",
    borderRadius: "12px",
    marginBottom: "30px",
    color: "#92400e",
  },
  warningIcon: {
    fontSize: "24px",
  },
  section: {
    marginBottom: "40px",
    paddingBottom: "40px",
    borderBottom: "2px solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1f2937",
  },
  sectionDesc: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },
  primaryBtn: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
  },
  uploadLabel: {
    display: "inline-block",
    cursor: "pointer",
  },
  fileInput: {
    display: "none",
  },
  uploadBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#10b981",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
  },
  message: {
    padding: "20px",
    background: "#f3f4f6",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  messageText: {
    fontSize: "14px",
    fontFamily: "monospace",
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#1f2937",
  },
  instructions: {
    background: "#eff6ff",
    padding: "20px",
    borderRadius: "12px",
  },
  instructionsTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1e40af",
  },
  instructionsList: {
    paddingLeft: "20px",
    margin: 0,
    color: "#1e40af",
  },
};
