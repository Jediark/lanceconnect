import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_PIPELINE_LEADS, type Lead, type PipelineStatus } from "@/data/mockData";

type Ctx = {
  pipeline: Lead[];
  savedIds: Set<string>;
  saveLead: (lead: Lead) => void;
  removeLead: (id: string) => void;
  updateStatus: (id: string, status: PipelineStatus) => void;
};

const PipelineContext = createContext<Ctx | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [pipeline, setPipeline] = useState<Lead[]>(MOCK_PIPELINE_LEADS);

  const savedIds = new Set(pipeline.map((l) => l.id));

  const saveLead = (lead: Lead) => {
    setPipeline((prev) =>
      prev.find((l) => l.id === lead.id)
        ? prev
        : [{ ...lead, savedAt: new Date().toISOString().slice(0, 10), status: "new" as PipelineStatus, notes: "", followUpDate: null }, ...prev],
    );
  };

  const removeLead = (id: string) => setPipeline((p) => p.filter((l) => l.id !== id));

  const updateStatus = (id: string, status: PipelineStatus) =>
    setPipeline((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));

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
