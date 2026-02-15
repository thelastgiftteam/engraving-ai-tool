"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href="/" style={{...styles.navBtn, ...styles.navBtnActive}}>Dashboard</Link>
          <Link href="/upload" style={styles.navBtn}>+ New Order</Link>
          <Link href="/analytics" style={styles.navBtn}>📊 Analytics</Link>
          <Link href="/recent" style={styles.navBtn}>📋 Recent</Link>
          <Link href="/settings" style={styles.navBtn}>⚙️ Settings</Link>
          <Link href="/backup" style={styles.navBtn}>🔄 Backup</Link>
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
            <Link href="/backup" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>🔄</span> Backup
            </Link>
          </div>
        )}
      </nav>

      {/* Compact Stats - 2x2 Grid on Mobile */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total</div>
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

      {/* Compact Filter Tabs */}
      <div style={styles.filterBar}>
        <button
          onClick={() => setFilter("all")}
          style={{
            ...styles.filterBtn,
            ...(filter === "all" ? styles.filterBtnActive : {})
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          style={{
            ...styles.filterBtn,
            ...(filter === "pending" ? styles.filterBtnActive : {})
          }}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilter("processing")}
          style={{
            ...styles.filterBtn,
            ...(filter === "processing" ? styles.filterBtnActive : {})
          }}
        >
          Processing ({stats.processing})
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            ...styles.filterBtn,
            ...(filter === "completed" ? styles.filterBtnActive : {})
          }}
        >
          Completed ({stats.completed})
        </button>
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
                {/* Compact Image Preview */}
                {order.images && order.images.length > 0 && (
                  <div style={styles.imagePreview}>
                    <div 
                      style={{
                        ...styles.previewImg,
                        backgroundImage: `url(${order.images[0].thumbnail || order.images[0].url})`
                      }}
                    />
                    {order.images.length > 1 && (
                      <div style={styles.imageCount}>
                        +{order.images.length - 1}
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
                      🖼️ {order.images?.length || 0} • 📅 {formatDate(order.createdAt)}
                    </span>
                    {order.designer && (
                      <span style={styles.metaItem}>
                        ✏️ {order.designer}
                      </span>
                    )}
                    {order.status === "processing" && order.teamMember && (
                      <span style={styles.metaItem}>
                        👤 {order.teamMember}
                      </span>
                    )}
                  </div>
                </div>

                <div style={styles.cardArrow}>→</div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Floating Refresh Button - Non-blocking */}
      <button 
        onClick={handleRefresh} 
        disabled={refreshing}
        style={{
          ...styles.floatingRefresh,
          ...(refreshing ? styles.floatingRefreshLoading : {})
        }}
        title="Refresh dashboard"
      >
        {refreshing ? "⏳" : "🔄"}
      </button>
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
    paddingBottom: "80px",
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

  mobileMenuIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },

  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    maxWidth: "1200px",
    margin: "16px auto 0",
    padding: "0 16px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    padding: "16px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "2px",
  },

  statLabel: {
    fontSize: "11px",
    color: "#6b7280",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  filterBar: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    maxWidth: "1200px",
    margin: "16px auto 0",
    padding: "0 16px",
  },

  filterBtn: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "2px solid rgba(255,255,255,0.4)",
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },

  filterBtnActive: {
    background: "rgba(255, 255, 255, 0.98)",
    color: "#667eea",
    borderColor: "rgba(255,255,255,0.98)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
    maxWidth: "1200px",
    margin: "16px auto 0",
    padding: "0 16px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "14px",
    textDecoration: "none",
    color: "#000",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
    transition: "all 0.3s",
    display: "flex",
    gap: "12px",
    position: "relative",
  },

  imagePreview: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
  },

  previewImg: {
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#f3f4f6",
  },

  imageCount: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "700",
  },

  cardContent: {
    flex: 1,
    minWidth: 0,
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    gap: "8px",
  },

  orderNumber: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1f2937",
    whiteSpace: "nowrap",
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  orderMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  metaItem: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
  },

  cardArrow: {
    fontSize: "20px",
    color: "#d1d5db",
    alignSelf: "center",
    opacity: 0,
    transition: "all 0.3s",
  },

  loadingState: {
    maxWidth: "1200px",
    margin: "60px auto",
    textAlign: "center",
    color: "#fff",
    padding: "0 16px",
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

  emptyState: {
    maxWidth: "400px",
    margin: "60px auto",
    textAlign: "center",
    color: "#fff",
    padding: "32px 16px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: "2px solid rgba(255,255,255,0.25)",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  emptyText: {
    fontSize: "14px",
    opacity: 0.9,
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  emptyBtn: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#fff",
    color: "#667eea",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },

  floatingRefresh: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.5)",
    transition: "all 0.3s",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  floatingRefreshLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  "@media (min-width: 769px)": {
    statsBar: {
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "16px",
    },
    filterBar: {
      display: "flex",
      gap: "12px",
    },
    grid: {
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "20px",
    },
    card: {
      flexDirection: "column",
    },
    imagePreview: {
      width: "100%",
      height: "140px",
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

// Add animations
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (hover: hover) {
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      }
      
      .card:hover .cardArrow {
        opacity: 1;
        transform: translateX(4px);
      }

      .floatingRefresh:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
      }

      .mobileMenuItem:hover {
        background: #f9fafb;
      }

      .emptyBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      }
    }
    
    .floatingRefresh:active:not(:disabled) {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
}
