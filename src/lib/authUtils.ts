// Client-side authentication utilities for anti-abuse checks

// Cyrb53: Fast, high-quality, non-cryptographic hash function
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
};

// Generates a lightweight, zero-dependency browser canvas fingerprint
export function getBrowserFingerprint(): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "ssr-env";
  }

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let canvasData = "canvas-unsupported";

    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;

      // Text drawing with font combinations
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial', 'Segoe UI', 'Helvetica Neue', sans-serif";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("LanceConnect, antiabuse", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("canvas fingerprint 😄", 2, 30);

      // Blend modes and geometry
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgb(255,0,255)";
      ctx.beginPath();
      ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = "rgb(0,255,255)";
      ctx.beginPath();
      ctx.arc(60, 25, 20, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = "rgb(255,255,0)";
      ctx.beginPath();
      ctx.arc(55, 30, 20, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      canvasData = canvas.toDataURL();
    }

    // Combine canvas rendering signature with other stable browser properties
    const hardwareInfo = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      screen.colorDepth,
      screen.pixelDepth,
      new Date().getTimezoneOffset(),
      canvasData,
    ].join("|");

    return cyrb53(hardwareInfo);
  } catch (err) {
    console.error("Failed to generate fingerprint:", err);
    return "error-generating-fingerprint";
  }
}

// Normalizes an email address to standard format (removes dots, strips + tag for Gmail)
export function normalizeEmail(email: string): string {
  const clean = email.trim().toLowerCase();
  const parts = clean.split("@");
  if (parts.length !== 2) return clean;

  let [user, domain] = parts;

  // Standardize Google mail domains
  if (domain === "gmail.com" || domain === "googlemail.com") {
    // Strip everything after '+'
    user = user.split("+")[0];
    // Strip all dots
    user = user.replace(/\./g, "");
    domain = "gmail.com";
  }

  return `${user}@${domain}`;
}

// Blocklist of popular temporary / disposable email providers
const DISPOSABLE_DOMAINS = new Set([
  "yopmail.com",
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "guerrillamail.com",
  "dispostable.com",
  "maildrop.cc",
  "getairmail.com",
  "temp-mail.org",
  "boun.cr",
  "chacuo.net",
  "crazymailing.com",
  "decoymail.com",
  "drdrb.net",
  "emailondeck.com",
  "harakirimail.com",
  "mailnesia.com",
  "mailspammer.com",
  "mytrashmail.com",
  "safetymail.info",
  "sendspaminator.com",
  "spamgourmet.com",
  "trashmail.com",
  "wetfish.de",
  "guerrillamailblock.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "grr.la",
  "guerrillamail.de",
  "tempmailaddress.com",
  "tempmail.net",
  "tempmail.co",
  "tempmail.us",
  "disposablemail.com",
  "spam4.me",
  "discard.email",
  "discardmail.com",
  "discardmail.de",
  "spambox.us",
  "spambox.org",
  "fakeinbox.com",
  "zippymail.in",
  "inboxkitten.com"
]);

// Returns true if the email domain is in the disposable blocklist
export function isDisposableEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  const parts = clean.split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];
  return DISPOSABLE_DOMAINS.has(domain);
}
