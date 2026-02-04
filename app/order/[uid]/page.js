export default function OrderPage({ params }) {
  return (
    <>
      <h1>Create Order</h1>
      <p><strong>UID:</strong> {params.uid}</p>

      <div style={styles.card}>
        <label>Customer Name</label>
        <input value="Demo Customer" disabled style={styles.input} />

        <label>Select Image</label>
        <div>Mockup images will appear here</div>

        <label>Product Type</label>
        <select style={styles.input}>
          <option>Photo Frame</option>
          <option>Memorial QR</option>
          <option>Wood Engraving</option>
        </select>

        <label>Sales Partner Name</label>
        <input placeholder="Employee name" style={styles.input} />

        <label>Delivery Address</label>
        <textarea style={styles.textarea} />

        <label>Order Value</label>
        <input placeholder="₹ Amount" style={styles.input} />

        <label>Payment Proof</label>
        <input type="file" />

        <button style={styles.button}>Create Order</button>
      </div>
    </>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "500px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    marginBottom: "12px",
  },
  button: {
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};
