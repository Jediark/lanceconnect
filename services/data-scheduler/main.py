import asyncio
import httpx
import os
import json
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
APIFY_API_KEY = os.environ.get('APIFY_API_KEY_LANCECONNECT')

# Cities to pre-populate with fresh data
PRIORITY_CITIES = [
  {'city': 'Lagos', 'country': 'Nigeria', 'priority': 1},
  {'city': 'London', 'country': 'United Kingdom', 'priority': 1},
  {'city': 'Dubai', 'country': 'UAE', 'priority': 1},
  {'city': 'Nairobi', 'country': 'Kenya', 'priority': 2},
  {'city': 'Accra', 'country': 'Ghana', 'priority': 2},
  {'city': 'Mumbai', 'country': 'India', 'priority': 2},
  {'city': 'Toronto', 'country': 'Canada', 'priority': 2},
  {'city': 'Johannesburg', 'country': 'South Africa', 'priority': 3},
  {'city': 'Berlin', 'country': 'Germany', 'priority': 3},
  {'city': 'São Paulo', 'country': 'Brazil', 'priority': 3},
]

CATEGORIES = ['web_dev', 'designer', 'seo', 'social_media', 'photography']

BUSINESS_TYPES = [
  'restaurant', 'beauty salon', 'dental clinic', 'gym', 'hotel',
  'law firm', 'pharmacy', 'bakery', 'retail store', 'school',
  'auto repair', 'event venue', 'real estate agency', 'accounting firm',
  'plumber', 'electrician', 'florist', 'pet clinic', 'driving school',
]

async def fetch_fresh_leads(city: str, country: str, business_type: str, category: str):
  """Fetch new leads from Apify and store in Supabase"""
  logger.info(f'Fetching {business_type} in {city}, {country} for {category}')

  if not SUPABASE_URL or not SUPABASE_SERVICE_KEY or not APIFY_API_KEY:
    logger.error('Missing required environment variables SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or APIFY_API_KEY_LANCECONNECT')
    return 0

  try:
    async with httpx.AsyncClient() as client:
      # Call Apify
      apify_response = await client.post(
        'https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items',
        headers={'Authorization': f'Bearer {APIFY_API_KEY}'},
        json={
          'searchStringsArray': [f'{business_type} in {city}, {country}'],
          'maxCrawledPlacesPerSearch': 20,
          'language': 'en',
        },
        timeout=120.0
      )

      if not apify_response.is_success:
        logger.error(f'Apify failed: {apify_response.status_code} - {apify_response.text}')
        return 0

      places = apify_response.json()
      logger.info(f'Apify returned {len(places)} results')

      # Calculate opportunity scores and prepare for upsert
      leads = []
      for place in places:
        if not place.get('title'):
          continue

        phone = place.get('phone', '')
        score = calculate_opportunity_score(place)

        leads.append({
          'business_name': place.get('title'),
          'business_type': place.get('categoryName', business_type),
          'industry': category,
          'country': country,
          'city': city,
          'full_address': place.get('address'),
          'phone': phone,
          'phone_whatsapp_link': f"https://wa.me/{phone.replace('+', '').replace(' ', '').replace('-', '')}" if phone else None,
          'website_url': place.get('website'),
          'has_website': bool(place.get('website')),
          'google_place_id': place.get('placeId'),
          'google_maps_url': place.get('url'),
          'google_rating': place.get('totalScore'),
          'google_review_count': place.get('reviewsCount', 0),
          'google_photo_url': place.get('imageUrl'),
          'opportunity_score': score,
          'source': 'google_maps_scheduler',
          'last_verified_at': datetime.utcnow().isoformat(),
          'cache_expires_at': (datetime.utcnow() + timedelta(days=14)).isoformat(),
        })

      if not leads:
        return 0

      # Upsert to Supabase (insert new, update existing)
      upsert_response = await client.post(
        f'{SUPABASE_URL}/rest/v1/leads',
        headers={
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        json=leads
      )

      if upsert_response.is_success:
        logger.info(f'Successfully stored {len(leads)} leads for {city}')
        return len(leads)
      else:
        logger.error(f'Supabase upsert failed: {upsert_response.text}')
        return 0

  except Exception as e:
    logger.error(f'Error fetching leads: {e}')
    return 0

def calculate_opportunity_score(place: dict) -> int:
  score = 0
  if not place.get('website'): score += 40
  rating = place.get('totalScore', 5)
  if rating < 3.0: score += 20
  elif rating < 3.5: score += 15
  elif rating < 4.0: score += 10
  reviews = place.get('reviewsCount', 0)
  if reviews < 5: score += 15
  elif reviews < 10: score += 10
  elif reviews < 25: score += 5
  if place.get('phone'): score += 5
  return min(100, score)

async def run_scheduled_fetches():
  """Main scheduler loop — runs continuously"""
  logger.info('LanceConnect Data Scheduler started')

  while True:
    try:
      total_new_leads = 0

      # Cycle through priority cities
      for city_config in PRIORITY_CITIES:
        for category in CATEGORIES:
          # Pick a different business type each run
          business_type = BUSINESS_TYPES[
            int(datetime.utcnow().timestamp()) % len(BUSINESS_TYPES)
          ]

          new_leads = await fetch_fresh_leads(
            city=city_config['city'],
            country=city_config['country'],
            business_type=business_type,
            category=category
          )
          total_new_leads += new_leads

          # Wait between requests to avoid rate limiting
          await asyncio.sleep(30)

      logger.info(f'Scheduled run complete: {total_new_leads} new leads added')

      # Wait 6 hours before next full cycle
      await asyncio.sleep(6 * 60 * 60)

    except Exception as e:
      logger.error(f'Scheduler error: {e}')
      await asyncio.sleep(60 * 60)  # Wait 1 hour on error

if __name__ == '__main__':
  asyncio.run(run_scheduled_fetches())
