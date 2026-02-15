"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [employees, setEmployees] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const confirmed = confirm(`Remove ${name}? They will no longer appear in dropdowns.`);
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
        alert("Failed to remove employee: " + data.error);
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
        alert("Failed to add product type: " + data.error);
      }
    } catch (error) {
      console.error("Error adding product type:", error);
      alert("Network error. Please try again.");
    } finally {
      setAddingProduct(false);
    }
  }

  async function removeProductType(id, name) {
    const confirmed = confirm(`Remove ${name}? It will no longer appear in dropdowns.`);
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
        alert("Failed to remove product type: " + data.error);
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

          <Link href="/recent" style={styles.navBtn}>
            📋 Recent
          </Link>

          <Link href="/settings" style={{...styles.navBtn, ...styles.navBtnActive}}>
            ⚙️ Settings
          </Link>
        </div>
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
                <div style={styles.formRow}>
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
                    <option value="designer">Designer</option>
                    <option value="engraver">Engraver</option>
                  </select>

                  <button 
                    type="submit" 
                    style={styles.addButton}
                    disabled={addingEmployee}
                  >
                    {addingEmployee ? "Adding..." : "+ Add"}
                  </button>
                </div>
              </form>

              {/* Designers List */}
              <div style={styles.subsection}>
                <h3 style={styles.subsectionTitle}>✏️ Designers ({designers.length})</h3>
                {designers.length === 0 ? (
                  <p style={styles.emptyText}>No designers yet. Add one above!</p>
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
                  <p style={styles.emptyText}>No engravers yet. Add one above!</p>
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
                <div style={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Product type name (e.g., Keychain, Photo Frame)"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    style={{...styles.input, flex: 1}}
                    disabled={addingProduct}
                  />

                  <button 
                    type="submit" 
                    style={styles.addButton}
                    disabled={addingProduct}
                  >
                    {addingProduct ? "Adding..." : "+ Add"}
                  </button>
                </div>
              </form>

              {/* Products List */}
              {productTypes.length === 0 ? (
                <p style={styles.emptyText}>No product types yet. Add one above!</p>
              ) : (
                <div style={styles.list}>
                  {productTypes.map(product => (
                    <div key={product.id} style={styles.listItem}>
                      <div style={styles.itemInfo}>
                        <span style={styles.itemName}>{product.name}</span>
                      </div>
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
              <strong>💡 How it works:</strong>
              <ul style={styles.infoList}>
                <li><strong>Designers</strong> are shown when creating new orders</li>
                <li><strong>Engravers</strong> can claim and process orders</li>
                <li><strong>Product Types</strong> are selected for each image in an order</li>
                <li>All data is tracked for incentive calculation and Google Sheets export</li>
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

  container: {
    maxWidth: "1000px",
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

  sections: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  section: {
    background: "#fff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  sectionTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "24px",
  },

  subsection: {
    marginTop: "24px",
  },

  subsectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "16px",
  },

  form: {
    marginBottom: "24px",
  },

  formRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  input: {
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    flex: 1,
  },

  select: {
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    minWidth: "150px",
  },

  addButton: {
    padding: "14px 24px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
  },

  itemInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  itemName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
  },

  itemBadge: {
    padding: "4px 12px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },

  removeButton: {
    padding: "8px 16px",
    background: "#fee2e2",
    color: "#dc2626",
    border: "2px solid #fecaca",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  emptyText: {
    color: "#9ca3af",
    fontSize: "14px",
    fontStyle: "italic",
    padding: "20px",
    textAlign: "center",
  },

  infoBox: {
    padding: "24px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: "2px solid rgba(255,255,255,0.5)",
    color: "#1f2937",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  infoList: {
    marginTop: "12px",
    paddingLeft: "20px",
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

    formRow: {
      flexDirection: "column",
    },

    select: {
      width: "100%",
    },

    container: {
      padding: "0 16px",
    },

    section: {
      padding: "20px",
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
  `;
  document.head.appendChild(style);
}
