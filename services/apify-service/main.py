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
        raise HTTPException(
            status_code=500,
            detail="Apify API token is not configured on the server."
        )

    search_string = f"{keyword} in {city}, {country}"
    url = f"https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token={apify_token}"
    
    actor_input = {
        "searchString": search_string,
        "maxCrawledPlaces": limit,
        "proxyConfig": {
            "useApifyProxy": True
        },
        "proxyConfiguration": {
            "useApifyProxy": True,
            "apifyProxyGroups": ["RESIDENTIAL"]
        }
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
