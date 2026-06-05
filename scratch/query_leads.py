import urllib.request
import json

url = "https://rpaodsmwhmzyhopvkwjt.supabase.co/rest/v1/leads?select=business_name,phone,source&order=created_at.asc&limit=20"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYW9kc213aG16eWhvcHZrd2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDE3MzUsImV4cCI6MjA5NjAxNzczNX0.oE0aUeIssOS4hgq4Dd9m46twTj_mwUM7074rMr9_XOc",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYW9kc213aG16eWhvcHZrd2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDE3MzUsImV4cCI6MjA5NjAxNzczNX0.oE0aUeIssOS4hgq4Dd9m46twTj_mwUM7074rMr9_XOc"
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Error:", e)
