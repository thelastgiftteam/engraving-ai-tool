export async function GET(req, { params }) {
  const uid = params.uid;

  // TEMP FAKE STORAGE (same as dashboard uses)
  global.orders = global.orders || [];

  const order = global.orders.find(
    (o) => String(o.orderNumber) === String(uid)
  );

  return Response.json({ order });
}
