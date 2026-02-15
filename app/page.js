"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  }

  function getStatusInfo(order) {
    if (order.status === "completed") {
      return { 
        text: "Completed", 
        color: "#10b981",
        bgColor: "#d1fae5",
        icon: "✓"
      };
    }

    if (order.status === "processing") {
      return {
        text: order.teamMember || "Processing",
        color: "#3b82f6",
        bgColor: "#dbeafe",
        icon: "⚡"
      };
    }

    return { 
      text: "Pending", 
      color: "#f59e0b",
      bgColor: "#fef3c7",
      icon: "⏳"
    };
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  return (
    <main style={styles.wrapper}>
      {/* Top Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.logo}>🖼️</span>
          <span style={styles.brandText}>What The Frame</span>
        </div>

        <div style={styles.navRight}>
          <Link href="/" style={{...styles.navBtn, ...styles.navBtnActive}}>
            Dashboard
          </Link>

          <Link href="/upload" style={styles.navBtn}>
            + New Order
          </Link>

          <Link href="/analytics" style={styles.navBtn}>
            📊 Analytics
          </Link>

          <Link href="/recent" style={styles.navBtn}>
            📋 Recent
          </Link>

          <Link href="/settings" style={styles.navBtn}>
            ⚙️ Settings
          </Link>
        </div>
      </nav>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Orders</div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: "#f59e0b"}}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: "#3b82f6"}}>{stats.processing}</div>
          <div style={styles.statLabel}>Processing</div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statNumber, color: "#10b981"}}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterBar}>
        {["all", "pending", "processing", "completed"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              ...(filter === f ? styles.filterBtnActive : {})
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && ` (${stats[f]})`}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h3 style={styles.emptyTitle}>No orders found</h3>
          <p style={styles.emptyText}>
            {filter === "all" 
              ? "Create your first order to get started" 
              : `No ${filter} orders at the moment`}
          </p>
          <Link href="/upload" style={styles.emptyBtn}>
            Create New Order
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredOrders.map((order) => {
            const status = getStatusInfo(order);

            return (
              <Link key={order.uid} href={`/order/${order.uid}`} style={styles.card}>
                {/* Image Preview */}
                {order.images && order.images.length > 0 && (
                  <div style={styles.imagePreview}>
                    {order.images.slice(0, 3).map((img, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          ...styles.previewImg,
                          backgroundImage: `url(${img.thumbnail || img.url})`,
                          zIndex: 3 - idx,
                          left: idx * 12 + 'px',
                        }}
                      />
                    ))}
                    {order.images.length > 3 && (
                      <div style={styles.moreImages}>
                        +{order.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Order Info */}
                <div style={styles.cardContent}>
                  <div style={styles.orderHeader}>
                    <strong style={styles.orderNumber}>#{order.orderNumber}</strong>
                    <span style={{
                      ...styles.statusBadge,
                      color: status.color,
                      background: status.bgColor,
                    }}>
                      {status.icon} {status.text}
                    </span>
                  </div>

                  <div style={styles.orderMeta}>
                    <span style={styles.metaItem}>
                      🖼️ {order.images?.length || 0} images
                    </span>
                    <span style={styles.metaItem}>
                      📅 {formatDate(order.createdAt)}
                    </span>
                    {order.designer && (
                      <span style={styles.metaItem}>
                        ✏️ {order.designer}
                      </span>
                    )}
                  </div>

                  {order.status === "processing" && order.teamMember && (
                    <div style={styles.teamInfo}>
                      👤 {order.teamMember}
                    </div>
                  )}
                </div>

                <div style={styles.cardArrow}>→</div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Refresh Button - Fixed at bottom */}
      <div style={styles.refreshContainer}>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          style={{
            ...styles.refreshBtn,
            ...(refreshing ? styles.refreshBtnLoading : {})
          }}
        >
          {refreshing ? (
            <>
              <span style={styles.refreshSpinner}></span>
              Refreshing...
            </>
          ) : (
            <>
              🔄 Refresh Dashboard
            </>
          )}
        </button>
        <p style={styles.refreshHint}>
          💡 Click to manually refresh and see latest orders
        </p>
      </div>
    </main>
  );
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return "Recently";
  }
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "0 0 120px 0",
  },

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

  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    maxWidth: "1200px",
    margin: "30px auto 0",
    padding: "0 24px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  statNumber: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  filterBar: {
    display: "flex",
    gap: "12px",
    maxWidth: "1200px",
    margin: "24px auto 0",
    padding: "0 24px",
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.3)",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  filterBtnActive: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#667eea",
    borderColor: "rgba(255,255,255,0.95)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "24px auto 0",
    padding: "0 24px",
  },

  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    textDecoration: "none",
    color: "#000",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },

  imagePreview: {
    position: "relative",
    height: "180px",
    marginBottom: "16px",
    borderRadius: "12px",
    overflow: "hidden",
  },

  previewImg: {
    position: "absolute",
    top: 0,
    width: "calc(100% - 24px)",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "12px",
    border: "3px solid #fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.3s",
  },

  moreImages: {
    position: "absolute",
    right: "16px",
    bottom: "16px",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    zIndex: 10,
  },

  cardContent: {
    position: "relative",
    zIndex: 1,
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    gap: "12px",
  },

  orderNumber: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1f2937",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  orderMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },

  metaItem: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },

  teamInfo: {
    padding: "10px",
    background: "#f3f4f6",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  cardArrow: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "24px",
    color: "#d1d5db",
    opacity: 0,
    transition: "all 0.3s",
  },

  loadingState: {
    maxWidth: "1200px",
    margin: "60px auto",
    textAlign: "center",
    color: "#fff",
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

  emptyState: {
    maxWidth: "400px",
    margin: "80px auto",
    textAlign: "center",
    color: "#fff",
    padding: "40px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    border: "2px solid rgba(255,255,255,0.2)",
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },

  emptyTitle: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  emptyText: {
    fontSize: "16px",
    opacity: 0.9,
    marginBottom: "24px",
    lineHeight: "1.6",
  },

  emptyBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#fff",
    color: "#667eea",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    transition: "all 0.2s",
  },

  // Refresh Button - Fixed at bottom
  refreshContainer: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
    textAlign: "center",
  },

  refreshBtn: {
    padding: "16px 32px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    color: "#667eea",
    border: "3px solid #667eea",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  refreshBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  refreshSpinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(102, 126, 234, 0.3)",
    borderTop: "3px solid #667eea",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  refreshHint: {
    marginTop: "8px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },

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
    
    grid: {
      gridTemplateColumns: "1fr",
      padding: "0 16px",
    },
    
    statsBar: {
      gridTemplateColumns: "repeat(2, 1fr)",
      padding: "0 16px",
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
    
    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    }
    
    .card:hover .cardArrow {
      opacity: 1;
      transform: translateY(-50%) translateX(4px);
    }
    
    .card:hover .previewImg {
      transform: scale(1.05);
    }

    .refreshBtn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    }
  `;
  document.head.appendChild(style);
}
