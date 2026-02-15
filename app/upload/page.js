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

    // Validation
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

    // Check if all images have product types
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

          <Link href="/upload" style={{...styles.navBtn, ...styles.navBtnActive}}>
            + New Order
          </Link>

          <Link href="/settings" style={styles.navBtn}>
            ⚙️ Settings
          </Link>
        </div>
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
              {error}
            </div>
          )}

          {/* Order Number Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Shopify Order Number <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., #1234 or WTF-1234"
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
              Designer (Who's uploading?) <span style={styles.required}>*</span>
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
                No designers found. <Link href="/settings" style={styles.link}>Add designers in Settings</Link>
              </p>
            )}
          </div>

          {/* Images Section */}
          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>
                Design Images <span style={styles.required}>*</span>
              </label>
              <button onClick={addImageField} style={styles.addBtn} disabled={loading}>
                + Add Another Image
              </button>
            </div>

            <div style={styles.imagesList}>
              {images.map((image, i) => (
                <div key={i} style={styles.imageCard}>
                  <div style={styles.imageHeader}>
                    <strong>Image {i + 1}</strong>
                    {images.length > 1 && (
                      <button
                        onClick={() => removeImageField(i)}
                        style={styles.removeBtn}
                        disabled={loading}
                        title="Remove this image"
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
                        placeholder="Paste Google Drive link"
                        value={image.url}
                        onChange={(e) => updateImage(i, "url", e.target.value)}
                        style={styles.input}
                        disabled={loading}
                      />
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.smallLabel}>Product Type</label>
                      <select
                        value={image.productTypeId}
                        onChange={(e) => updateImage(i, "productTypeId", parseInt(e.target.value))}
                        style={styles.select}
                        disabled={loading}
                      >
                        <option value="">Select product...</option>
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

            <div style={styles.helpText}>
              💡 <strong>Tip:</strong> Right-click image in Google Drive → Get link → Copy and paste here
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
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Creating Order...
              </>
            ) : (
              "Create Order"
            )}
          </button>

          {/* Info Box */}
          <div style={styles.infoBox}>
            <strong>📋 What happens next?</strong>
            <ol style={styles.infoList}>
              <li>Order appears on dashboard as "Pending"</li>
              <li>Engraving team claims and processes the order</li>
              <li>Processing time is automatically tracked</li>
              <li>Data exports to Google Sheets for incentive calculation</li>
            </ol>
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
    maxWidth: "800px",
    margin: "40px auto 0",
    padding: "0 24px",
  },

  formCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },

  header: {
    marginBottom: "32px",
    textAlign: "center",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "8px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  errorBox: {
    background: "#fef2f2",
    border: "2px solid #fca5a5",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  errorIcon: {
    fontSize: "20px",
  },

  formGroup: {
    marginBottom: "28px",
  },

  label: {
    display: "block",
    fontSize: "15px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "10px",
  },

  smallLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "6px",
  },

  required: {
    color: "#ef4444",
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    transition: "all 0.2s",
    fontFamily: "inherit",
    backgroundColor: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  imagesList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  imageCard: {
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "16px",
    border: "2px solid #e5e7eb",
  },

  imageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#374151",
  },

  imageFields: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  fieldGroup: {
    flex: 1,
  },

  addBtn: {
    padding: "8px 16px",
    background: "#667eea",
    border: "none",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  removeBtn: {
    width: "32px",
    height: "32px",
    background: "#fee2e2",
    border: "2px solid #fecaca",
    borderRadius: "8px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#dc2626",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  helpText: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "10px",
    padding: "12px",
    background: "#f0f9ff",
    borderRadius: "10px",
    border: "1px solid #bfdbfe",
  },

  link: {
    color: "#667eea",
    fontWeight: "600",
    textDecoration: "underline",
  },

  submitBtn: {
    width: "100%",
    padding: "16px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  submitBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  infoBox: {
    marginTop: "32px",
    padding: "20px",
    background: "#f0fdf4",
    border: "2px solid #86efac",
    borderRadius: "14px",
    fontSize: "14px",
    color: "#166534",
  },

  infoList: {
    marginTop: "12px",
    paddingLeft: "20px",
    lineHeight: "1.8",
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

    formCard: {
      padding: "24px",
    },

    container: {
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
    
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  `;
  document.head.appendChild(style);
}
