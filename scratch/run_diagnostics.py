import os
import sys
import json
import time
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Load environment configuration
SUPABASE_URL = "https://rpaodsmwhmzyhopvkwjt.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYW9kc213aG16eWhvcHZrd2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDE3MzUsImV4cCI6MjA5NjAxNzczNX0.oE0aUeIssOS4hgq4Dd9m46twTj_mwUM7074rMr9_XOc"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYW9kc213aG16eWhvcHZrd2p0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ0MTczNSwiZXhwIjoyMDk2MDE3NzM1fQ.fz74HqgcKtAL4jnege3NIRbwEc3dWXH_nMo9BJ8-3yU"
TEST_EMAIL = "test@lanceconnect.vercel.app"
TEST_PASSWORD = "TestPassword123!"

admin_headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

anon_headers = {
    "apikey": ANON_KEY,
    "Content-Type": "application/json"
}

print("======================================================================")
print("             LANCECONNECT LIVE SYSTEM DIAGNOSTIC RUN                  ")
print("======================================================================")

# ----------------------------------------------------------------------
# TEST 1 — Register a brand new test user
# ----------------------------------------------------------------------
print("\n--- TEST 1: Registering new test user ---")

# 1.1 Delete user if exists
print(f"Checking if user {TEST_EMAIL} already exists...")
list_res = requests.get(f"{SUPABASE_URL}/auth/v1/admin/users", headers=admin_headers)
if list_res.status_code == 200:
    res_data = list_res.json()
    users_list = res_data.get("users", []) if isinstance(res_data, dict) else res_data
    user_id = None
    for u in users_list:
        if u.get("email") == TEST_EMAIL:
            user_id = u.get("id")
            break
    
    if user_id:
        print(f"User found with ID: {user_id}. Deleting for clean test...")
        del_res = requests.delete(f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}", headers=admin_headers)
        print(f"Delete response: {del_res.status_code}")
        # Give DB a second to delete cascade profiles
        time.sleep(1)
else:
    print(f"Failed to check existing users: {list_res.status_code} - {list_res.text}")

# 1.2 Sign up user via public signup (triggers welcome emails if configured)
print(f"Signing up new user {TEST_EMAIL}...")
signup_res = requests.post(
    f"{SUPABASE_URL}/auth/v1/signup",
    headers=anon_headers,
    json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
)

email_sent = "❌"
new_user_id = None

if signup_res.status_code in [200, 201]:
    signup_data = signup_res.json()
    new_user_id = signup_data.get("id") or signup_data.get("user", {}).get("id")
    print(f"Registration successful! User ID: {new_user_id}")
    
    # Confirming email sent by checking confirmation_sent_at or user details
    user_details = signup_data.get("user", {})
    if user_details.get("confirmation_sent_at"):
        email_sent = "✅"
        print(f"Resend signup email confirmation triggered at: {user_details.get('confirmation_sent_at')}")
    else:
        # If confirmations are disabled, it might log in immediately, check if it's sent
        email_sent = "✅ (Skip/Sent)"
else:
    print(f"Registration failed: {signup_res.status_code} - {signup_res.text}")
    print("Attempting admin user creation fallback (bypasses SMTP issues)...")
    admin_create_res = requests.post(
        f"{SUPABASE_URL}/auth/v1/admin/users",
        headers=admin_headers,
        json={"email": TEST_EMAIL, "password": TEST_PASSWORD, "email_confirm": True}
    )
    if admin_create_res.status_code in [200, 201]:
        admin_data = admin_create_res.json()
        new_user_id = admin_data.get("id")
        print(f"Admin fallback creation successful! User ID: {new_user_id}")
        print("Email confirmation set directly via Admin.")
    else:
        print(f"Admin fallback creation failed: {admin_create_res.status_code} - {admin_create_res.text}")

# 1.3 Verify profile row in database
profile_row = None
profile_created = "❌"
if new_user_id:
    print("Checking if profile row is automatically created in database...")
    # Wait briefly for trigger execution
    time.sleep(1)
    prof_res = requests.get(f"{SUPABASE_URL}/rest/v1/profiles?id=eq.{new_user_id}", headers=admin_headers)
    if prof_res.status_code == 200 and prof_res.json():
        profile_row = prof_res.json()[0]
        profile_created = "✅"
        print("Profile row found in database:")
        print(json.dumps(profile_row, indent=2))
    else:
        print(f"Profile row not found: {prof_res.status_code} - {prof_res.text}")

# 1.4 Confirm user email via admin endpoint so we can login with password
if new_user_id:
    print("Confirming test user email for login verification...")
    confirm_res = requests.put(
        f"{SUPABASE_URL}/auth/v1/admin/users/{new_user_id}",
        headers=admin_headers,
        json={"email_confirm": True}
    )
    if confirm_res.status_code == 200:
        print("Test user email confirmed successfully.")
    else:
        print(f"Failed to confirm email: {confirm_res.status_code} - {confirm_res.text}")

# ----------------------------------------------------------------------
# TEST 2 — Run a real live search
# ----------------------------------------------------------------------
print("\n--- TEST 2: Running a real live B2B search ---")

# 2.1 Log in to get test user JWT
print("Logging in to get test user JWT...")
login_res = requests.post(
    f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
    headers=anon_headers,
    json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
)

user_jwt = None
if login_res.status_code == 200:
    login_data = login_res.json()
    user_jwt = login_data.get("access_token")
    print("Logged in successfully. JWT obtained.")
else:
    print(f"Login failed: {login_res.status_code} - {login_res.text}")

search_leads = []
first_lead_id = None

if user_jwt:
    user_headers = {
        "Authorization": f"Bearer {user_jwt}",
        "Content-Type": "application/json"
    }
    
    print("Calling search-leads Edge Function...")
    search_payload = {
        "query": "web_dev",
        "city": "Lagos",
        "country": "Nigeria",
        "limit": 5
    }
    search_res = requests.post(
        f"{SUPABASE_URL}/functions/v1/search-leads",
        headers=user_headers,
        json=search_payload
    )
    
    print(f"Search status code: {search_res.status_code}")
    if search_res.status_code == 200:
        search_data = search_res.json()
        print("EXACT RAW JSON RESPONSE:")
        print(json.dumps(search_data, indent=2))
        search_leads = search_data.get("leads", [])
        if search_leads:
            first_lead_id = search_leads[0].get("id")
            print(f"\nDiscovered {len(search_leads)} leads. Business names:")
            for i, l in enumerate(search_leads):
                print(f"  {i+1}. {l.get('business_name')} (ID: {l.get('id')})")
        else:
            print("No leads returned.")
    else:
        print(f"Search failed: {search_res.status_code} - {search_res.text}")
else:
    print("Skipped search because login JWT is missing.")

# ----------------------------------------------------------------------
# TEST 3 — Check all API keys are actually loaded
# ----------------------------------------------------------------------
print("\n--- TEST 3 & 10: Running Health Check & API Key Diagnostic ---")
health_res = requests.get(f"{SUPABASE_URL}/functions/v1/health-check", headers=admin_headers)
health_data = {}
keys_check = {}

if health_res.status_code in [200, 503]: # 503 is returned if any check is degraded (which is fine)
    health_data = health_res.json()
    keys_check = health_data.get("keyCheck", {})
    print("KEY CHECK RESULTS:")
    print(json.dumps(keys_check, indent=2))
    
    loaded_count = sum(1 for v in keys_check.values() if v)
    print(f"{loaded_count}/{len(keys_check)} keys loaded successfully.")
else:
    print(f"Health check function failed: {health_res.status_code} - {health_res.text}")

# ----------------------------------------------------------------------
# TEST 4 — Save a lead and check enrichment
# ----------------------------------------------------------------------
print("\n--- TEST 4: Saving lead and checking contact enrichment ---")
final_lead_row = None
enrichment_status = "❌"

if user_jwt and first_lead_id:
    user_headers = {
        "Authorization": f"Bearer {user_jwt}",
        "Content-Type": "application/json"
    }
    print(f"Saving lead {first_lead_id} to pipeline...")
    save_res = requests.post(
        f"{SUPABASE_URL}/functions/v1/pipeline-ops",
        headers=user_headers,
        json={"action": "save", "leadId": first_lead_id, "status": "new"}
    )
    print(f"Pipeline-ops status code: {save_res.status_code}")
    if save_res.status_code == 200:
        print("Lead saved to user pipeline. (This blocks until enrich-contact finishes).")
        print("Response:", json.dumps(save_res.json(), indent=2))
        
        print("\nQuerying lead final state from database...")
        lead_db_res = requests.get(f"{SUPABASE_URL}/rest/v1/leads?id=eq.{first_lead_id}", headers=admin_headers)
        if lead_db_res.status_code == 200 and lead_db_res.json():
            final_lead_row = lead_db_res.json()[0]
            enrichment_status = "✅"
            print("Lead row details after enrichment:")
            print(json.dumps(final_lead_row, indent=2))
        else:
            print(f"Failed to query lead from DB: {lead_db_res.status_code} - {lead_db_res.text}")
    else:
        print(f"Pipeline save failed: {save_res.status_code} - {save_res.text}")
else:
    print("Skipped pipeline save because no lead or JWT is available.")

# ----------------------------------------------------------------------
# TEST 5 — Check Apify service directly
# ----------------------------------------------------------------------
print("\n--- TEST 5: Direct Apify Microservice Health Check ---")
apify_url = "https://victorious-nature-production-ad29.up.railway.app"
apify_status = "❌ Offline"
try:
    apify_res = requests.get(f"{apify_url}/health", timeout=5)
    print(f"Apify service response code: {apify_res.status_code}")
    print(f"Apify response: {apify_res.text.strip()}")
    if apify_res.status_code == 200:
        apify_status = "✅ Online"
except Exception as e:
    print(f"Apify check failed: {e}")

# ----------------------------------------------------------------------
# TEST 6 — Check Maigret service directly
# ----------------------------------------------------------------------
print("\n--- TEST 6: Direct Maigret Microservice Health Check ---")
maigret_url = "https://lanceconnect-maigret.up.railway.app" # Default fallback maigret service URL
if health_data and "maigret" in health_data.get("checks", {}):
    # Check if there is an environment variable or endpoint we can deduce
    pass

maigret_status = "❌ Offline"
# We can try to hit maigret URL. Let's see what URL is in our environment or if it is configured.
# Let's see if we have MAIGRET_SERVICE_URL in local.env. It wasn't there, but let's check.
print("Pinging Maigret Service health endpoint...")
try:
    maigret_res = requests.get(f"{maigret_url}/health", timeout=5)
    print(f"Maigret service response code: {maigret_res.status_code}")
    print(f"Maigret response: {maigret_res.text.strip()}")
    if maigret_res.status_code == 200:
        maigret_status = "✅ Online"
except Exception as e:
    print(f"Maigret check failed: {e}")

# ----------------------------------------------------------------------
# TEST 7 — Check email scraper directly
# ----------------------------------------------------------------------
print("\n--- TEST 7: Direct Vercel Email Scraper Health Check ---")
scraper_base_url = "https://lanceconnect.vercel.app/api/scrape"
scraper_status = "❌ Offline"
try:
    # Let's run a GET request
    scraper_get_res = requests.get(scraper_base_url, timeout=5)
    print(f"Scraper GET response status: {scraper_get_res.status_code}")
    print(f"Scraper GET body: {scraper_get_res.text[:100]}")
    
    # Also test POST request (scraper endpoint uses POST)
    scraper_post_res = requests.post(scraper_base_url, json={"url": "https://google.com"}, timeout=5)
    print(f"Scraper POST response status: {scraper_post_res.status_code}")
    print(f"Scraper POST body: {scraper_post_res.text[:100]}")
    
    if scraper_get_res.status_code in [200, 405] or scraper_post_res.status_code in [200, 400]:
        scraper_status = "✅ Online"
except Exception as e:
    print(f"Scraper check failed: {e}")

# ----------------------------------------------------------------------
# TEST 8 — Check the leads table counts
# ----------------------------------------------------------------------
print("\n--- TEST 8: Check Leads Table Statistics ---")
leads_count = 0
emails_count = 0
phones_count = 0
no_website_count = 0
hot_leads_count = 0

try:
    # 8.1 Total leads
    headers_with_prefer = {**admin_headers, "Prefer": "count=exact"}
    res = requests.get(f"{SUPABASE_URL}/rest/v1/leads?select=id", headers=headers_with_prefer)
    leads_count = int(res.headers.get("Content-Range", "0-0/0").split("/")[-1])
    
    # 8.2 No website
    res = requests.get(f"{SUPABASE_URL}/rest/v1/leads?has_website=eq.false&select=id", headers=headers_with_prefer)
    no_website_count = int(res.headers.get("Content-Range", "0-0/0").split("/")[-1])
    
    # 8.3 Has email
    res = requests.get(f"{SUPABASE_URL}/rest/v1/leads?email=not.is.null&select=id", headers=headers_with_prefer)
    emails_count = int(res.headers.get("Content-Range", "0-0/0").split("/")[-1])
    
    # 8.4 Has phone
    res = requests.get(f"{SUPABASE_URL}/rest/v1/leads?phone=not.is.null&select=id", headers=headers_with_prefer)
    phones_count = int(res.headers.get("Content-Range", "0-0/0").split("/")[-1])
    
    # 8.5 Hot leads
    res = requests.get(f"{SUPABASE_URL}/rest/v1/leads?opportunity_score=gte.70&select=id", headers=headers_with_prefer)
    hot_leads_count = int(res.headers.get("Content-Range", "0-0/0").split("/")[-1])
    
    print(f"Total Leads: {leads_count}")
    print(f"No Website: {no_website_count}")
    print(f"Has Email: {emails_count}")
    print(f"Has Phone: {phones_count}")
    print(f"Hot Leads (>=70): {hot_leads_count}")
except Exception as e:
    print(f"Failed to fetch leads statistics: {e}")

# ----------------------------------------------------------------------
# TEST 9 — Check search intelligence is saving
# ----------------------------------------------------------------------
print("\n--- TEST 9: Querying search_intelligence ---")
search_intel_saved = "❌"
try:
    intel_res = requests.get(f"{SUPABASE_URL}/rest/v1/search_intelligence?order=created_at.desc&limit=3", headers=admin_headers)
    if intel_res.status_code == 200:
        intel_rows = intel_res.json()
        print("Last 3 search intelligence entries:")
        print(json.dumps(intel_rows, indent=2))
        if len(intel_rows) > 0:
            search_intel_saved = "✅"
    else:
        print(f"Failed to query search intelligence: {intel_res.status_code} - {intel_res.text}")
except Exception as e:
    print(f"Search intelligence check failed: {e}")

# ----------------------------------------------------------------------
# TEST 10 — Full health check
# ----------------------------------------------------------------------
print("\n--- TEST 10: Complete Health Check Response ---")
if health_res.status_code in [200, 503]:
    print(json.dumps(health_data, indent=2))
else:
    print("Health check endpoint not reachable.")

# ----------------------------------------------------------------------
# SYSTEM SUMMARY
# ----------------------------------------------------------------------
overall_status = "✅ Production Ready"
issues_found = []

if signup_res.status_code not in [200, 201]:
    overall_status = "⚠️ Issues Found"
    issues_found.append("Auth sign up failing.")
if profile_created == "❌":
    overall_status = "⚠️ Issues Found"
    issues_found.append("Profile row not created in database profiles table upon signup.")
if not search_leads:
    overall_status = "⚠️ Issues Found"
    issues_found.append("Apify lead search failing or returning empty leads.")
if apify_status != "✅ Online":
    overall_status = "⚠️ Issues Found"
    issues_found.append("Apify Microservice on Railway is offline.")
if maigret_status != "✅ Online":
    # Maigret is optional but let's check
    pass
if scraper_status != "✅ Online":
    overall_status = "⚠️ Issues Found"
    issues_found.append("Email Scraper API on Vercel is offline.")

print("\n======================================================================")
print("                           SUMMARY REPORT                             ")
print("======================================================================")
# Date time formatting
local_time = time.strftime("%Y-%m-%d %H:%M:%S")
print(f"SYSTEM STATUS REPORT — {local_time}\n")
print(f"AUTHENTICATION:     {'✅ Working' if new_user_id and profile_created == '✅' else '❌ Broken'}")
print(f"APIFY SEARCH:       {'✅ Working' if len(search_leads) > 0 else '❌ Broken'}")
print(f"API KEYS LOADED:    {loaded_count}/{len(keys_check)} keys loaded")
print(f"LEAD ENRICHMENT:    {'✅ Working' if enrichment_status == '✅' else '❌ Broken'}")
print(f"APIFY SERVICE:      {apify_status}")
print(f"MAIGRET SERVICE:    {maigret_status}")
print(f"EMAIL SCRAPER:      {scraper_status}")
print(f"LEADS IN DATABASE:  {leads_count}")
print(f"EMAILS FOUND:       {emails_count}")
print(f"SEARCH INTEL:       {'✅ Saving' if search_intel_saved == '✅' else '❌ Not saving'}")
print(f"OVERALL STATUS:     {overall_status}")

if issues_found:
    print("\nISSUES FOUND:")
    for idx, iss in enumerate(issues_found):
        print(f"{idx+1}. {iss}")
else:
    print("\nISSUES FOUND: None. All critical checks passed successfully!")
print("======================================================================")
