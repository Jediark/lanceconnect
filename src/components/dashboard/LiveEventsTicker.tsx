import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Star, Sparkles } from "lucide-react";

const MOCK_EVENTS = [
  { id: 1, text: "Apex Digital in London just opened your email", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, text: "Cafe Nero in Rome replied to your proposal", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 3, text: "You reached your daily goal of 50 new leads!", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 4, text: "AI generated a perfect pitch for Studio Q", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 5, text: "John in New York clicked your portfolio link", icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export function LiveEventsTicker({ className }: { className?: string }) {
  const [events, setEvents] = useState(MOCK_EVENTS.slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => {
        const nextIdx = Math.floor(Math.random() * MOCK_EVENTS.length);
        const newEvent = { ...MOCK_EVENTS[nextIdx], id: Date.now() };
        return [newEvent, ...prev].slice(0, 4);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("space-y-3 overflow-hidden", className)}>
      {events.map((evt, i) => {
        const Icon = evt.icon;
        return (
          <div 
            key={evt.id} 
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card animate-in slide-in-from-top-4 fade-in duration-500"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", evt.bg)}>
              <Icon className={cn("h-4 w-4", evt.color)} />
            </div>
            <p className="text-xs font-medium text-foreground truncate">{evt.text}</p>
          </div>
        );
      })}
    </div>
  );
}
