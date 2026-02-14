"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState("");
  const [processing, setProcessing] = useState(false);

  const teamMembers = ["Arun", "Sreerag", "Rahul"];

  useEffect(() => {
    loadOrder();
  }, [uid]);

  async function loadOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${uid}`);
      const data = await res.json();
      
      if (data.success && data.order) {
        setOrder(data.order);
        setSelectedMember(data.order.teamMember || "");
      }
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  }

  async function startProcessing() {
    if (!selectedMember) {
      alert("⚠️ Please select a team member first");
      return;
    }

    if (order.status === "processing") {
      alert(`⚠️ This order is already being processed by ${order.teamMember}`);
      return;
    }

    try {
      setProcessing(true);

      const res = await fetch(`/api/orders/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "processing",
          teamMember: selectedMember,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        alert(`❌ Failed to claim order: ${data.error}`);
      }
    } catch (error) {
      console.error("Error starting processing:", error);
      alert("❌ Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  async function markComplete() {
    const confirmed = confirm(
      "✅ Mark this order as completed?\n\nThis will finalize the order and it cannot be undone."
    );

    if (!confirmed) return;

    try {
      setProcessing(true);

      const res = await fetch(`/api/orders/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        alert(`❌ Failed to complete order: ${data.error}`);
      }
    } catch (error) {
      console.error("Error completing order:", error);
      alert("❌ Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.wrapper}>
        <nav style={styles.nav}>
          <div style={styles.navBrand}>
            <span style={styles.logo}>🖼️</span>
            <span style={styles.brandText}>What The Frame</span>
          </div>
        </nav>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading order details...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={styles.wrapper}>
        <nav style={styles.nav}>
          <div style={styles.navBrand}>
            <span style={styles.logo}>🖼️</span>
            <span style={styles.brandText}>What The Frame</span>
          </div>
        </nav>
        <div style={styles.errorState}>
          <div style={styles.errorIcon}>❌</div>
          <h2 style={styles.errorTitle}>Order Not Found</h2>
          <p style={styles.errorText}>The order you're looking for doesn't exist.</p>
          <Link href="/" style={styles.backBtn}>
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const isLocked = order.status === "processing" || order.status === "completed";
  const canStartProcessing = order.status === "pending";
  const isCompleted = order.status === "completed";

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

          <Link href="/upload" style={styles.navBtn}>
            + New Order
          </Link>
        </div>
      </nav>

      {/* Order Content */}
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.headerCard}>
          <Link href="/" style={styles.backLink}>
            ← Back to Dashboard
          </Link>

          <div style={styles.orderHeader}>
            <div>
              <h1 style={styles.orderTitle}>Order #{order.orderNumber}</h1>
              <div style={styles.orderMeta}>
                📅 Created {formatDate(order.createdAt)}
              </div>
            </div>

            <div style={getStatusStyle(order.status)}>
              {getStatusIcon(order.status)} {getStatusText(order.status, order.teamMember)}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Order Processing</h3>

          {/* Team Member Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Select Team Member {canStartProcessing && <span style={styles.required}>*</span>}
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              disabled={isLocked || processing}
              style={{
                ...styles.select,
                ...(isLocked ? styles.selectDisabled : {})
              }}
            >
              <option value="">Choose team member...</option>
              {teamMembers.map(member => (
                <option key={member} value={member}>{member}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            {canStartProcessing && (
              <button
                onClick={startProcessing}
                disabled={!selectedMember || processing}
                style={{
                  ...styles.primaryBtn,
                  ...(!selectedMember || processing ? styles.btnDisabled : {})
                }}
              >
                {processing ? (
                  <>
                    <span style={styles.btnSpinner}></span>
                    Claiming Order...
                  </>
                ) : (
                  <>
                    ⚡ Start Processing
                  </>
                )}
              </button>
            )}

            {order.status === "processing" && (
              <div style={styles.processingInfo}>
                <span style={styles.processingIcon}>🔒</span>
                <div>
                  <div style={styles.processingTitle}>Order Claimed</div>
                  <div style={styles.processingText}>
                    {order.teamMember} is currently processing this order
                  </div>
                </div>
              </div>
            )}

            {!isCompleted && (
              <button
                onClick={markComplete}
                disabled={processing}
                style={{
                  ...styles.completeBtn,
                  ...(processing ? styles.btnDisabled : {})
                }}
              >
                {processing ? (
                  <>
                    <span style={styles.btnSpinner}></span>
                    Completing...
                  </>
                ) : (
                  <>
                    ✓ Mark as Completed
                  </>
                )}
              </button>
            )}

            {isCompleted && (
              <div style={styles.completedInfo}>
                <span style={styles.completedIcon}>✅</span>
                <div>
                  <div style={styles.completedTitle}>Order Completed</div>
                  <div style={styles.completedText}>
                    Finished on {formatDate(order.completedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div style={styles.imagesCard}>
          <h3 style={styles.sectionTitle}>
            Design Images ({order.images?.length || 0})
          </h3>

          {order.images && order.images.length > 0 ? (
            <div style={styles.imageGrid}>
              {order.images.map((img, idx) => (
                <div key={idx} style={styles.imageCard}>
                  <div
                    style={{
                      ...styles.imagePreview,
                      backgroundImage: `url(${img.thumbnail || img.url})`
                    }}
                  >
                    <div style={styles.imageOverlay}>
                      <span style={styles.imageNumber}>Image {idx + 1}</span>
                    </div>
                  </div>

                  <div style={styles.imageActions}>
                    
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.imageBtn}
                    >
                      👁️ View
                    </a>
                    
                      href={img.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.imageBtn}
                    >
                      ⬇️ Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noImages}>
              <span style={styles.noImagesIcon}>🖼️</span>
              <p>No images attached to this order</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Helper functions
function getStatusIcon(status) {
  if (status === "completed") return "✅";
  if (status === "processing") return "⚡";
  return "⏳";
}

function getStatusText(status, teamMember) {
  if (status === "completed") return "Completed";
  if (status === "processing") return teamMember ? `Processing by ${teamMember}` : "Processing";
  return "Pending";
}

function getStatusStyle(status) {
  const baseStyle = {
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  };

  if (status === "completed") {
    return { ...baseStyle, background: "#d1fae5", color: "#065f46" };
  }
  if (status === "processing") {
    return { ...baseStyle, background: "#dbeafe", color: "#1e40af" };
  }
  return { ...baseStyle, background: "#fef3c7", color: "#92400e" };
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "Recently";
  }
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
  },

  // Container
  container: {
    maxWidth: "1000px",
    margin: "30px auto 0",
    padding: "0 24px",
  },

  // Header Card
  headerCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
    transition: "all 0.2s",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
  },

  orderTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "8px",
  },

  orderMeta: {
    fontSize: "15px",
    color: "#6b7280",
    fontWeight: "500",
  },

  // Action Card
  actionCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  actionTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "24px",
  },

  formGroup: {
    marginBottom: "24px",
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

  select: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontWeight: "600",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  selectDisabled: {
    background: "#f9fafb",
    cursor: "not-allowed",
    opacity: 0.6,
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  primaryBtn: {
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

  completeBtn: {
    width: "100%",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  btnSpinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  processingInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "#dbeafe",
    borderRadius: "14px",
    border: "2px solid #93c5fd",
  },

  processingIcon: {
    fontSize: "32px",
  },

  processingTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: "4px",
  },

  processingText: {
    fontSize: "14px",
    color: "#1e40af",
  },

  completedInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    background: "#d1fae5",
    borderRadius: "14px",
    border: "2px solid #86efac",
  },

  completedIcon: {
    fontSize: "32px",
  },

  completedTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#065f46",
    marginBottom: "4px",
  },

  completedText: {
    fontSize: "14px",
    color: "#065f46",
  },

  // Images Card
  imagesCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "24px",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },

  imageCard: {
    borderRadius: "16px",
    overflow: "hidden",
    border: "2px solid #e5e7eb",
    transition: "all 0.3s",
  },

  imagePreview: {
    width: "100%",
    height: "240px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    backgroundColor: "#f3f4f6",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "12px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
  },

  imageNumber: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
  },

  imageActions: {
    display: "flex",
    padding: "12px",
    gap: "10px",
    background: "#f9fafb",
  },

  imageBtn: {
    flex: 1,
    padding: "10px",
    textAlign: "center",
    background: "#fff",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "700",
    transition: "all 0.2s",
  },

  noImages: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
  },

  noImagesIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px",
  },

  // Loading State
  loadingState: {
    maxWidth: "400px",
    margin: "80px auto",
    textAlign: "center",
    color: "#fff",
    padding: "40px",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },

  loadingText: {
    fontSize: "16px",
    fontWeight: "600",
  },

  // Error State
  errorState: {
    maxWidth: "400px",
    margin: "80px auto",
    textAlign: "center",
    color: "#fff",
    padding: "40px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
  },

  errorIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },

  errorTitle: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  errorText: {
    fontSize: "16px",
    opacity: 0.9,
    marginBottom: "24px",
  },

  backBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#fff",
    color: "#667eea",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
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

    container: {
      padding: "0 16px",
    },

    headerCard: {
      padding: "20px",
    },

    orderTitle: {
      fontSize: "24px",
    },

    actionCard: {
      padding: "20px",
    },

    imagesCard: {
      padding: "20px",
    },

    imageGrid: {
      gridTemplateColumns: "1fr",
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
    
    select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    button:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    button:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .imageCard:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    
    .imageBtn:hover {
      background: #667eea;
      color: #fff;
      border-color: #667eea;
    }
    
    .backLink:hover {
      transform: translateX(-4px);
    }
  `;
  document.head.appendChild(style);
}
