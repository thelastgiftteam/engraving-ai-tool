"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [links, setLinks] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addField() {
    setLinks([...links, ""]);
  }

  function removeField(index) {
    if (links.length === 1) return; // Keep at least one field
    const copy = [...links];
    copy.splice(index, 1);
    setLinks(copy);
  }

  function updateLink(i, value) {
    const copy = [...links];
    copy[i] = value;
    setLinks(copy);
    setError(""); // Clear error when user types
  }

  async function submit() {
    setError("");

    // Validation
    if (!orderId.trim()) {
      setError("Please enter an order number");
      return;
    }

    const validLinks = links.filter(l => l.trim() !== "");
    if (validLinks.length === 0) {
      setError("Please add at least one image link");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderId.trim(),
          images: validLinks,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Success! Navigate to the new order
        router.push(`/order/${data.order.uid}`);
      } else {
        setError(data.error || "Failed to create order");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main style={styles.wrapper}>
      {/* Top Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.logo}>🖼️</span>
          <span style={styles.brandText}>What The Frame</span>
        </div>

        <div style={styles.navRight}>
          <Link href="/" style={styles.navBtn}>
            Dashboard
          </Link>

          <Link href="/upload" style={{...styles.navBtn, ...styles.navBtnActive}}>
            + New Order
          </Link>
        </div>
      </nav>

      {/* Form Container */}
      <div style={styles.container}>
        <div style={styles.formCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create New Order</h1>
            <p style={styles.subtitle}>
              Enter the Shopify order number and paste Google Drive image links
            </p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Order Number Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Order Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., #1234 or WTF-1234"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setError("");
              }}
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Image Links Section */}
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>
                Google Drive Image Links <span style={styles.required}>*</span>
              </label>
              <button onClick={addField} style={styles.addBtn} disabled={loading}>
                + Add Another
              </button>
            </div>

            <div style={styles.linksList}>
              {links.map((link, i) => (
                <div key={i} style={styles.linkRow}>
                  <input
                    type="url"
                    placeholder="Paste Google Drive link here"
                    value={link}
                    onChange={(e) => updateLink(i, e.target.value)}
                    style={styles.input}
                    disabled={loading}
                  />
                  {links.length > 1 && (
                    <button
                      onClick={() => removeField(i)}
                      style={styles.removeBtn}
                      disabled={loading}
                      title="Remove this link"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.helpText}>
              💡 Tip: Right-click an image in Google Drive → Get link → Copy and paste here
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submit}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnLoading : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Creating Order...
              </>
            ) : (
              "Create Order"
            )}
          </button>

          {/* Info Box */}
          <div style={styles.infoBox}>
            <strong>📋 What happens next?</strong>
            <ol style={styles.infoList}>
              <li>Your order will appear on the dashboard as "Pending"</li>
              <li>Team members can claim and start processing the order</li>
              <li>Once engraving is done, they'll mark it as "Completed"</li>
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

  // Navigation
  nav: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    fontSize: "28px",
  },

  brandText: {
    fontSize: "20px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  navRight: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  navBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    background: "transparent",
    color: "#1f2937",
    border: "none",
    cursor: "pointer",
  },

  navBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },

  // Container
  container: {
    maxWidth: "700px",
    margin: "40px auto 0",
    padding: "0 24px",
  },

  formCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },

  header: {
    marginBottom: "32px",
    textAlign: "center",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  // Error Box
  errorBox: {
    background: "#fef2f2",
    border: "2px solid #fca5a5",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  errorIcon: {
    fontSize: "20px",
  },

  // Form Groups
  formGroup: {
    marginBottom: "28px",
  },

  label: {
    display: "block",
    fontSize: "15px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "10px",
  },

  required: {
    color: "#ef4444",
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
  },

  linksList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  linkRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  addBtn: {
    padding: "8px 16px",
    background: "#f3f4f6",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  removeBtn: {
    width: "40px",
    height: "48px",
    background: "#fee2e2",
    border: "2px solid #fecaca",
    borderRadius: "10px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#dc2626",
    cursor: "pointer",
    transition: "all 0.2s",
    flexShrink: 0,
  },

  helpText: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "10px",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },

  // Submit Button
  submitBtn: {
    width: "100%",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  submitBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  // Info Box
  infoBox: {
    marginTop: "32px",
    padding: "20px",
    background: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "14px",
    fontSize: "14px",
    color: "#166534",
  },

  infoList: {
    marginTop: "12px",
    paddingLeft: "20px",
    lineHeight: "1.8",
  },

  // Responsive
  "@media (max-width: 768px)": {
    nav: {
      flexDirection: "column",
      gap: "16px",
      padding: "16px",
    },

    navRight: {
      width: "100%",
      justifyContent: "center",
    },

    formCard: {
      padding: "24px",
      borderRadius: "20px",
    },

    title: {
      fontSize: "26px",
    },

    container: {
      padding: "0 16px",
    },
  },
};

// Add CSS animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    input:disabled {
      background: #f9fafb;
      cursor: not-allowed;
    }
    
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    
    button:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .submitBtn:hover:not(:disabled) {
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
      transform: translateY(-3px);
    }
  `;
  document.head.appendChild(style);
}
