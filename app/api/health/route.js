export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "API is live"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
