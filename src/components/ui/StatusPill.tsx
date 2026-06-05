import { STATUS_META, type PipelineStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function StatusPill({ status, className }: { status: PipelineStatus; className?: string }) {
  const { user } = useAuth();
  const meta = STATUS_META[status];

  const isB2B = [
    "african_food_export",
    "restaurant_supplier",
    "product_export",
    "b2b_trade",
    "human_capital",
    "training_recruitment",
  ].includes(user?.freelancerCategory || "");

  let label = meta.label;
  if (isB2B) {
    switch (status) {
      case "new":
        label = "Identified";
        break;
      case "contacted":
        label = "Contacted";
        break;
      case "interested":
        label = "Catalogue Sent";
        break;
      case "proposal_sent":
        label = "Negotiating";
        break;
      case "won":
        label = "Contract Signed";
        break;
      case "lost":
        label = "Lost";
        break;
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        meta.color,
        className,
      )}
    >
      <span>{meta.emoji}</span>
      <span>{label}</span>
    </span>
  );
}

