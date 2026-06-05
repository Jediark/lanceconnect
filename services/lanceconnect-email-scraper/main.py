# LanceConnect Email Scraper API
# Deploy this on Railway (already your hosting platform)
# It automatically chains with Apify, Mailboxlayer, and Numverify
# Free forever — no API key needed for this service

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import re
import os
import logging
from typing import Optional
from urllib.parse import urlparse, urljoin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="LanceConnect Email Scraper",
    description="Free email scraper microservice for LanceConnect",
    version="1.0.0"
)

# CORS — only allow your Railway backend and Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("APP_URL", "https://lanceconnect.vercel.app"),
        "https://lanceconnect.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Internal API key — same one used across all LanceConnect services
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY")

# Email regex pattern — catches all standard email formats
EMAIL_PATTERN = re.compile(
    r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}',
    re.IGNORECASE
)

# Emails to always filter out — noise/system addresses
JUNK_PREFIXES = (
    'noreply', 'no-reply', 'donotreply', 'do-not-reply',
    'mailer', 'bounce', 'postmaster', 'webmaster',
    'admin', 'test', 'example', 'sample', 'demo',
    'support@sentry', 'privacy@', 'legal@',
)

# File extensions to skip — these are never real emails
JUNK_EXTENSIONS = (
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.css', '.js', '.php', '.html', '.xml', '.woff',
)


class ScrapeRequest(BaseModel):
    url: str
    deduplicate: bool = True
    filter_noreply: bool = True
    lowercase: bool = True
    follow_contact_page: bool = True  # Also check /contact page


class ScrapeResult(BaseModel):
    url: str
    emails: list[str]
    count: int
    source: str  # 'homepage', 'contact_page', 'both', 'none'
    error: Optional[str] = None


def clean_url(url: str) -> str:
    """Ensure URL has a scheme"""
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url.rstrip('/')


def extract_emails_from_html(html: str) -> list[str]:
    """Extract all email addresses from HTML content"""
    # Also decode HTML entities that might hide emails
    html = html.replace('&#64;', '@').replace('%40', '@')
    html = html.replace('[at]', '@').replace('(at)', '@')
    html = html.replace('[dot]', '.').replace('(dot)', '.')

    found = EMAIL_PATTERN.findall(html)
    return found


def filter_emails(
    emails: list[str],
    filter_noreply: bool = True,
    lowercase: bool = True
) -> list[str]:
    """Clean and filter email list"""
    result = []

    for email in emails:
        if lowercase:
            email = email.lower()

        # Skip junk file extensions (false positives)
        if any(email.endswith(ext) for ext in JUNK_EXTENSIONS):
            continue

        # Skip obviously fake/system emails
        if filter_noreply:
            if any(email.startswith(prefix) for prefix in JUNK_PREFIXES):
                continue

        # Must have valid structure
        parts = email.split('@')
        if len(parts) != 2:
            continue
        if len(parts[0]) < 1 or len(parts[1]) < 3:
            continue
        if '.' not in parts[1]:
            continue

        result.append(email)

    return result


def get_contact_page_url(base_url: str) -> list[str]:
    """Generate likely contact page URLs to check"""
    base = clean_url(base_url)
    return [
        f"{base}/contact",
        f"{base}/contact-us",
        f"{base}/about",
        f"{base}/about-us",
        f"{base}/reach-us",
        f"{base}/get-in-touch",
    ]


async def fetch_page(client: httpx.AsyncClient, url: str) -> Optional[str]:
    """Fetch a page and return its HTML"""
    try:
        response = await client.get(
            url,
            follow_redirects=True,
            timeout=10.0
        )
        if response.status_code == 200:
            return response.text
        return None
    except Exception as e:
        logger.warning(f"Failed to fetch {url}: {e}")
        return None


@app.post("/scrape", response_model=ScrapeResult)
async def scrape_emails(
    request: ScrapeRequest,
    x_internal_key: str = Header(None)
):
    """
    Scrape emails from a business website.
    Called automatically by LanceConnect's enrich-contact Edge Function.
    """

    # Validate internal API key
    if INTERNAL_API_KEY and x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    url = clean_url(request.url)
    all_emails = []
    source = 'none'

    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; LanceConnect/1.0; +https://lanceconnect.vercel.app)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }

    async with httpx.AsyncClient(headers=headers) as client:

        # Step 1: Scrape homepage
        homepage_html = await fetch_page(client, url)
        if homepage_html:
            homepage_emails = extract_emails_from_html(homepage_html)
            all_emails.extend(homepage_emails)
            if homepage_emails:
                source = 'homepage'
            logger.info(f"Homepage {url}: found {len(homepage_emails)} emails")

        # Step 2: Also check contact/about pages (often has email when homepage doesn't)
        if request.follow_contact_page:
            contact_urls = get_contact_page_url(url)
            for contact_url in contact_urls[:3]:  # Check top 3 variants
                contact_html = await fetch_page(client, contact_url)
                if contact_html:
                    contact_emails = extract_emails_from_html(contact_html)
                    if contact_emails:
                        all_emails.extend(contact_emails)
                        source = 'contact_page' if source == 'none' else 'both'
                        logger.info(
                            f"Contact page {contact_url}: "
                            f"found {len(contact_emails)} emails"
                        )
                        break  # Found emails, stop checking more contact pages

    # Filter and clean
    filtered = filter_emails(
        all_emails,
        filter_noreply=request.filter_noreply,
        lowercase=request.lowercase
    )

    # Deduplicate while preserving order
    if request.deduplicate:
        seen = set()
        unique = []
        for email in filtered:
            if email not in seen:
                seen.add(email)
                unique.append(email)
        filtered = unique

    logger.info(
        f"Scrape complete for {url}: "
        f"{len(filtered)} clean emails from {source}"
    )

    return ScrapeResult(
        url=url,
        emails=filtered,
        count=len(filtered),
        source=source
    )


@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "lanceconnect-email-scraper",
        "version": "1.0.0"
    }


@app.get("/")
def root():
    return {
        "service": "LanceConnect Email Scraper API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8003)),
        reload=False
    )
