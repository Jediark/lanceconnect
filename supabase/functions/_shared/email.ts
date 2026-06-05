/**
 * Resend Email Transactional Shared Helper
 * =========================================
 * Provides dynamic HTML email templates and sends them via Resend API.
 * API Endpoint: https://api.resend.com/emails
 */

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends a transactional email using Resend.
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY_LANCECONNECT") || Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured. Email aborted.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `LanceConnect <hello@${(Deno.env.get("APP_URL") || "https://lanceconnect.vercel.app").replace(/^https?:\/\//, "")}>`,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Resend API returned status ${res.status}: ${errText}`);
      return false;
    }

    console.log(`Email sent successfully to ${params.to}: "${params.subject}"`);
    return true;
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    return false;
  }
}

/**
 * Welcome Email Template (Registration)
 */
export function getWelcomeEmailHtml(fullName: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Welcome to LanceConnect, ${fullName}!</h2>
      <p style="color: #475569; line-height: 1.5;">We are thrilled to have you join our community. LanceConnect helps you find high-scoring freelance leads and reach out to them in seconds.</p>
      <p style="color: #475569; line-height: 1.5;">To get started:</p>
      <ul style="color: #475569; padding-left: 20px; line-height: 1.5;">
        <li>Set up your craft and location preferences.</li>
        <li>Scan for active business leads in your target market.</li>
        <li>Generate customized, AI-optimized outreach templates.</li>
      </ul>
      <p style="color: #475569; margin-top: 24px;">Best regards,<br/>The LanceConnect Team</p>
    </div>
  `;
}

/**
 * Plan Upgrade Confirmation Template
 */
export function getUpgradeEmailHtml(fullName: string, planName: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a;">Plan Upgraded Successfully! 🎉</h2>
      <p style="color: #475569; line-height: 1.5;">Hello ${fullName},</p>
      <p style="color: #475569; line-height: 1.5;">Your LanceConnect account has been successfully upgraded to the <strong style="text-transform: capitalize;">${planName}</strong> plan.</p>
      <p style="color: #475569; line-height: 1.5;">Your new lead discover quotas, templates capacity, and premium tools (like AI writer) have been unlocked on your dashboard.</p>
      <p style="color: #475569; margin-top: 24px;">Thank you for your support!<br/>The LanceConnect Team</p>
    </div>
  `;
}

/**
 * Lead limit warning at 80% usage
 */
export function getQuotaWarningEmailHtml(fullName: string, used: number, limit: number): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #b45309;">Quota Warning: 80% of Monthly Leads Used</h2>
      <p style="color: #475569; line-height: 1.5;">Hello ${fullName},</p>
      <p style="color: #475569; line-height: 1.5;">You have used <strong>${used}</strong> out of your monthly quota of <strong>${limit}</strong> leads.</p>
      <p style="color: #475569; line-height: 1.5;">To avoid interruptions in finding new clients, consider upgrading to a larger plan inside your dashboard settings.</p>
      <a href="${Deno.env.get("APP_URL") || "https://lanceconnect.vercel.app"}/app/upgrade" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px;">Upgrade Plan</a>
      <p style="color: #475569; margin-top: 24px;">Best regards,<br/>The LanceConnect Team</p>
    </div>
  `;
}

/**
 * Payment Failed Alert Template
 */
export function getPaymentFailedEmailHtml(fullName: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #be123c;">Payment Failed Notice</h2>
      <p style="color: #475569; line-height: 1.5;">Hello ${fullName},</p>
      <p style="color: #475569; line-height: 1.5;">We were unable to process your recurring subscription payment for your LanceConnect plan.</p>
      <p style="color: #475569; line-height: 1.5;">We will attempt to retry the charge in a few days. Please review and update your payment details on the dashboard to keep your premium access active.</p>
      <a href="${Deno.env.get("APP_URL") || "https://lanceconnect.vercel.app"}/app/upgrade" style="display: inline-block; background-color: #be123c; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px;">Update Payment Method</a>
      <p style="color: #475569; margin-top: 24px;">Best regards,<br/>The LanceConnect Team</p>
    </div>
  `;
}
