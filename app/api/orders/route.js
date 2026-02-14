export async function GET(req, { params }) {
  const { uid } = params;

  // TEMP STORAGE (same mock data used in dashboard)
  // Later we will move this to database
  const globalOrders = global.orders || [];

  const order = globalOrders.find(
    (o) => String(o.uid) === String(uid)
  );

  return Response.json({ order });
}
