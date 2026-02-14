export async function GET(request, context) {
  const uid = context.params.uid;

  // Temporary in-memory storage
  const orders = global.orders || [];

  const order = orders.find(
    (o) => String(o.uid) === String(uid)
  );

  return new Response(
    JSON.stringify({ order }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
