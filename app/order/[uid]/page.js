"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderPage({ params }) {
  const { uid } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState("");
  const [processing, setProcessing] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [engraverId, setEngraverId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadOrder();
    loadTeamMembers();
  }, [uid]);

  async function loadTeamMembers() {
    try {
      const res = await fetch('/api/employees?role=engraver');
      const data = await res.json();
      
      if (data.success && data.employees) {
        setTeamMembers(data.employees);
      }
    } catch (error) {
      console.error("Failed to load team members:", error);
      setTeamMembers([
        { id: 1, name: 'Arun' },
        { id: 2, name: 'Sreerag' },
        { id: 3, name: 'Rahul' }
      ]);
    }
  }

  async function loadOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${uid}`);
      const data = await res.json();
      
      if (data.success && data.order) {
        setOrder(data.order);
        setSelectedMember(data.order.teamMember || "");
        setEngraverId(data.order.engraverId || "");
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
          engraverId: engraverId,
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
      "✅ Mark as completed?\n\nThis cannot be undone."
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
          <div style={styles.navContent}>
            <div style={styles.navBrand}>
              <span style={styles.logo}>🖼️</span>
              <span style={styles.brandText}>What The Frame</span>
            </div>
          </div>
        </nav>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading order...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={styles.wrapper}>
        <nav style={styles.nav}>
          <div style={styles.navContent}>
            <div style={styles.navBrand}>
              <span style={styles.logo}>🖼️</span>
              <span style={styles.brandText}>What The Frame</span>
            </div>
          </div>
        </nav>
        <div style={styles.errorState}>
          <div style={styles.errorIcon}>❌</div>
          <h2 style={styles.errorTitle}>Order Not Found</h2>
          <p style={styles.errorText}>This order doesn't exist.</p>
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
      {/* Compact Mobile Navigation */}
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
          <Link href="/backup" style={styles.navBtn}>🔄 Backup</Link>
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
              <span style={styles.mobileMenuIcon}>📋</span> Recent Orders
            </Link>
            <Link href="/settings" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>⚙️</span> Settings
            </Link>
            <Link href="/backup" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>🔄</span> Backup
            </Link>
          </div>
        )}
      </nav>

      {/* Order Content */}
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.headerCard}>
          <Link href="/" style={styles.backLink}>
            ← Back
          </Link>

          <div style={styles.orderHeader}>
            <div>
              <h1 style={styles.orderTitle}>#{order.orderNumber}</h1>
              <div style={styles.orderMeta}>
                📅 {formatDate(order.createdAt)}
              </div>
            </div>

            <div style={getStatusStyle(order.status)}>
              {getStatusIcon(order.status)} {getStatusText(order.status)}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Processing</h3>

          {/* Team Member Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Team Member {canStartProcessing && <span style={styles.required}>*</span>}
            </label>
            <select
              value={selectedMember}
              onChange={(e) => {
                const selected = teamMembers.find(m => m.name === e.target.value);
                setSelectedMember(e.target.value);
                setEngraverId(selected?.id || "");
              }}
              disabled={isLocked || processing}
              style={{
                ...styles.select,
                ...(isLocked ? styles.selectDisabled : {})
              }}
            >
              <option value="">Choose team member...</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.name}>{member.name}</option>
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
                    Claiming...
                  </>
                ) : (
                  "⚡ Start Processing"
                )}
              </button>
            )}

            {order.status === "processing" && (
              <div style={styles.processingInfo}>
                <span style={styles.processingIcon}>🔒</span>
                <div>
                  <div style={styles.processingTitle}>Order Claimed</div>
                  <div style={styles.processingText}>
                    {order.teamMember} is processing
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
                  "✓ Mark Complete"
                )}
              </button>
            )}

            {isCompleted && (
              <div style={styles.completedInfo}>
                <span style={styles.completedIcon}>✅</span>
                <div>
                  <div style={styles.completedTitle}>Completed</div>
                  <div style={styles.completedText}>
                    {formatDate(order.completedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Section */}
        <div style={styles.imagesCard}>
          <h3 style={styles.sectionTitle}>
            Images ({order.images?.length || 0})
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
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.imageBtn}
                    >
                      👁️ View
                    </a>
                    <a
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
              <p>No images</p>
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

function getStatusText(status) {
  if (status === "completed") return "Done";
  if (status === "processing") return "Processing";
  return "Pending";
}

function getStatusStyle(status) {
  const baseStyle = {
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
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

  mobileMenuIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },

  container: {
    maxWidth: "1000px",
    margin: "20px auto 0",
    padding: "0 16px",
  },

  headerCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#667eea",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "16px",
    transition: "all 0.2s",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
  },

  orderTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "6px",
  },

  orderMeta: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
  },

  actionCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  actionTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "16px",
  },

  formGroup: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "8px",
  },

  required: {
    color: "#ef4444",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
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
    gap: "12px",
  },

  primaryBtn: {
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  completeBtn: {
    width: "100%",
    padding: "14px 20px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  btnSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  processingInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#dbeafe",
    borderRadius: "12px",
    border: "2px solid #93c5fd",
  },

  processingIcon: {
    fontSize: "24px",
  },

  processingTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#1e40af",
    marginBottom: "2px",
  },

  processingText: {
    fontSize: "12px",
    color: "#1e40af",
  },

  completedInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#d1fae5",
    borderRadius: "12px",
    border: "2px solid #86efac",
  },

  completedIcon: {
    fontSize: "24px",
  },

  completedTitle: {
    fontSize: "14px",
    fontWeight: "800",
    color: "#065f46",
    marginBottom: "2px",
  },

  completedText: {
    fontSize: "12px",
    color: "#065f46",
  },

  imagesCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "16px",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  imageCard: {
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #e5e7eb",
    transition: "all 0.3s",
  },

  imagePreview: {
    width: "100%",
    height: "200px",
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
    padding: "10px",
    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
  },

  imageNumber: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
  },

  imageActions: {
    display: "flex",
    padding: "10px",
    gap: "8px",
    background: "#f9fafb",
  },

  imageBtn: {
    flex: 1,
    padding: "8px",
    textAlign: "center",
    background: "#fff",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#374151",
    fontSize: "12px",
    fontWeight: "700",
    transition: "all 0.2s",
  },

  noImages: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
  },

  noImagesIcon: {
    fontSize: "40px",
    display: "block",
    marginBottom: "12px",
  },

  loadingState: {
    maxWidth: "400px",
    margin: "60px auto",
    textAlign: "center",
    color: "#fff",
    padding: "32px",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 16px",
  },

  loadingText: {
    fontSize: "14px",
    fontWeight: "600",
  },

  errorState: {
    maxWidth: "400px",
    margin: "60px auto",
    textAlign: "center",
    color: "#fff",
    padding: "32px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
  },

  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },

  errorTitle: {
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  errorText: {
    fontSize: "14px",
    opacity: 0.9,
    marginBottom: "20px",
  },

  backBtn: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#fff",
    color: "#667eea",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },

  "@media (min-width: 769px)": {
    container: {
      margin: "30px auto 0",
      padding: "0 24px",
    },
    headerCard: {
      padding: "30px",
      borderRadius: "20px",
      marginBottom: "20px",
    },
    backLink: {
      fontSize: "14px",
      marginBottom: "20px",
    },
    orderTitle: {
      fontSize: "32px",
      marginBottom: "8px",
    },
    orderMeta: {
      fontSize: "15px",
    },
    actionCard: {
      padding: "30px",
      borderRadius: "20px",
      marginBottom: "20px",
    },
    actionTitle: {
      fontSize: "20px",
      marginBottom: "24px",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      fontSize: "15px",
      marginBottom: "10px",
    },
    select: {
      padding: "14px 16px",
      fontSize: "15px",
    },
    buttonGroup: {
      gap: "16px",
    },
    primaryBtn: {
      padding: "16px 24px",
      fontSize: "17px",
    },
    completeBtn: {
      padding: "16px 24px",
      fontSize: "17px",
    },
    processingInfo: {
      padding: "20px",
      gap: "16px",
    },
    processingIcon: {
      fontSize: "32px",
    },
    processingTitle: {
      fontSize: "16px",
      marginBottom: "4px",
    },
    processingText: {
      fontSize: "14px",
    },
    completedInfo: {
      padding: "20px",
      gap: "16px",
    },
    completedIcon: {
      fontSize: "32px",
    },
    completedTitle: {
      fontSize: "16px",
      marginBottom: "4px",
    },
    completedText: {
      fontSize: "14px",
    },
    imagesCard: {
      padding: "30px",
      borderRadius: "20px",
    },
    sectionTitle: {
      fontSize: "20px",
      marginBottom: "24px",
    },
    imageGrid: {
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
    },
    imagePreview: {
      height: "240px",
    },
    imageOverlay: {
      padding: "12px",
    },
    imageNumber: {
      fontSize: "14px",
    },
    imageActions: {
      padding: "12px",
      gap: "10px",
    },
    imageBtn: {
      padding: "10px",
      fontSize: "14px",
    },
    noImages: {
      padding: "60px 20px",
    },
    noImagesIcon: {
      fontSize: "48px",
      marginBottom: "16px",
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
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    @media (hover: hover) {
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

      .mobileMenuItem:hover {
        background: #f9fafb;
      }
    }
  `;
  document.head.appendChild(style);
}
