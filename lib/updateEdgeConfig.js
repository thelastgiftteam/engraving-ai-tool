// Helper to update Edge Config via Vercel API
export async function updateEdgeConfig(key, value) {
  try {
    const token = process.env.VERCEL_API_TOKEN;
    const edgeConfigId = process.env.EDGE_CONFIG_ID;
    
    if (!token || !edgeConfigId) {
      console.warn('Missing VERCEL_API_TOKEN or EDGE_CONFIG_ID - using in-memory storage');
      return { success: false, error: 'Missing credentials' };
    }

    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: key,
              value: value,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Edge Config update failed: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating Edge Config:', error);
    return { success: false, error: error.message };
  }
}
