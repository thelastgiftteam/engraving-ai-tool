"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [employees, setEmployees] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Employee form
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("engraver");
  const [addingEmployee, setAddingEmployee] = useState(false);

  // Product form
  const [newProductName, setNewProductName] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      const [employeesRes, productsRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/product-types")
      ]);

      const employeesData = await employeesRes.json();
      const productsData = await productsRes.json();

      if (employeesData.success) setEmployees(employeesData.employees);
      if (productsData.success) setProductTypes(productsData.productTypes);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addEmployee(e) {
    e.preventDefault();
    
    if (!newEmployeeName.trim()) {
      alert("Please enter employee name");
      return;
    }

    try {
      setAddingEmployee(true);

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEmployeeName.trim(),
          role: newEmployeeRole
        })
      });

      const data = await res.json();

      if (data.success) {
        setEmployees([...employees, data.employee]);
        setNewEmployeeName("");
        setNewEmployeeRole("engraver");
      } else {
        alert("Failed to add employee: " + data.error);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Network error. Please try again.");
    } finally {
      setAddingEmployee(false);
    }
  }

  async function removeEmployee(id, name) {
    const confirmed = confirm(`Remove ${name}?`);
    if (!confirmed) return;

    try {
      const res = await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (data.success) {
        setEmployees(employees.filter(e => e.id !== id));
      } else {
        alert("Failed to remove: " + data.error);
      }
    } catch (error) {
      console.error("Error removing employee:", error);
      alert("Network error. Please try again.");
    }
  }

  async function addProductType(e) {
    e.preventDefault();
    
    if (!newProductName.trim()) {
      alert("Please enter product name");
      return;
    }

    try {
      setAddingProduct(true);

      const res = await fetch("/api/product-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProductName.trim()
        })
      });

      const data = await res.json();

      if (data.success) {
        setProductTypes([...productTypes, data.productType]);
        setNewProductName("");
      } else {
        alert("Failed to add product: " + data.error);
      }
    } catch (error) {
      console.error("Error adding product type:", error);
      alert("Network error. Please try again.");
    } finally {
      setAddingProduct(false);
    }
  }

  async function removeProductType(id, name) {
    const confirmed = confirm(`Remove ${name}?`);
    if (!confirmed) return;

    try {
      const res = await fetch("/api/product-types", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (data.success) {
        setProductTypes(productTypes.filter(pt => pt.id !== id));
      } else {
        alert("Failed to remove: " + data.error);
      }
    } catch (error) {
      console.error("Error removing product type:", error);
      alert("Network error. Please try again.");
    }
  }

  const designers = employees.filter(e => e.role === "designer");
  const engravers = employees.filter(e => e.role === "engraver");

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
          <Link href="/recent" style={styles.navBtn}>📋 Recent</Link>
          <Link href="/settings" style={{...styles.navBtn, ...styles.navBtnActive}}>⚙️ Settings</Link>
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
            <Link href="/settings" style={{...styles.mobileMenuItem, ...styles.mobileMenuItemActive}} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>⚙️</span> Settings
            </Link>
            <Link href="/backup" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>🔄</span> Backup
            </Link>
          </div>
        )}
      </nav>

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Settings</h1>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Loading settings...</p>
          </div>
        ) : (
          <div style={styles.sections}>
            {/* Employees Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>👥 Team Members</h2>
              
              {/* Add Employee Form */}
              <form onSubmit={addEmployee} style={styles.form}>
                <input
                  type="text"
                  placeholder="Employee name"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  style={styles.input}
                  disabled={addingEmployee}
                />
                
                <select
                  value={newEmployeeRole}
                  onChange={(e) => setNewEmployeeRole(e.target.value)}
                  style={styles.select}
                  disabled={addingEmployee}
                >
                  <option value="engraver">Engraver</option>
                  <option value="designer">Designer</option>
                </select>

                <button 
                  type="submit" 
                  style={styles.addButton}
                  disabled={addingEmployee}
                >
                  {addingEmployee ? "Adding..." : "+ Add"}
                </button>
              </form>

              {/* Designers List */}
              <div style={styles.subsection}>
                <h3 style={styles.subsectionTitle}>✏️ Designers ({designers.length})</h3>
                {designers.length === 0 ? (
                  <p style={styles.emptyText}>No designers yet</p>
                ) : (
                  <div style={styles.list}>
                    {designers.map(employee => (
                      <div key={employee.id} style={styles.listItem}>
                        <div style={styles.itemInfo}>
                          <span style={styles.itemName}>{employee.name}</span>
                          <span style={styles.itemBadge}>Designer</span>
                        </div>
                        <button
                          onClick={() => removeEmployee(employee.id, employee.name)}
                          style={styles.removeButton}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Engravers List */}
              <div style={styles.subsection}>
                <h3 style={styles.subsectionTitle}>⚙️ Engravers ({engravers.length})</h3>
                {engravers.length === 0 ? (
                  <p style={styles.emptyText}>No engravers yet</p>
                ) : (
                  <div style={styles.list}>
                    {engravers.map(employee => (
                      <div key={employee.id} style={styles.listItem}>
                        <div style={styles.itemInfo}>
                          <span style={styles.itemName}>{employee.name}</span>
                          <span style={styles.itemBadge}>Engraver</span>
                        </div>
                        <button
                          onClick={() => removeEmployee(employee.id, employee.name)}
                          style={styles.removeButton}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Types Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>📦 Product Types</h2>
              
              {/* Add Product Form */}
              <form onSubmit={addProductType} style={styles.form}>
                <input
                  type="text"
                  placeholder="Product name (e.g., Keychain)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  style={styles.input}
                  disabled={addingProduct}
                />

                <button 
                  type="submit" 
                  style={styles.addButton}
                  disabled={addingProduct}
                >
                  {addingProduct ? "Adding..." : "+ Add"}
                </button>
              </form>

              {/* Products List */}
              {productTypes.length === 0 ? (
                <p style={styles.emptyText}>No product types yet</p>
              ) : (
                <div style={styles.list}>
                  {productTypes.map(product => (
                    <div key={product.id} style={styles.listItem}>
                      <span style={styles.itemName}>{product.name}</span>
                      <button
                        onClick={() => removeProductType(product.id, product.name)}
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div style={styles.infoBox}>
              <strong style={styles.infoTitle}>💡 How it works</strong>
              <ul style={styles.infoList}>
                <li><strong>Designers</strong> create orders</li>
                <li><strong>Engravers</strong> process orders</li>
                <li><strong>Product Types</strong> categorize images</li>
                <li>All data tracked for incentives</li>
              </ul>
            </div>
          </div>
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
    maxWidth: "1000px",
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

  sections: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  section: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "16px",
  },

  subsection: {
    marginTop: "20px",
  },

  subsectionTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "12px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    padding: "12px 14px",
    fontSize: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },

  select: {
    padding: "12px 14px",
    fontSize: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#fff",
  },

  addButton: {
    padding: "12px 20px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    gap: "10px",
  },

  itemInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    minWidth: 0,
  },

  itemName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1f2937",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  itemBadge: {
    padding: "3px 8px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: "8px",
    fontSize: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  removeButton: {
    padding: "6px 12px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "2px solid #fecaca",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  emptyText: {
    color: "#9ca3af",
    fontSize: "13px",
    fontStyle: "italic",
    padding: "16px",
    textAlign: "center",
  },

  infoBox: {
    padding: "16px",
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "16px",
    border: "2px solid rgba(255,255,255,0.5)",
    color: "#1f2937",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  infoTitle: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  infoList: {
    paddingLeft: "18px",
    margin: "0",
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
    sections: {
      gap: "24px",
    },
    section: {
      padding: "30px",
      borderRadius: "20px",
    },
    sectionTitle: {
      fontSize: "24px",
      marginBottom: "24px",
    },
    subsection: {
      marginTop: "24px",
    },
    subsectionTitle: {
      fontSize: "18px",
      marginBottom: "16px",
    },
    form: {
      flexDirection: "row",
      gap: "12px",
      marginBottom: "24px",
    },
    input: {
      flex: 1,
      padding: "14px 16px",
      fontSize: "15px",
    },
    select: {
      minWidth: "150px",
      padding: "14px 16px",
      fontSize: "15px",
    },
    addButton: {
      padding: "14px 24px",
      fontSize: "15px",
    },
    list: {
      gap: "12px",
    },
    listItem: {
      padding: "16px",
    },
    itemName: {
      fontSize: "16px",
    },
    itemBadge: {
      padding: "4px 12px",
      fontSize: "12px",
    },
    removeButton: {
      padding: "8px 16px",
      fontSize: "13px",
    },
    emptyText: {
      fontSize: "14px",
      padding: "20px",
    },
    infoBox: {
      padding: "24px",
      borderRadius: "20px",
      fontSize: "14px",
    },
    infoTitle: {
      fontSize: "16px",
      marginBottom: "12px",
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
    
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    @media (hover: hover) {
      button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .removeButton:hover {
        background: #fca5a5;
        border-color: #f87171;
      }

      .addButton:hover:not(:disabled) {
        background: #5568d3;
      }

      .mobileMenuItem:hover {
        background: #f9fafb;
      }
    }
  `;
  document.head.appendChild(style);
}
