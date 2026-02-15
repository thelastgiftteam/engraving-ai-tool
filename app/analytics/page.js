"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({ teamStats: [] });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

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

          <Link href="/analytics" style={{...styles.navBtn, ...styles.navBtnActive}}>
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

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Team Performance Analytics</h1>

        {/* Period Filter */}
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
            {/* Summary Cards */}
            <div style={styles.summaryCards}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryIcon}>✅</div>
                <div style={styles.summaryNumber}>{totalOrders}</div>
                <div style={styles.summaryLabel}>Orders Completed</div>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryIcon}>⏱️</div>
                <div style={styles.summaryNumber}>{avgProcessingTime}m</div>
                <div style={styles.summaryLabel}>Avg Processing Time</div>
              </div>

              <div style={styles.summaryCard}>
                <div style={styles.summaryIcon}>👥</div>
                <div style={styles.summaryNumber}>{analytics.teamStats.length}</div>
                <div style={styles.summaryLabel}>Active Team Members</div>
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
                        <th style={styles.tableHeader}>Rank</th>
                        <th style={styles.tableHeader}>Team Member</th>
                        <th style={styles.tableHeader}>Orders Completed</th>
                        <th style={styles.tableHeader}>Avg Time</th>
                        <th style={styles.tableHeader}>Performance</th>
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
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
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
                              <div style={styles.performanceBar}>
                                <div 
                                  style={{
                                    ...styles.performanceFill,
                                    width: `${performanceScore}%`
                                  }}
                                />
                              </div>
                              <span style={styles.performanceText}>{Math.round(performanceScore)}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Insights */}
            <div style={styles.insightsCard}>
              <h3 style={styles.insightsTitle}>💡 Insights</h3>
              <ul style={styles.insightsList}>
                {analytics.teamStats.length > 0 && (
                  <>
                    <li>
                      <strong>{analytics.teamStats[0]?.name}</strong> is the top performer with{" "}
                      <strong>{analytics.teamStats[0]?.completed_orders} orders</strong> completed
                    </li>
                    <li>
                      Average processing time is <strong>{avgProcessingTime} minutes</strong> per order
                    </li>
                    <li>
                      Total team output: <strong>{totalOrders} orders</strong> in this period
                    </li>
                  </>
                )}
                {analytics.teamStats.length === 0 && (
                  <li>Start completing orders to see performance insights</li>
                )}
              </ul>
            </div>

            {/* Export Info */}
            <div style={styles.infoBox}>
              <strong>📤 Google Sheets Export</strong>
              <p style={styles.infoText}>
                All processing data (employee, order, start time, end time, duration, product type) 
                is automatically logged and ready for Google Sheets export for incentive calculation.
              </p>
              <Link href="/recent" style={styles.viewLogsBtn}>
                View Processing Logs →
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
    maxWidth: "1200px",
    margin: "30px auto 0",
    padding: "0 24px",
  },

  pageTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: "30px",
  },

  periodFilter: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  periodBtn: {
    padding: "12px 24px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  periodBtnActive: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#667eea",
    borderColor: "rgba(255,255,255,0.95)",
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

  summaryCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  summaryCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  summaryIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },

  summaryNumber: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "8px",
  },

  summaryLabel: {
    fontSize: "14px",
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

  sectionTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "24px",
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
    padding: "16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },

  tableCell: {
    padding: "20px 16px",
  },

  rankBadge: {
    fontSize: "24px",
    fontWeight: "800",
  },

  memberName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1f2937",
  },

  orderCount: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#667eea",
  },

  timeValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#6b7280",
  },

  performanceBar: {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "6px",
  },

  performanceFill: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    transition: "width 0.5s ease",
  },

  performanceText: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#667eea",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },

  emptyText: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "24px",
  },

  emptyBtn: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#667eea",
    color: "#fff",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "16px",
  },

  insightsCard: {
    background: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "24px",
  },

  insightsTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#166534",
    marginBottom: "16px",
  },

  insightsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  infoBox: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  infoText: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "12px",
    marginBottom: "16px",
  },

  viewLogsBtn: {
    display: "inline-block",
    padding: "12px 24px",
    background: "#667eea",
    color: "#fff",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "14px",
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
      fontSize: "14px",
    },

    tableHeader: {
      padding: "12px 8px",
      fontSize: "11px",
    },

    tableCell: {
      padding: "16px 8px",
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

    button:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
}
