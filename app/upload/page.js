"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [designerId, setDesignerId] = useState("");
  const [images, setImages] = useState([{ url: "", productTypeId: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [designers, setDesigners] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    loadDesigners();
    loadProductTypes();
  }, []);

  async function loadDesigners() {
    try {
      const res = await fetch("/api/employees?role=designer");
      const data = await res.json();
      if (data.success) {
        setDesigners(data.employees);
      }
    } catch (error) {
      console.error("Failed to load designers:", error);
    }
  }

  async function loadProductTypes() {
    try {
      const res = await fetch("/api/product-types");
      const data = await res.json();
      if (data.success) {
        setProductTypes(data.productTypes);
      }
    } catch (error) {
      console.error("Failed to load product types:", error);
    }
  }

  function addImageField() {
    setImages([...images, { url: "", productTypeId: "" }]);
  }

  function removeImageField(index) {
    if (images.length === 1) return;
    const copy = [...images];
    copy.splice(index, 1);
    setImages(copy);
  }

  function updateImage(i, field, value) {
    const copy = [...images];
    copy[i][field] = value;
    setImages(copy);
    setError("");
  }

  async function submit() {
    setError("");

    if (!orderId.trim()) {
      setError("Please enter an order number");
      return;
    }

    if (!designerId) {
      setError("Please select a designer");
      return;
    }

    const validImages = images.filter(img => img.url.trim() !== "");
    if (validImages.length === 0) {
      setError("Please add at least one image link");
      return;
    }

    const missingProductType = validImages.some(img => !img.productTypeId);
    if (missingProductType) {
      setError("Please select product type for all images");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderId.trim(),
          designerId: parseInt(designerId),
          images: validImages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/order/${data.order.uid}`);
      } else {
        setError(data.error || "Failed to create order");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Network error. Please try again.");
      setLoading(false);
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
          <Link href="/upload" style={{...styles.navBtn, ...styles.navBtnActive}}>+ New Order</Link>
          <Link href="/analytics" style={styles.navBtn}>📊 Analytics</Link>
          <Link href="/recent" style={styles.navBtn}>📋 Recent</Link>
          <Link href="/settings" style={styles.navBtn}>⚙️ Settings</Link>
        </div>

        {menuOpen && (
          <div style={styles.mobileMenu}>
            <Link href="/" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
              <span style={styles.mobileMenuIcon}>🏠</span> Dashboard
            </Link>
            <Link href="/upload" style={{...styles.mobileMenuItem, ...styles.mobileMenuItemActive}} onClick={() => setMenuOpen(false)}>
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
          </div>
        )}
      </nav>

      {/* Form Container */}
      <div style={styles.container}>
        <div style={styles.formCard}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create New Order</h1>
            <p style={styles.subtitle}>
              Enter order details and design information
            </p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              <div style={styles.errorText}>{error}</div>
            </div>
          )}

          {/* Order Number Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Order Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., #1234"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setError("");
              }}
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Designer Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Designer <span style={styles.required}>*</span>
            </label>
            <select
              value={designerId}
              onChange={(e) => {
                setDesignerId(e.target.value);
                setError("");
              }}
              style={styles.select}
              disabled={loading}
            >
              <option value="">Select designer...</option>
              {designers.map(designer => (
                <option key={designer.id} value={designer.id}>
                  {designer.name}
                </option>
              ))}
            </select>
            {designers.length === 0 && (
              <p style={styles.helpText}>
                No designers found. <Link href="/settings" style={styles.link}>Add in Settings</Link>
              </p>
            )}
          </div>

          {/* Images Section */}
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>
                Design Images <span style={styles.required}>*</span>
              </label>
              <button onClick={addImageField} style={styles.addBtn} disabled={loading} type="button">
                + Add
              </button>
            </div>

            <div style={styles.imagesList}>
              {images.map((image, i) => (
                <div key={i} style={styles.imageCard}>
                  <div style={styles.imageHeader}>
                    <span style={styles.imageNumber}>Image {i + 1}</span>
                    {images.length > 1 && (
                      <button
                        onClick={() => removeImageField(i)}
                        style={styles.removeBtn}
                        disabled={loading}
                        title="Remove"
                        type="button"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div style={styles.imageFields}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.smallLabel}>Google Drive Link</label>
                      <input
                        type="url"
                        placeholder="Paste link"
                        value={image.url}
                        onChange={(e) => updateImage(i, "url", e.target.value)}
                        style={styles.inputSmall}
                        disabled={loading}
                      />
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.smallLabel}>Product Type</label>
                      <select
                        value={image.productTypeId}
                        onChange={(e) => updateImage(i, "productTypeId", parseInt(e.target.value))}
                        style={styles.selectSmall}
                        disabled={loading}
                      >
                        <option value="">Select...</option>
                        {productTypes.map(pt => (
                          <option key={pt.id} value={pt.id}>
                            {pt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.tipBox}>
              💡 Right-click image → Get link → Copy & paste
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submit}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnLoading : {})
            }}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Creating...
              </>
            ) : (
              "Create Order"
            )}
          </button>

          {/* Info Box */}
          <div style={styles.infoBox}>
            <div style={styles.infoTitle}>📋 What's next?</div>
            <ul style={styles.infoList}>
              <li>Order appears as Pending</li>
              <li>Team claims & processes</li>
              <li>Time tracked automatically</li>
            </ul>
          </div>
        </div>
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
    maxWidth: "700px",
    margin: "20px auto 0",
    padding: "0 16px",
  },

  formCard: {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },

  header: {
    marginBottom: "20px",
    textAlign: "center",
  },

  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "6px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    wordBreak: "break-word",
  },

  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  errorBox: {
    background: "#fef2f2",
    border: "2px solid #fca5a5",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "16px",
    color: "#991b1b",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    wordBreak: "break-word",
  },

  errorIcon: {
    fontSize: "16px",
    flexShrink: 0,
    marginTop: "2px",
  },

  errorText: {
    flex: 1,
    wordBreak: "break-word",
  },

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "6px",
  },

  smallLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "5px",
  },

  required: {
    color: "#ef4444",
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    gap: "8px",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },

  inputSmall: {
    width: "100%",
    padding: "8px 10px",
    fontSize: "13px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  selectSmall: {
    width: "100%",
    padding: "8px 10px",
    fontSize: "13px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  imagesList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  imageCard: {
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
  },

  imageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  imageNumber: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#374151",
  },

  imageFields: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  fieldGroup: {
    width: "100%",
  },

  addBtn: {
    padding: "6px 12px",
    background: "#667eea",
    border: "none",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  removeBtn: {
    width: "26px",
    height: "26px",
    background: "#fee2e2",
    border: "2px solid #fecaca",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#dc2626",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  helpText: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "6px",
    padding: "8px",
    background: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
    lineHeight: "1.4",
  },

  tipBox: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "8px",
    padding: "8px",
    background: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
    lineHeight: "1.4",
  },

  link: {
    color: "#667eea",
    fontWeight: "600",
    textDecoration: "underline",
  },

  submitBtn: {
    width: "100%",
    padding: "12px 18px",
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

  submitBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  infoBox: {
    marginTop: "20px",
    padding: "14px",
    background: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#166534",
  },

  infoTitle: {
    fontWeight: "700",
    marginBottom: "6px",
  },

  infoList: {
    paddingLeft: "16px",
    margin: "0",
    lineHeight: "1.6",
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

    @media (max-width: 768px) {
      .menuBtn {
        display: block;
      }
      .navDesktop {
        display: none;
      }
    }

    @media (min-width: 769px) {
      .menuBtn {
        display: none;
      }
    }

    @media (hover: hover) {
      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }
    }
  `;
  document.head.appendChild(style);
}
