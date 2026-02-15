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
```

---

### **Step 6: Get Your Edge Config ID and Create API Token**

1. **Get Edge Config ID:**
   - In Vercel → Storage → Click on your Edge Config
   - Copy the **Edge Config ID** (looks like: `ecfg_xxxxx`)

2. **Create API Token:**
   - Go to Vercel → Settings (your account, not project)
   - Click **"Tokens"**
   - Click **"Create Token"**
   - Name: `edge-config-update`
   - Select **"Full Account"** scope
   - Click **"Create"**
   - **COPY THE TOKEN** (you won't see it again!)

3. **Add to Vercel Environment Variables:**
   - Go to your project → Settings → Environment Variables
   - Add:
     - `EDGE_CONFIG_ID` = `ecfg_xxxxx` (your ID)
     - `VERCEL_API_TOKEN` = `vercel_xxxxx` (your token)
   - Check all environments

4. **Add to Local .env.local:**

Create **`.env.local`** file in project root:
```
EDGE_CONFIG=https://edge-config.vercel.com/ecfg_xxxxx?token=xxxxx
EDGE_CONFIG_ID=ecfg_xxxxx
VERCEL_API_TOKEN=vercel_xxxxx
