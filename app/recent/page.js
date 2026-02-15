"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecentPage() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        year: 'numeric',
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
      
      // After hours = before 9 AM or after 6 PM or weekends
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

          <Link href="/analytics" style={styles.navBtn}>
            📊 Analytics
          </Link>

          <Link href="/recent" style={{...styles.navBtn, ...styles.navBtnActive}}>
            📋 Recent
          </Link>

          <Link href="/settings" style={styles.navBtn}>
            ⚙️ Settings
          </Link>
        </div>
      </nav>

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Recent Completed Orders</h1>
        <p style={styles.subtitle}>
          Processing logs with timestamps for incentive calculation
        </p>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading completed orders...</p>
          </div>
        ) : completedOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>No Completed Orders Yet</h3>
            <p style={styles.emptyText}>
              Completed orders will appear here with full processing details
            </p>
            <Link href="/" style={styles.emptyBtn}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div style={styles.statsBar}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{completedOrders.length}</div>
                <div style={styles.statLabel}>Total Completed</div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statNumber}>
                  {completedOrders.filter(o => isAfterHours(o.claimed_at, o.completed_at)).length}
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

            {/* Orders Table */}
            <div style={styles.section}>
              <div style={styles.tableHeader}>
                <h2 style={styles.sectionTitle}>Processing Logs</h2>
                <button onClick={loadCompletedOrders} style={styles.refreshBtn}>
                  🔄 Refresh
                </button>
              </div>

              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>Order #</th>
                      <th style={styles.th}>Team Member</th>
                      <th style={styles.th}>Designer</th>
                      <th style={styles.th}>Start Time</th>
                      <th style={styles.th}>End Time</th>
                      <th style={styles.th}>Duration</th>
                      <th style={styles.th}>Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.map((order, index) => {
                      const afterHours = isAfterHours(order.claimed_at, order.completed_at);
                      
                      return (
                        <tr key={order.uid || index} style={styles.tableRow}>
                          <td style={styles.td}>
                            <Link href={`/order/${order.uid}`} style={styles.orderLink}>
                              #{order.order_number}
                            </Link>
                          </td>
                          <td style={styles.td}>
                            <strong style={styles.memberName}>
                              {order.engraver_name || "Unknown"}
                            </strong>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.designerName}>
                              {order.designer_name || "-"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.timeText}>
                              {formatDateTime(order.claimed_at)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.timeText}>
                              {formatDateTime(order.completed_at)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.durationBadge}>
                              {formatDuration(order.processing_minutes || 0)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {afterHours ? (
                              <span style={styles.afterHoursBadge}>
                                🌙 After Hours
                              </span>
                            ) : (
                              <span style={styles.regularBadge}>
                                ☀️ Regular
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Info */}
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📤 Export to Google Sheets</h3>
              <p style={styles.infoText}>
                This data is ready to be exported to Google Sheets for incentive calculation.
                Each row includes:
              </p>
              <ul style={styles.infoList}>
                <li>Order number</li>
                <li>Team member (engraver) name</li>
                <li>Designer name</li>
                <li>Start timestamp (when claimed)</li>
                <li>End timestamp (when completed)</li>
                <li>Total processing duration</li>
                <li>Shift type (regular hours vs after hours)</li>
                <li>Product types (from order images)</li>
              </ul>
              <p style={styles.infoNote}>
                💡 <strong>Tip:</strong> After-hours work is automatically detected 
                (before 9 AM, after 6 PM, or weekends) for incentive calculation.
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

  navBtnActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },

  container: {
    maxWidth: "1400px",
    margin: "30px auto 0",
    padding: "0 24px",
  },

  pageTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: "12px",
  },

  subtitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: "30px",
  },

  loadingState: {
    textAlign: "center",
    padding: "60px 20px",
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
  },

  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  statNumber: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "8px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  section: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },

  sectionTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    margin: 0,
  },

  refreshBtn: {
    padding: "10px 20px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeaderRow: {
    background: "#f9fafb",
  },

  th: {
    padding: "16px 12px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #e5e7eb",
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },

  td: {
    padding: "16px 12px",
    fontSize: "14px",
  },

  orderLink: {
    color: "#667eea",
    fontWeight: "700",
    textDecoration: "none",
    transition: "all 0.2s",
  },

  memberName: {
    color: "#1f2937",
    fontWeight: "700",
  },

  designerName: {
    color: "#6b7280",
    fontSize: "13px",
  },

  timeText: {
    color: "#374151",
    fontSize: "13px",
    fontFamily: "monospace",
  },

  durationBadge: {
    padding: "6px 12px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  afterHoursBadge: {
    padding: "6px 12px",
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  regularBadge: {
    padding: "6px 12px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  infoCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  infoTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "16px",
  },

  infoText: {
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
    marginBottom: "12px",
  },

  infoList: {
    paddingLeft: "24px",
    marginTop: "12px",
    marginBottom: "16px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  infoNote: {
    fontSize: "14px",
    color: "#667eea",
    background: "#f0f9ff",
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #bfdbfe",
    marginTop: "16px",
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

    container: {
      padding: "0 16px",
    },

    section: {
      padding: "20px",
    },

    table: {
      fontSize: "12px",
    },

    th: {
      padding: "12px 8px",
      fontSize: "10px",
    },

    td: {
      padding: "12px 8px",
      fontSize: "12px",
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
  `;
  document.head.appendChild(style);
}
