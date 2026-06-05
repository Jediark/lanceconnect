import httpx
import json

apify_service_url = "https://victorious-nature-production-ad29.up.railway.app"
query_url = f"{apify_service_url}/scrape"

params = {
    "keyword": "restaurant",
    "city": "Lagos",
    "country": "Nigeria",
    "limit": 3
}

print(f"Querying: {query_url} with params: {params}")

try:
    # Set a long timeout since Apify crawler takes time
    res = httpx.get(query_url, params=params, timeout=60.0)
    print(f"Status Code: {res.status_code}")
    print("Response JSON:")
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Request failed: {e}")
