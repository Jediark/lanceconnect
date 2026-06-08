import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Mail, Send, Loader2, Linkedin, Copy, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { type Lead } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { usePipeline } from "@/contexts/PipelineContext";

// WhatsApp Brand Icon SVG
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={props.className}
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface OutreachLog {
  date: string;
  channel: "email" | "linkedin" | "whatsapp";
  subject?: string;
  message: string;
}

const parseOutreachLogs = (notes: string): OutreachLog[] => {
  if (!notes) return [];
  const match = notes.match(/<!--OUTREACH_LOGS_START-->([\s\S]*?)<!--OUTREACH_LOGS_END-->/);
  if (match) {
    try {
      return JSON.parse(match[1]).history;
    } catch {
      return [];
    }
  }
  return [];
};

const appendOutreachLog = (notes: string, newLog: OutreachLog): string => {
  const currentLogs = parseOutreachLogs(notes);
  const updatedLogs = [newLog, ...currentLogs];
  const logsString = `<!--OUTREACH_LOGS_START-->${JSON.stringify({ history: updatedLogs })}<!--OUTREACH_LOGS_END-->`;
  
  // Remove old log blocks if they exist
  const cleanNotes = notes.replace(/<!--OUTREACH_LOGS_START-->[\s\S]*?<!--OUTREACH_LOGS_END-->/, "").trim();
  
  return `${logsString}\n${cleanNotes}`.trim();
};

export function QuickConnectModal({
  open,
  onOpenChange,
  lead,
  initialChannel = "email",
  initialMessage = "",
  onLeadUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  initialChannel?: "email" | "linkedin" | "whatsapp";
  initialMessage?: string;
  onLeadUpdated?: (updated: Lead) => void;
}) {
  const [channel, setChannel] = useState<"email" | "linkedin" | "whatsapp">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [enriching, setEnriching] = useState(false);

  const { saveLead, updateStatus, pipeline } = usePipeline();

  const handleEnrich = async () => {
    if (!lead || !lead.websiteUrl || enriching) return;
    setEnriching(true);
    toast.info("Scraping website for verified contact email...");
    try {
      const { data, error } = await supabase.functions.invoke("enrich-contact", {
        body: { leadId: lead.id },
      });
      if (error) throw error;
      if (data?.lead?.email) {
        setRecipientEmail(data.lead.email);
        toast.success(`Scrape complete! Found: ${data.lead.email}`);
        if (onLeadUpdated) {
          onLeadUpdated(data.lead);
        }
      } else {
        toast.warning("No public email address found on the website.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to search website");
    } finally {
      setEnriching(false);
    }
  };

  useEffect(() => {
    if (open && lead) {
      setRecipientEmail(lead.email || "");
      setRecipientPhone(lead.phone || "");
      setSubject("");
      setChannel(initialChannel);
      
      if (initialMessage) {
        setMessage(initialMessage);
      } else if (initialChannel === "whatsapp") {
        setMessage(`Hi ${lead.businessName} team! I came across your business and wanted to reach out regarding potential collaborations. Do you guys use chat here?`);
      } else {
        setMessage("");
      }

      // Automatically trigger email finder in background if missing but website is present
      if (!lead.email && lead.websiteUrl) {
        handleEnrich();
      }
    }
  }, [open, lead?.id, initialChannel, initialMessage]);

  useEffect(() => {
    if (lead && !initialMessage) {
      if (channel === "whatsapp") {
        setMessage(`Hi ${lead.businessName} team! I came across your business and wanted to reach out regarding potential collaborations. Do you guys use chat here?`);
      } else {
        setMessage("");
      }
    }
  }, [channel, lead?.id, initialMessage]);

  // Read current logs
  const pipelineLead = pipeline.find((l) => l.id === lead?.id);
  const activeNotes = pipelineLead?.notes || lead?.notes || "";
  const outreachLogs = parseOutreachLogs(activeNotes);

  const handleSend = async () => {
    if (channel === "email" && !recipientEmail.trim()) {
      toast.error("Please enter a recipient email address.");
      return;
    }
    if (channel === "whatsapp" && !recipientPhone.trim()) {
      toast.error("Please enter a WhatsApp phone number.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setSending(true);
    try {
      let activeLead = lead;
      if (!activeLead) throw new Error("No active lead selected.");

      // 1. If lead is not saved in pipeline yet, save it first
      const isSaved = pipeline.some((l) => l.id === activeLead.id);
      if (!isSaved) {
        toast.info(`Saving ${activeLead.businessName} to pipeline...`);
        await saveLead(activeLead);
      }

      // 2. Prepare the new outreach log
      const newLog: OutreachLog = {
        date: new Date().toISOString(),
        channel,
        subject: channel === "email" ? subject : undefined,
        message,
      };

      // 3. Update status and notes in the database
      const freshPipelineLead = pipeline.find((l) => l.id === activeLead.id);
      const currentNotes = freshPipelineLead?.notes || activeLead.notes || "";
      const updatedNotes = appendOutreachLog(currentNotes, newLog);

      await updateStatus(activeLead.id, "contacted", updatedNotes);

      // 4. Fire client outreach redirection
      if (channel === "whatsapp") {
        const cleanPhone = recipientPhone.replace(/\D/g, "");
        const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank", "width=1000,height=750,status=no,toolbar=no,menubar=no");
        toast.success("Opening WhatsApp Web in a clean popup!");
      } else if (channel === "email") {
        const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoUrl;
        toast.success("Redirecting to your native email client!");
      } else if (channel === "linkedin") {
        const profileUrl = activeLead.linkedinUrl || "https://www.linkedin.com";
        window.open(profileUrl, "_blank", "width=1000,height=750");
        toast.success("Opening LinkedIn profile!");
      }

      // 5. Update UI locally
      if (onLeadUpdated) {
        onLeadUpdated({
          ...activeLead,
          status: "contacted",
          notes: updatedNotes,
        });
      }

      onOpenChange(false);
      setMessage("");
      setSubject("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to initiate outreach.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l-border bg-background flex flex-col p-0">
        <div className="p-6 pb-4 border-b border-border">
          <SheetHeader>
            <SheetTitle className="text-lg font-extrabold flex items-center gap-2">
              Quick Connect
            </SheetTitle>
            <SheetDescription className="text-xs">
              Reach out to{" "}
              {lead?.businessName ? (
                <span className="font-bold text-foreground">{lead.businessName}</span>
              ) : (
                "your lead"
              )}{" "}
              instantly.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex bg-muted p-1 rounded-xl gap-1">
            <button
              onClick={() => setChannel("email")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${channel === "email" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Mail className="h-3.5 w-3.5" /> Email
            </button>
            <button
              onClick={() => setChannel("linkedin")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${channel === "linkedin" ? "bg-[#0A66C2] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </button>
            <button
              onClick={() => setChannel("whatsapp")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${channel === "whatsapp" ? "bg-[#25D366] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
            </button>
          </div>

          <div className="space-y-4">
            {channel === "email" && (
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Recipient Email</span>
                  {enriching && (
                    <span className="text-[10px] text-primary flex items-center gap-1.5 animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Auto-crawling website...
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder={enriching ? "Searching website..." : "Enter email (e.g. info@company.com)"}
                    disabled={enriching}
                    className="w-full bg-card border border-border rounded-xl pl-3 pr-24 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                  />
                  {!recipientEmail && lead?.websiteUrl && !enriching && (
                    <button
                      type="button"
                      onClick={handleEnrich}
                      className="absolute right-2 top-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] text-primary hover:bg-primary/20 transition cursor-pointer"
                    >
                      ⚡ Find Email
                    </button>
                  )}
                </div>
                {!recipientEmail && lead?.websiteUrl && !enriching && (
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    No email address listed. Click "Find Email" to crawl their website.
                  </p>
                )}
                {!recipientEmail && !lead?.websiteUrl && (
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-slate-500" />
                    No website available. Please enter the email manually.
                  </p>
                )}
              </div>
            )}

            {channel === "whatsapp" && (
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Recipient Phone (WhatsApp)
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="Enter phone number (e.g. +2348025550198)"
                  className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {!recipientPhone && (
                  <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    No phone number available. Please enter the number manually.
                  </p>
                )}
              </div>
            )}

            {channel === "email" && (
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Quick question about your services..."
                  className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  channel === "linkedin"
                    ? "Add a note to your connection request..."
                    : channel === "whatsapp"
                      ? "Write your WhatsApp message here..."
                      : "Write your email here..."
                }
                className="w-full h-48 bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Outreach Logs Timeline */}
            {outreachLogs.length > 0 && (
              <div className="pt-5 border-t border-border/80 mt-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Outreach Logs ({outreachLogs.length})
                  </h4>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {outreachLogs.map((log, index) => (
                    <div key={index} className="rounded-xl bg-card border border-border p-3 space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          log.channel === "whatsapp" 
                            ? "bg-[#25D366]/10 text-[#25D366]" 
                            : log.channel === "linkedin" 
                              ? "bg-[#0A66C2]/10 text-[#0A66C2]" 
                              : "bg-primary/10 text-primary"
                        }`}>
                          {log.channel}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono">
                          {new Date(log.date).toLocaleDateString(undefined, { 
                            month: "short", 
                            day: "numeric", 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </div>
                      {log.subject && (
                        <div className="text-xs font-bold text-foreground">
                          Subj: {log.subject}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card/50">
          <button
            onClick={handleSend}
            disabled={sending || enriching}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50 cursor-pointer ${
              channel === "linkedin" 
                ? "bg-[#0A66C2] hover:bg-[#084e96]" 
                : channel === "whatsapp" 
                  ? "bg-[#25D366] hover:bg-[#20ba5a]" 
                  : "bg-primary hover:brightness-110 glow-primary"
            }`}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending 
              ? "Connecting..." 
              : channel === "whatsapp" 
                ? "Send via WhatsApp" 
                : channel === "linkedin" 
                  ? "Send via LinkedIn" 
                  : "Send via Email"
            }
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
