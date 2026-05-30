import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FreelanceConnect" },
      { name: "description", content: "How we collect, use, and protect your data." },
    ],
  }),
  component: () => (
    <MarketingShell>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: May 28, 2026"/>
      <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8 prose-styles">
        <Section title="1. Who we are">
          <p>FreelanceConnect Ltd. ("we", "us", "our") operates the FreelanceConnect platform. We're registered in the United Kingdom. You can reach us at <a className="text-primary underline" href="mailto:privacy@freelanceconnect.app">privacy@freelanceconnect.app</a>.</p>
        </Section>
        <Section title="2. What data we collect">
          <ul><li><b>Account data:</b> name, email, password (hashed), country.</li><li><b>Usage data:</b> which features you use, how often you log in, your IP address.</li><li><b>Lead-related data:</b> which leads you save, your notes, your pipeline activity.</li><li><b>Payment data:</b> handled by our payment processor — we never see your full card number.</li></ul>
        </Section>
        <Section title="3. How we use it">
          <p>We use your data to operate the service, send transactional emails (password resets, billing receipts), and improve the product. We do not sell your data. We do not share your data with third parties for marketing.</p>
        </Section>
        <Section title="4. Where data is stored">
          <p>Servers are located in the EU (Frankfurt) and US (Virginia), with backups in both regions. We use industry-standard encryption at rest and in transit.</p>
        </Section>
        <Section title="5. Your GDPR rights">
          <p>If you live in the EU or UK, you have the right to access, correct, export, or delete your data at any time. Email <a className="text-primary underline" href="mailto:privacy@freelanceconnect.app">privacy@freelanceconnect.app</a> and we'll respond within 30 days.</p>
        </Section>
        <Section title="6. Cookies">
          <p>We use functional cookies (to keep you logged in) and a single first-party analytics cookie. We do not use third-party advertising cookies.</p>
        </Section>
        <Section title="7. Children">
          <p>FreelanceConnect is not intended for users under 16.</p>
        </Section>
        <Section title="8. Changes">
          <p>We'll notify you by email if we make material changes to this policy.</p>
        </Section>
      </article>
    </MarketingShell>
  ),
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-8"><h2 className="font-display text-xl font-bold">{title}</h2><div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div></section>;
}
