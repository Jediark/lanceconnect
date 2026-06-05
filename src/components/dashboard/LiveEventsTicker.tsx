import { cn } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  Sparkles,
  Globe,
  Activity,
  HelpCircle,
  Mail,
  PlusCircle
} from "lucide-react";

export type ActivityItem = {
  id: string;
  action: string;
  entityType: string;
  metadata: any;
  createdAt: string;
};

const ACTION_MAP: Record<
  string,
  {
    icon: any;
    color: string;
    bg: string;
    getText: (meta: any) => string;
  }
> = {
  "lead.searched": {
    icon: Search,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    getText: (meta) => `Searched for ${meta.query || "leads"} in ${meta.city || "local area"}`,
  },
  "lead.seo_audited": {
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    getText: (meta) => `Ran SEO audit on ${meta.business_name || "business"}`,
  },
  "lead.social_scanned": {
    icon: Globe,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    getText: (meta) => `Scanned socials for ${meta.username_searched || "business"}`,
  },
  "lead.saved": {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    getText: (meta) => `Saved ${meta.business_name || "lead"} to pipeline`,
  },
  "lead.status_updated": {
    icon: Activity,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    getText: (meta) => `Moved ${meta.business_name || "lead"} to ${meta.status || "next stage"}`,
  },
  "user.registered": {
    icon: PlusCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    getText: () => "Welcome to LanceConnect! Profile initialized.",
  }
};

export function LiveEventsTicker({
  activities = [],
  className,
}: {
  activities?: ActivityItem[];
  className?: string;
}) {
  if (!activities || activities.length === 0) {
    return (
      <div className={cn("space-y-3 select-none", className)}>
        <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border rounded-xl bg-card/25">
          <Activity className="h-5 w-5 text-muted-foreground/40 mb-2" />
          <p className="text-[11px] text-muted-foreground max-w-[180px] leading-relaxed">
            No activity logged yet. Find and save leads above to build your feed!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2.5 overflow-hidden select-none", className)}>
      {activities.map((evt, i) => {
        const config = ACTION_MAP[evt.action] || {
          icon: HelpCircle,
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          getText: (meta) => `${evt.action.replace(".", " ")}: ${meta.business_name || ""}`,
        };
        const Icon = config.icon;
        const text = config.getText(evt.metadata || {});

        return (
          <div
            key={evt.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card animate-in slide-in-from-top-3 fade-in duration-300"
            style={{ opacity: Math.max(0.4, 1 - i * 0.15) }}
          >
            <div className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg", config.bg)}>
              <Icon className={cn("h-3.5 w-3.5", config.color)} />
            </div>
            <p className="text-[11px] font-medium text-foreground truncate leading-none">{text}</p>
          </div>
        );
      })}
    </div>
  );
}
