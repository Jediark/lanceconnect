import httpx
import re
import os
import json
import asyncio
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

GENERIC_PROVIDERS = {
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 
    'aol.com', 'icloud.com', 'mail.com', 'zoho.com', 'yandex.com', 
    'protonmail.com', 'proton.me', 'mail.ru', 'gmx.com'
}

CONTACT_PREFIXES = {
    'info', 'contact', 'hello', 'support', 'connect', 'enquiry', 'enquiries',
    'sales', 'team', 'ops', 'office', 'booking', 'bookings', 'admin', 'mail'
}

INTERNAL_API_KEY = os.environ.get('INTERNAL_API_KEY')


def clean_url(url: str) -> str:
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url.rstrip('/')


def get_social_platform(url: str) -> str:
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        for domain in ['facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com', 'medium.com', 'youtube.com', 'tiktok.com', 'pinterest.com']:
            if domain in netloc:
                return domain.split('.')[0]
    except Exception:
        pass
    return ''


def clean_fb_url(url: str) -> str:
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        if 'facebook.com' in netloc and 'mbasic.facebook.com' not in netloc:
            new_netloc = 'mbasic.facebook.com'
            parsed = parsed._replace(netloc=new_netloc)
            return parsed.geturl()
    except Exception:
        pass
    return url


def extract_emails(html: str) -> list:
    # Handle javascript/unicode escapes for email obfuscation
    html = html.replace('\\u0040', '@').replace('\u0040', '@')
    html = html.replace('\\u002e', '.').replace('\u002e', '.')
    
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


def extract_contact_links(html: str, base_url: str) -> list:
    try:
        parsed_base = urlparse(base_url)
        base_origin = f"{parsed_base.scheme}://{parsed_base.netloc}"
        base_domain = parsed_base.hostname.replace('www.', '').lower() if parsed_base.hostname else ''
    except Exception:
        return []

    hrefs = re.findall(r'href=["\']([^"\']+)["\']', html, re.IGNORECASE)
    discovered = set()
    
    target_words = ['contact', 'about', 'support', 'info', 'reach', 'team', 'connect']
    
    for href in hrefs:
        href = href.strip()
        if not href:
            continue
        
        href_lower = href.lower()
        if not any(word in href_lower for word in target_words):
            continue
            
        if any(href_lower.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.pdf', '.zip', '.doc', '.docx']):
            continue

        full_url = href
        if href.startswith('//'):
            full_url = parsed_base.scheme + ":" + href
        elif href.startswith('/'):
            full_url = base_origin + href
        elif not href.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#')):
            full_url = base_url.rstrip('/') + '/' + href
        
        try:
            parsed_full = urlparse(full_url)
            if parsed_full.scheme in ('http', 'https'):
                full_domain = parsed_full.hostname.replace('www.', '').lower() if parsed_full.hostname else ''
                if base_domain == full_domain:
                    discovered.add(full_url)
        except Exception:
            pass
            
    return list(discovered)


def score_email(email: str, base_url: str, business_name: str = '', city: str = '', country: str = '') -> int:
    email = email.lower()
    score = 0
    
    try:
        parts = email.split('@')
        prefix = parts[0]
        email_domain = parts[1]
    except Exception:
        return -9999
        
    try:
        parsed_base = urlparse(base_url)
        site_domain = parsed_base.hostname.replace('www.', '').lower() if parsed_base.hostname else ''
    except Exception:
        site_domain = ''

    # Rule 1: Match domain
    if site_domain and email_domain == site_domain:
        score += 50
    elif email_domain not in GENERIC_PROVIDERS:
        score -= 100
        
    # Rule 2: Match Business Name
    if business_name:
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', business_name).lower()
        words = [w for w in clean_name.split() if len(w) >= 3]
        for word in words:
            if word in prefix:
                score += 40
            elif word in email_domain:
                score += 25

    # Rule 3: Match City / Country
    if city:
        city_clean = city.lower().strip()
        if len(city_clean) >= 3:
            if city_clean in prefix:
                score += 30
            elif city_clean in email_domain:
                score += 15
                
    if country:
        country_clean = country.lower().strip()
        if len(country_clean) >= 3:
            if country_clean in prefix:
                score += 30
            elif country_clean in email_domain:
                score += 15

    # Rule 4: Match common contact prefixes
    if prefix in CONTACT_PREFIXES:
        score += 10
    elif any(c_pref in prefix for c_pref in CONTACT_PREFIXES):
        score += 5

    return score


async def fetch_page(url: str, user_agent: str = None) -> str:
    if not user_agent:
        user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    
    headers = {
        'User-Agent': user_agent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
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
        api_key = self.headers.get('X-Internal-Key')
        if INTERNAL_API_KEY and api_key != INTERNAL_API_KEY:
            self.send_response(401)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
            return

        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length))

        url = clean_url(body.get('url', ''))
        business_name = body.get('businessName', '')
        city = body.get('city', '')
        country = body.get('country', '')

        if not url:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'URL required'}).encode())
            return

        async def scrape():
            all_emails = []
            source_pages = []
            
            platform = get_social_platform(url)
            target_url = clean_fb_url(url) if platform == 'facebook' else url
            
            # Use Googlebot for social media platforms to bypass login walls/redirects
            ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' if platform else None
            
            html = await fetch_page(target_url, user_agent=ua)
            if html:
                found = extract_emails(html)
                if found:
                    all_emails.extend(found)
                    source_pages.append(platform if platform else 'homepage')
            
            if platform:
                filtered = filter_emails(all_emails)
                filtered.sort(key=lambda e: score_email(e, url, business_name, city, country), reverse=True)
                return filtered, platform
                
            discovered_links = []
            if html:
                discovered_links = extract_contact_links(html, url)
                
            discovered_links = list(set(discovered_links))[:3]
            
            fallback_paths = ['/contact', '/contact-us', '/contact-us/', '/about', '/about-us', '/about-us/']
            for path in fallback_paths:
                fallback_url = url + path
                if fallback_url not in discovered_links:
                    discovered_links.append(fallback_url)
            
            urls_to_crawl = list(set(discovered_links))[:6]
            
            tasks = [fetch_page(u) for u in urls_to_crawl]
            results = await asyncio.gather(*tasks)
            
            for u, sub_html in zip(urls_to_crawl, results):
                if sub_html:
                    found = extract_emails(sub_html)
                    if found:
                        all_emails.extend(found)
                        source_pages.append(urlparse(u).path)
                        
            filtered = filter_emails(all_emails)
            filtered.sort(key=lambda e: score_email(e, url, business_name, city, country), reverse=True)
            
            source = ','.join(set(source_pages)) if source_pages else 'none'
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
