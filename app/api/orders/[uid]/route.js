export async function GET(req, { params }) {
  const { uid } = params;

  if (!global.orders) global.orders = [];

  const order = global.orders.find((o) => o.uid === uid);

  if (!order) {
    return Response.json({ order: null });
  }

  return Response.json({ order });
}
