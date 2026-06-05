import { Briefcase, Globe, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UnifiedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  category: string;
  published_at: string;
  source: "themuse" | "arbeitnow";
  tags: string[];
}

export function OnlineJobCard({ job }: { job: UnifiedJob }) {
  // Simple helper to clean up HTML descriptions if needed, or truncate text
  const cleanDescription = (htmlStr: string) => {
    if (!htmlStr) return "";
    const clean = htmlStr.replace(/<\/?[^>]+(>|$)/g, " ");
    return clean.length > 180 ? clean.slice(0, 180).trim() + "..." : clean;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="group relative flex w-full flex-col rounded-2xl border border-border/90 bg-card p-5 text-left transition-all duration-300 hover:border-primary/50 hover:bg-card/80">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors truncate">
            {job.title}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            {job.company}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
            <Globe className="h-3 w-3" /> {job.location || "Remote"}
          </p>
        </div>
        <Badge
          className={
            job.source === "themuse"
              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
          }
          variant="outline"
        >
          {job.source === "themuse" ? "The Muse" : "Arbeitnow"}
        </Badge>
      </div>

      <p className="my-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
        {cleanDescription(job.description)}
      </p>

      {job.tags && job.tags.length > 0 && (
        <div className="mt-1 mb-4 flex flex-wrap gap-1">
          {job.tags.slice(0, 4).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-[10px] font-normal px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-dashed border-border/80 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" /> {formatDate(job.published_at)}
        </span>
        <Button
          asChild
          size="sm"
          className="text-xs font-medium gap-1.5 h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            Apply <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
