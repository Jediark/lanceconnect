import httpx

supabase_url = "https://rpaodsmwhmzyhopvkwjt.supabase.co"
# Use the anon key from .env file
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYW9kc213aG16eWhvcHZrd2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDE3MzUsImV4cCI6MjA5NjAxNzczNX0.oE0aUeIssOS4hgq4Dd9m46twTj_mwUM7074rMr9_XOc"

headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}"
}

url = f"{supabase_url}/rest/v1/leads?select=business_name,phone,source&order=created_at.asc&limit=20"

try:
    res = httpx.get(url, headers=headers)
    print(f"Status Code: {res.status_code}")
    print("Database leads records:")
    print(res.json())
except Exception as e:
    print(f"Failed to query database: {e}")
