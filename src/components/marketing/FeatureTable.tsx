import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";

export function FeatureTable() {
  const features = [
    { name: "Leads per month", free: "10", pro: "Unlimited", isText: true },
    { name: "Lead scoring", free: true, pro: true },
    { name: "WhatsApp access", free: true, pro: true },
    { name: "CSV export", free: true, pro: true },
    { name: "AI outreach writer", free: false, pro: true },
    { name: "Pipeline tracker", free: false, pro: true },
    { name: "Priority scoring", free: false, pro: true },
  ];

  return (
    <section className="bg-background py-20 lg:py-24 border-b border-border select-none">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            What you get
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl text-white">
            The right plan to find freelance clients at every stage.
          </h2>
        </div>

        {/* Feature Table Container with Horizontal Scroll Fade indicator on mobile */}
        <div className="relative overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {/* Scroll Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#020b21] to-transparent pointer-events-none md:hidden" />
          
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 w-1/2 text-sm font-semibold text-white/50"></th>
                <th className="py-4 w-1/4 text-center text-sm font-semibold text-white/70">
                  FREE
                </th>
                <th className="py-4 w-1/4 text-center text-sm font-semibold text-primary relative">
                  <div className="flex flex-col items-center">
                    <span className="inline-flex items-center rounded-full bg-primary/15 border border-primary/20 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wide mb-1">
                      Most Popular
                    </span>
                    <span>PRO</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, idx) => (
                <tr key={idx} className="border-b border-white/[0.08] last:border-0 hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 text-[14px] text-white/95 font-medium pr-4">
                    {f.name}
                  </td>
                  <td className="py-4 text-center text-sm">
                    {f.isText ? (
                      <span className="text-white/70 font-medium">{f.free}</span>
                    ) : f.free ? (
                      <span className="inline-flex text-primary font-bold"><Check className="h-5 w-5" /></span>
                    ) : (
                      <span className="inline-flex text-white/30"><X className="h-5 w-5" /></span>
                    )}
                  </td>
                  <td className="py-4 text-center text-sm">
                    {f.isText ? (
                      <span className="text-primary font-bold">{f.pro}</span>
                    ) : f.pro ? (
                      <span className="inline-flex text-primary font-bold"><Check className="h-5 w-5" /></span>
                    ) : (
                      <span className="inline-flex text-white/30"><X className="h-5 w-5" /></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:brightness-110 transition shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Start Free →
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto text-center rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-bold text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            View Pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
