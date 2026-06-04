import os
import httpx
from fastapi import FastAPI, HTTPException, Query, Header

app = FastAPI(title="Apify Discovery Orchestrator Service")

@app.get("/scrape")
async def scrape_leads(
    keyword: str = Query(..., description="Industry/Keyword (e.g. web developer)"),
    city: str = Query(..., description="City name"),
    country: str = Query(..., description="Country name"),
    limit: int = Query(10, description="Max items to return"),
    authorization: str = Header(None, description="Bearer token for Apify")
):
    token_from_header = None
    if authorization and authorization.startswith("Bearer "):
        token_from_header = authorization.replace("Bearer ", "").strip()

    apify_token = token_from_header or os.environ.get("APIFY_API_KEY_LANCECONNECT") or os.environ.get("APIFY_API_TOKEN")
    if not apify_token:
        # For development ease, if token is not configured, we return mock data so local dev does not break
        print("Warning: APIFY_API_TOKEN is not configured. Returning mock leads for testing.")
        return {
            "success": True,
            "leads": [
                {
                    "business_name": f"Mock {keyword.capitalize()} Studio",
                    "business_type": f"{keyword.capitalize()} Consultant",
                    "description": f"A premier {keyword} shop located in {city}.",
                    "full_address": f"123 Main St, {city}, {country}",
                    "phone": "+1234567890",
                    "email": f"contact@mock{keyword.replace(' ', '')}.com",
                    "website_url": f"https://mock{keyword.replace(' ', '')}.com",
                    "google_place_id": f"mock_place_id_{keyword.replace(' ', '')}_{city.lower()}",
                    "google_rating": 4.2,
                    "google_review_count": 18,
                    "google_maps_url": "https://maps.google.com/?cid=123"
                }
            ]
        }

    search_string = f"{keyword} in {city}, {country}"
    url = f"https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token={apify_token}"
    
    actor_input = {
        "searchStrings": [search_string],
        "maxItems": limit,
        "languageCode": "en",
        "exportPlaceId": True
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(url, json=actor_input)
            
            if res.status_code not in (200, 201):
                raise HTTPException(
                    status_code=502,
                    detail=f"Apify API returned error status {res.status_code}: {res.text}"
                )

            items = res.json()
            leads = []
            
            for item in items:
                leads.append({
                    "business_name": item.get("title", ""),
                    "business_type": item.get("categoryName", keyword),
                    "description": item.get("description", None),
                    "full_address": item.get("address", None),
                    "phone": item.get("phone", None),
                    "email": item.get("email", None),
                    "website_url": item.get("website", None),
                    "google_place_id": item.get("placeId", None),
                    "google_rating": item.get("totalScore", None),
                    "google_review_count": item.get("reviewsCount", 0),
                    "google_maps_url": item.get("url", None)
                })

            return {"success": True, "leads": leads}

    except Exception as e:
        print(f"Exception during Apify scrape: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok", "service": "apify-service"}
