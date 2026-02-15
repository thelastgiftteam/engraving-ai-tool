"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecentPage() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadCompletedOrders();
  }, []);

  async function loadCompletedOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/completed-orders");
      const data = await res.json();
      if (data.success) {
        setCompletedOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to load completed orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatDateTime(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return "Unknown";
    }
  }

  function formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  function isAfterHours(startTime, endTime) {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      const startHour = start.getHours();
      const endHour = end.getHours();
      const isWeekend = start.getDay() === 0 || start.getDay() === 6;
      
      return isWeekend || startHour < 9 || startHour >= 18 || endHour < 9 || endHour >= 18;
    } catch {
      return false;
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
          <Link href="/recent" style={{...styles.navBtn, ...styles.navBtnActive}}>📋 Recent</Link>
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
            <Link href="/recent" style={{...styles.mobileMenuItem, ...styles.mobileMenuItemActive}} onClick={() => setMenuOpen(false)}>
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

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Recent Orders</h1>
        <p style={styles.subtitle}>
          Processing logs for incentive calculation
        </p>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading orders...</p>
          </div>
        ) : completedOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>No Completed Orders</h3>
            <p style={styles.emptyText}>
              Completed orders will appear here
            </p>
            <Link href="/" style={styles.emptyBtn}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats - Compact on Mobile */}
            <div style={styles.statsBar}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{completedOrders.length}</div>
                <div style={styles.statLabel}>Completed</div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statNumber}>
                  {completedOrders.filter(o => isAfterHours(o.claimedAt, o.completedAt)).length}
                </div>
                <div style={styles.statLabel}>After Hours</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statNumber}>
                  {Math.round(
                    completedOrders.reduce((sum, o) => sum + (o.processing_minutes || 0), 0) / 
                    completedOrders.length
                  )}m
                </div>
                <div style={styles.statLabel}>Avg Time</div>
              </div>
            </div>

            {/* Orders - Card View on Mobile, Table on Desktop */}
            <div style={styles.section}>
              <div style={styles.tableHeader}>
                <h2 style={styles.sectionTitle}>Processing Logs</h2>
                <button onClick={loadCompletedOrders} style={styles.refreshBtn}>
                  🔄
                </button>
              </div>

              {/* Mobile Card View */}
              <div style={styles.mobileCards}>
                {completedOrders.map((order, index) => {
                  const afterHours = isAfterHours(order.claimedAt, order.completedAt);
                  
                  return (
                    <div key={order.uid || index} style={styles.orderCard}>
                      <div style={styles.cardHeader}>
                        <Link href={`/order/${order.uid}`} style={styles.orderLink}>
                          #{order.orderNumber}
                        </Link>
                        {afterHours ? (
                          <span style={styles.afterHoursBadge}>🌙 After Hrs</span>
                        ) : (
                          <span style={styles.regularBadge}>☀️ Regular</span>
                        )}
                      </div>
                      
                      <div style={styles.cardBody}>
                        <div style={styles.cardRow}>
                          <span style={styles.cardLabel}>Engraver:</span>
                          <span style={styles.cardValue}>{order.teamMember || "Unknown"}</span>
                        </div>
                        
                        {order.designer && (
                          <div style={styles.cardRow}>
                            <span style={styles.cardLabel}>Designer:</span>
                            <span style={styles.cardValue}>{order.designer}</span>
                          </div>
                        )}
                        
                        <div style={styles.cardRow}>
                          <span style={styles.cardLabel}>Duration:</span>
                          <span style={styles.durationBadge}>
                            {formatDuration(order.processing_minutes || 0)}
                          </span>
                        </div>
                        
                        <div style={styles.cardRow}>
                          <span style={styles.cardLabel}>Completed:</span>
                          <span style={styles.timeText}>{formatDateTime(order.completedAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>Order</th>
                      <th style={styles.th}>Engraver</th>
                      <th style={styles.th}>Designer</th>
                      <th style={styles.th}>Start</th>
                      <th style={styles.th}>End</th>
                      <th style={styles.th}>Duration</th>
                      <th style={styles.th}>Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.map((order, index) => {
                      const afterHours = isAfterHours(order.claimedAt, order.completedAt);
                      
                      return (
                        <tr key={order.uid || index} style={styles.tableRow}>
                          <td style={styles.td}>
                            <Link href={`/order/${order.uid}`} style={styles.orderLink}>
                              #{order.orderNumber}
                            </Link>
                          </td>
                          <td style={styles.td}>
                            <strong style={styles.memberName}>
                              {order.teamMember || "Unknown"}
                            </strong>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.designerName}>
                              {order.designer || "-"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.timeText}>
                              {formatDateTime(order.claimedAt)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.timeText}>
                              {formatDateTime(order.completedAt)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.durationBadge}>
                              {formatDuration(order.processing_minutes || 0)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {afterHours ? (
                              <span style={styles.afterHoursBadge}>🌙 After Hrs</span>
                            ) : (
                              <span style={styles.regularBadge}>☀️ Regular</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Info - Compact */}
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📤 Google Sheets Export</h3>
              <p style={styles.infoText}>
                Data includes: order #, team member, designer, timestamps, duration, and shift type.
              </p>
              <p style={styles.infoNote}>
                💡 After-hours = before 9 AM, after 6 PM, or weekends
              </p>
            </div>
          </>
        )}
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
    maxWidth: "1400px",
    margin: "20px auto 0",
    padding: "0 16px",
  },

  pageTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: "20px",
  },

  loadingState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#fff",
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
    padding: "32px",
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
  },

  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(10px)",
    padding: "16px 12px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "10px",
    color: "#6b7280",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  section: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1f2937",
    margin: 0,
  },

  refreshBtn: {
    padding: "8px 16px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Mobile Card View
  mobileCards: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  orderCard: {
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
  },

  cardBody: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  cardLabel: {
    color: "#6b7280",
    fontWeight: "600",
  },

  cardValue: {
    color: "#1f2937",
    fontWeight: "600",
  },

  // Desktop Table View
  tableContainer: {
    overflowX: "auto",
    display: "none",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeaderRow: {
    background: "#f9fafb",
  },

  th: {
    padding: "12px 10px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    borderBottom: "2px solid #e5e7eb",
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },

  td: {
    padding: "14px 10px",
    fontSize: "13px",
  },

  orderLink: {
    color: "#667eea",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "14px",
    transition: "all 0.2s",
  },

  memberName: {
    color: "#1f2937",
    fontWeight: "700",
  },

  designerName: {
    color: "#6b7280",
    fontSize: "12px",
  },

  timeText: {
    color: "#374151",
    fontSize: "12px",
    fontFamily: "monospace",
  },

  durationBadge: {
    padding: "4px 10px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  afterHoursBadge: {
    padding: "4px 10px",
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  regularBadge: {
    padding: "4px 10px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  infoCard: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  infoTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "12px",
  },

  infoText: {
    fontSize: "13px",
    color: "#374151",
    lineHeight: "1.6",
    marginBottom: "12px",
  },

  infoNote: {
    fontSize: "12px",
    color: "#667eea",
    background: "#f0f9ff",
    padding: "12px",
    borderRadius: "10px",
    border: "2px solid #bfdbfe",
  },

  "@media (min-width: 769px)": {
    container: {
      margin: "30px auto 0",
      padding: "0 24px",
    },
    pageTitle: {
      fontSize: "36px",
      marginBottom: "12px",
    },
    subtitle: {
      fontSize: "16px",
      marginBottom: "30px",
    },
    statsBar: {
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      marginBottom: "30px",
    },
    statCard: {
      padding: "24px",
    },
    statNumber: {
      fontSize: "36px",
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "13px",
    },
    section: {
      padding: "30px",
      borderRadius: "20px",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "24px",
    },
    tableHeader: {
      marginBottom: "24px",
    },
    refreshBtn: {
      padding: "10px 20px",
      fontSize: "14px",
    },
    mobileCards: {
      display: "none",
    },
    tableContainer: {
      display: "block",
    },
    th: {
      padding: "16px 12px",
      fontSize: "12px",
    },
    td: {
      padding: "16px 12px",
      fontSize: "14px",
    },
    infoCard: {
      padding: "30px",
      borderRadius: "20px",
    },
    infoTitle: {
      fontSize: "20px",
      marginBottom: "16px",
    },
    infoText: {
      fontSize: "15px",
      marginBottom: "16px",
    },
    infoNote: {
      fontSize: "14px",
      padding: "16px",
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
    
    @media (hover: hover) {
      .tableRow:hover {
        background: #f9fafb;
      }

      .orderLink:hover {
        text-decoration: underline;
      }

      button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .mobileMenuItem:hover {
        background: #f9fafb;
      }

      .emptyBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    }
  `;
  document.head.appendChild(style);
}
