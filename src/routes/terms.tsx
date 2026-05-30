import { createFileRoute } from "@tanstack/react-router";
import { MarketingShell, PageHeader } from "@/components/marketing/MarketingShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service — FreelanceConnect" }, { name: "description", content: "The terms governing your use of FreelanceConnect." }],
  }),
  component: () => (
    <MarketingShell>
      <PageHeader eyebrow="Legal" title="Terms of Service" subtitle="Last updated: May 28, 2026"/>
      <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <S title="1. Agreement">By creating a FreelanceConnect account you agree to these terms. If you don't agree, please don't use the service.</S>
        <S title="2. What we provide">FreelanceConnect surfaces publicly available information about businesses (name, address, phone, ratings) to help freelancers find prospects. We do not guarantee the accuracy of any specific listing.</S>
        <S title="3. Acceptable use">You may not use FreelanceConnect to send spam, harass businesses, scrape our service in bulk, or resell our data wholesale. Outreach should be relevant and professional.</S>
        <S title="4. Your account">You're responsible for keeping your password safe. Tell us immediately at security@freelanceconnect.app if you suspect unauthorized access.</S>
        <S title="5. Payment & refunds">Paid plans renew monthly until cancelled. We offer a 14-day money-back guarantee on every paid plan — email us for a full refund, no questions asked.</S>
        <S title="6. Cancellation">You can cancel anytime from Settings → Subscription. You keep access until the end of your billing period.</S>
        <S title="7. Termination">We may suspend accounts that violate these terms, especially for spam or scraping. We'll give you a heads-up by email when possible.</S>
        <S title="8. Liability">FreelanceConnect is provided "as is". We're not liable for missed opportunities, lost clients, or how a business reacts to your outreach.</S>
        <S title="9. Disputes">Governed by the laws of England and Wales. Disputes go to the courts of London first.</S>
        <S title="10. Contact">Questions: legal@freelanceconnect.app</S>
      </article>
    </MarketingShell>
  ),
});

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-7"><h2 className="font-display text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p></section>;
}
