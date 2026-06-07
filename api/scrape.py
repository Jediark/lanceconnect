import httpx
import re
import os
import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

EMAIL_PATTERN = re.compile(
    r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}',
    re.IGNORECASE
)

JUNK_PREFIXES = (
    'noreply', 'no-reply', 'donotreply', 'do-not-reply',
    'mailer', 'bounce', 'postmaster', 'webmaster',
    'admin', 'test', 'example', 'sample', 'demo',
)

JUNK_EXTENSIONS = (
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.css', '.js', '.php', '.html', '.xml', '.woff',
)

INTERNAL_API_KEY = os.environ.get('INTERNAL_API_KEY')


def clean_url(url: str) -> str:
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url.rstrip('/')


def extract_emails(html: str) -> list:
    html = html.replace('&#64;', '@').replace('%40', '@')
    html = html.replace('[at]', '@').replace('(at)', '@')
    html = html.replace('[dot]', '.').replace('(dot)', '.')
    return EMAIL_PATTERN.findall(html)


def filter_emails(emails: list) -> list:
    result = []
    seen = set()
    for email in emails:
        email = email.lower()
        if any(email.endswith(ext) for ext in JUNK_EXTENSIONS):
            continue
        if any(email.startswith(p) for p in JUNK_PREFIXES):
            continue
        parts = email.split('@')
        if len(parts) != 2 or '.' not in parts[1]:
            continue
        if email not in seen:
            seen.add(email)
            result.append(email)
    return result


async def fetch_page(url: str) -> str:
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; LanceConnect/1.0)',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    }
    try:
        async with httpx.AsyncClient(
            headers=headers,
            follow_redirects=True,
            timeout=10.0
        ) as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.text
    except Exception:
        pass
    return ''


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        # Validate internal API key
        api_key = self.headers.get('X-Internal-Key')
        if INTERNAL_API_KEY and api_key != INTERNAL_API_KEY:
            self.send_response(401)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
            return

        # Parse request body
        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length))

        url = clean_url(body.get('url', ''))
        if not url:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'URL required'}).encode())
            return

        import asyncio

        async def scrape():
            all_emails = []
            source = 'none'

            # Scrape homepage
            html = await fetch_page(url)
            if html:
                found = extract_emails(html)
                all_emails.extend(found)
                if found:
                    source = 'homepage'

            # Scrape contact page
            contact_url = url + '/contact'
            contact_html = await fetch_page(contact_url)
            if contact_html:
                found = extract_emails(contact_html)
                if found:
                    all_emails.extend(found)
                    source = 'contact_page' if source == 'none' else 'both'

            # Also try /about
            if source == 'none':
                about_html = await fetch_page(url + '/about')
                if about_html:
                    found = extract_emails(about_html)
                    if found:
                        all_emails.extend(found)
                        source = 'about_page'

            filtered = filter_emails(all_emails)
            return filtered, source

        emails, source = asyncio.run(scrape())

        result = {
            'url': url,
            'emails': emails,
            'count': len(emails),
            'source': source
        }

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def do_GET(self):
        # Ping Supabase health-check to prevent the database from going to sleep
        try:
            import urllib.request
            supabase_url = os.environ.get('VITE_SUPABASE_URL', 'https://rpaodsmwhmzyhopvkwjt.supabase.co')
            import ssl
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            req = urllib.request.Request(
                f"{supabase_url.rstrip('/')}/functions/v1/health-check",
                headers={'User-Agent': 'Mozilla/5.0 (compatible; LanceConnectKeepAlive/1.0)'}
            )
            with urllib.request.urlopen(req, timeout=8, context=ctx) as response:
                response.read()
            print("Successfully pinged Supabase health-check to keep database awake.")
        except Exception as e:
            print("Keep alive ping failed:", e)

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            'service': 'LanceConnect Email Scraper',
            'status': 'healthy',
            'version': '1.0.0'
        }).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Internal-Key')
        self.end_headers()
