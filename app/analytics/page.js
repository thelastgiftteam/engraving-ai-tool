"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({ teamStats: [] });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?period=${period}`);
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalOrders = analytics.teamStats.reduce((sum, stat) => sum + stat.completed_orders, 0);
  const avgProcessingTime = analytics.teamStats.length > 0
    ? Math.round(
        analytics.teamStats.reduce((sum, stat) => sum + stat.avg_processing_minutes, 0) / 
        analytics.teamStats.length
      )
    : 0;

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
          <Link href="/analytics" style={{...styles.navBtn, ...styles.navBtnActive}}>📊 Analytics</Link>
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
            <Link href="/analytics" style={{...styles.mobileMenuItem, ...styles.mobileMenuItemActive}} onClick={() => setMenuOpen(false)}>
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

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Team Analytics</h1>

        {/* Period Filter - 2x2 Grid on Mobile */}
        <div style={styles.periodFilter}>
          <button
            onClick={() => setPeriod("day")}
            style={{
              ...styles.periodBtn,
              ...(period === "day" ? styles.periodBtnActive : {})
            }}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod("week")}
            style={{
              ...styles.periodBtn,
              ...(period === "week" ? styles.periodBtnActive : {})
            }}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("month")}
            style={{
              ...styles.periodBtn,
              ...(period === "month" ? styles.periodBtnActive : {})
            }}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("all")}
            style={{
              ...styles.periodBtn,
              ...(period === "all" ? styles.periodBtnActive : {})
            }}
          >
            All Time
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards - Compact on Mobile */}
            <div style={styles.summaryCards}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryIcon}>✅</div>
                <div style={styles.summaryNumber}>{totalOrders}</div>
                <div style={styles.summaryLabel}>Completed</div>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryIcon}>⏱️</div>
                <div style={styles.summaryNumber}>{avgProcessingTime}m</div>
                <div style={styles.summaryLabel}>Avg Time</div>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryIcon}>👥</div>
                <div style={styles.summaryNumber}>{analytics.teamStats.length}</div>
                <div style={styles.summaryLabel}>Team Members</div>
              </div>
            </div>

            {/* Team Performance Table */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Team Performance</h2>

              {analytics.teamStats.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📊</div>
                  <p style={styles.emptyText}>
                    No completed orders in this period yet.
                  </p>
                  <Link href="/upload" style={styles.emptyBtn}>
                    Create New Order
                  </Link>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>#</th>
                        <th style={styles.tableHeader}>Member</th>
                        <th style={styles.tableHeader}>Orders</th>
                        <th style={styles.tableHeader}>Avg</th>
                        <th style={styles.tableHeader}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.teamStats.map((stat, index) => {
                        const performanceScore = stat.completed_orders > 0 
                          ? Math.min(100, (stat.completed_orders / totalOrders) * 100)
                          : 0;
                        
                        return (
                          <tr key={stat.name} style={styles.tableRow}>
                            <td style={styles.tableCell}>
                              <div style={styles.rankBadge}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
                              </div>
                            </td>
                            <td style={styles.tableCell}>
                              <strong style={styles.memberName}>{stat.name}</strong>
                            </td>
                            <td style={styles.tableCell}>
                              <span style={styles.orderCount}>{stat.completed_orders}</span>
                            </td>
                            <td style={styles.tableCell}>
                              <span style={styles.timeValue}>{Math.round(stat.avg_processing_minutes)}m</span>
                            </td>
                            <td style={styles.tableCell}>
                              <div style={styles.performanceContainer}>
                                <div style={styles.performanceBar}>
                                  <div 
                                    style={{
                                      ...styles.performanceFill,
                                      width: `${performanceScore}%`
                                    }}
                                  />
                                </div>
                                <span style={styles.performanceText}>{Math.round(performanceScore)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Insights - Compact */}
            <div style={styles.insightsCard}>
              <h3 style={styles.insightsTitle}>💡 Insights</h3>
              <ul style={styles.insightsList}>
                {analytics.teamStats.length > 0 && (
                  <>
                    <li>
                      <strong>{analytics.teamStats[0]?.name}</strong> leads with{" "}
                      <strong>{analytics.teamStats[0]?.completed_orders} orders</strong>
                    </li>
                    <li>
                      Average time: <strong>{avgProcessingTime} minutes</strong>
                    </li>
                    <li>
                      Total output: <strong>{totalOrders} orders</strong>
                    </li>
                  </>
                )}
                {analytics.teamStats.length === 0 && (
                  <li>Start completing orders to see insights</li>
                )}
              </ul>
            </div>

            {/* Export Info - Compact */}
            <div style={styles.infoBox}>
              <strong style={styles.infoTitle}>📤 Google Sheets Export</strong>
              <p style={styles.infoText}>
                All data auto-logs to Google Sheets for incentive calculation.
              </p>
              <Link href="/recent" style={styles.viewLogsBtn}>
                View Logs →
              </Link>
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
    maxWidth: "1200px",
    margin: "20px auto 0",
    padding: "0 16px",
  },

  pageTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: "20px",
  },

  periodFilter: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },

  periodBtn: {
    padding: "10px 16px",
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.4)",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  periodBtnActive: {
    background: "rgba(255, 255, 255, 0.98)",
    color: "#667eea",
    borderColor: "rgba(255,255,255,0.98)",
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

  summaryCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },

  summaryCard: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "14px",
    padding: "16px 12px",
    textAlign: "center",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  summaryIcon: {
    fontSize: "28px",
    marginBottom: "8px",
  },

  summaryNumber: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "4px",
  },

  summaryLabel: {
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

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "16px",
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

  tableHeader: {
    padding: "10px 8px",
    textAlign: "left",
    fontSize: "10px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },

  tableCell: {
    padding: "14px 8px",
  },

  rankBadge: {
    fontSize: "18px",
    fontWeight: "800",
  },

  memberName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
  },

  orderCount: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#667eea",
  },

  timeValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
  },

  performanceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  performanceBar: {
    width: "100%",
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "3px",
    overflow: "hidden",
  },

  performanceFill: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    transition: "width 0.5s ease",
  },

  performanceText: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#667eea",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },

  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },

  emptyBtn: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#667eea",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
  },

  insightsCard: {
    background: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "16px",
  },

  insightsTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#166534",
    marginBottom: "12px",
  },

  insightsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "13px",
    color: "#166534",
    lineHeight: "1.5",
  },

  infoBox: {
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  infoTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "8px",
    display: "block",
  },

  infoText: {
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.6",
    marginBottom: "12px",
  },

  viewLogsBtn: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#667eea",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "13px",
  },

  "@media (min-width: 769px)": {
    container: {
      margin: "30px auto 0",
      padding: "0 24px",
    },
    pageTitle: {
      fontSize: "36px",
      marginBottom: "30px",
    },
    periodFilter: {
      display: "flex",
      gap: "12px",
      justifyContent: "center",
      marginBottom: "30px",
    },
    periodBtn: {
      padding: "12px 24px",
      fontSize: "15px",
    },
    summaryCards: {
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginBottom: "30px",
    },
    summaryCard: {
      padding: "30px",
    },
    summaryIcon: {
      fontSize: "40px",
      marginBottom: "12px",
    },
    summaryNumber: {
      fontSize: "36px",
      marginBottom: "8px",
    },
    summaryLabel: {
      fontSize: "14px",
    },
    section: {
      padding: "30px",
      borderRadius: "20px",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "24px",
      marginBottom: "24px",
    },
    tableHeader: {
      padding: "16px",
      fontSize: "13px",
    },
    tableCell: {
      padding: "20px 16px",
    },
    insightsCard: {
      padding: "24px",
      borderRadius: "20px",
      marginBottom: "24px",
    },
    insightsTitle: {
      fontSize: "20px",
      marginBottom: "16px",
    },
    insightsList: {
      gap: "12px",
      fontSize: "15px",
    },
    infoBox: {
      padding: "24px",
      borderRadius: "20px",
    },
    infoTitle: {
      fontSize: "16px",
      marginBottom: "12px",
    },
    infoText: {
      fontSize: "14px",
      marginBottom: "16px",
    },
    viewLogsBtn: {
      padding: "12px 24px",
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
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (hover: hover) {
      .tableRow:hover {
        background: #f9fafb;
      }

      button:hover:not(:disabled) {
        transform: translateY(-2px);
      }

      .mobileMenuItem:hover {
        background: #f9fafb;
      }

      .emptyBtn:hover, .viewLogsBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    }
  `;
  document.head.appendChild(style);
}
