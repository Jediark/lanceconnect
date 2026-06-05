import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MOCK_PIPELINE_LEADS, type Lead, type PipelineStatus } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Ctx = {
  pipeline: Lead[];
  savedIds: Set<string>;
  saveLead: (lead: Lead) => Promise<void>;
  removeLead: (id: string) => Promise<void>;
  updateStatus: (id: string, status: PipelineStatus, notes?: string, followUpDate?: string | null, dealValue?: number | null) => Promise<void>;
};

const PipelineContext = createContext<Ctx | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [pipeline, setPipeline] = useState<Lead[]>(MOCK_PIPELINE_LEADS);

  const savedIds = new Set(pipeline.map((l) => l.id));

  const fetchPipeline = async () => {
    if (!user || user.id === "user-1") return;
    try {
      const { data, error } = await supabase
        .from("user_leads")
        .select(`
          *,
          lead:leads(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const mapped = (data || []).map((ul: any) => {
        const lead = ul.lead;
        return {
          id: lead.id,
          businessName: lead.business_name,
          businessType: lead.business_type,
          industry: lead.industry,
          city: lead.city,
          country: lead.country,
          fullAddress: lead.full_address,
          phone: lead.phone,
          email: lead.email,
          websiteUrl: lead.website_url,
          hasWebsite: lead.has_website,
          googleRating: Number(lead.google_rating || 0),
          googleReviewCount: Number(lead.google_review_count || 0),
          opportunityScore: Number(lead.opportunity_score || 0),
          source: lead.source || "google_maps",
          createdAt: lead.created_at || new Date().toISOString(),
          savedAt: ul.saved_at ? ul.saved_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
          status: ul.status as PipelineStatus,
          notes: ul.notes || "",
          followUpDate: ul.follow_up_date,
          dealValue: ul.deal_value ? Number(ul.deal_value) : null,
        };
      });

      setPipeline(mapped);
    } catch (err) {
      console.error("Error loading pipeline from database:", err);
    }
  };

  useEffect(() => {
    if (user && user.id !== "user-1") {
      fetchPipeline();
    } else {
      setPipeline(MOCK_PIPELINE_LEADS);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.id === "user-1") return;

    const channel = supabase
      .channel("pipeline-lead-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          const updatedLead = payload.new;
          setPipeline((prev) =>
            prev.map((l) =>
              l.id === updatedLead.id
                ? {
                    ...l,
                    phone: updatedLead.phone || l.phone,
                    email: updatedLead.email || l.email,
                    websiteUrl: updatedLead.website_url || l.websiteUrl,
                    hasWebsite: updatedLead.has_website !== undefined ? updatedLead.has_website : l.hasWebsite,
                    googleRating: updatedLead.google_rating !== undefined ? Number(updatedLead.google_rating) : l.googleRating,
                    googleReviewCount: updatedLead.google_review_count !== undefined ? Number(updatedLead.google_review_count) : l.googleReviewCount,
                    opportunityScore: updatedLead.opportunity_score !== undefined ? Number(updatedLead.opportunity_score) : l.opportunityScore,
                  }
                : l
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const saveLead = async (lead: Lead) => {
    if (!user || user.id === "user-1") {
      setPipeline((prev) =>
        prev.find((l) => l.id === lead.id)
          ? prev
          : [{ ...lead, savedAt: new Date().toISOString().slice(0, 10), status: "new" as PipelineStatus, notes: "", followUpDate: null }, ...prev],
      );
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("pipeline-ops", {
        body: {
          action: "save",
          leadId: lead.id,
          status: "new"
        }
      });
      if (error) throw error;

      setPipeline((prev) => [
        { ...lead, savedAt: new Date().toISOString().slice(0, 10), status: "new" as PipelineStatus, notes: "", followUpDate: null },
        ...prev
      ]);
    } catch (err) {
      console.error("Error saving lead to database:", err);
    }
  };

  const removeLead = async (id: string) => {
    if (!user || user.id === "user-1") {
      setPipeline((p) => p.filter((l) => l.id !== id));
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("pipeline-ops", {
        body: {
          action: "delete",
          leadId: id
        }
      });
      if (error) throw error;

      setPipeline((p) => p.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Error deleting lead from database pipeline:", err);
    }
  };

  const updateStatus = async (
    id: string, 
    status: PipelineStatus, 
    notes?: string, 
    followUpDate?: string | null, 
    dealValue?: number | null
  ) => {
    if (!user || user.id === "user-1") {
      setPipeline((p) => p.map((l) => (l.id === id ? { 
        ...l, 
        status, 
        notes: notes !== undefined ? notes : l.notes, 
        followUpDate: followUpDate !== undefined ? followUpDate : l.followUpDate,
        dealValue: dealValue !== undefined ? dealValue : l.dealValue 
      } : l)));
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("pipeline-ops", {
        body: {
          action: "update",
          leadId: id,
          status,
          notes,
          followUpDate,
          dealValue
        }
      });
      if (error) throw error;

      setPipeline((p) =>
        p.map((l) =>
          l.id === id
            ? {
                ...l,
                status,
                notes: notes !== undefined ? notes : l.notes,
                followUpDate: followUpDate !== undefined ? followUpDate : l.followUpDate,
                dealValue: dealValue !== undefined ? dealValue : l.dealValue,
              }
            : l
        )
      );
    } catch (err) {
      console.error("Error updating lead status in database:", err);
    }
  };

  return (
    <PipelineContext.Provider value={{ pipeline, savedIds, saveLead, removeLead, updateStatus }}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline inside PipelineProvider");
  return ctx;
}
