import { STATUS_META, type PipelineStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function StatusPill({ status, className }: { status: PipelineStatus; className?: string }) {
  const { user } = useAuth();
  const meta = STATUS_META[status];

  const PIPELINE_STAGES: Record<string, Record<PipelineStatus, string>> = {
    supplier: { new: 'Identified', contacted: 'Contacted', interested: 'Catalogue Sent', proposal_sent: 'Negotiating', won: 'Contract Signed', lost: 'Lost' },
    human_capital: { new: 'Identified', contacted: 'Contacted', interested: 'Needs Assessment', proposal_sent: 'Proposal Sent', won: 'Contract Signed', lost: 'Lost' },
    training_recruitment: { new: 'Identified', contacted: 'Contacted', interested: 'Requirements Gathered', proposal_sent: 'Candidates Submitted', won: 'Placed', lost: 'Lost' },
    tutor: { new: 'Identified', contacted: 'Contacted', interested: 'Trial Session', proposal_sent: 'Regular Student', won: 'Completed', lost: 'Dropped' },
    freelance: { new: 'New', contacted: 'Contacted', interested: 'Interested', proposal_sent: 'Proposal Sent', won: 'Won', lost: 'Lost' },
  };

  const getPipelineType = (category: string): string => {
    if (['african_food_export','restaurant_supplier','product_export','b2b_trade'].includes(category)) return 'supplier';
    if (category === 'human_capital') return 'human_capital';
    if (category === 'training_recruitment') return 'training_recruitment';
    if (['tutor','parent_tutor'].includes(category)) return 'tutor';
    return 'freelance';
  };

  const type = getPipelineType(user?.freelancerCategory || "");
  const label = PIPELINE_STAGES[type]?.[status] || meta.label;

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

