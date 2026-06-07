import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Mail, Send, Loader2, Linkedin, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { type Lead } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

export function QuickConnectModal({
  open,
  onOpenChange,
  lead,
  onLeadUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  onLeadUpdated?: (updated: Lead) => void;
}) {
  const [channel, setChannel] = useState<"email" | "linkedin">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [enriching, setEnriching] = useState(false);

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
      setSubject("");
      setMessage("");

      // Automatically trigger email finder in background if missing but website is present
      if (!lead.email && lead.websiteUrl) {
        handleEnrich();
      }
    }
  }, [open, lead?.id]);

  const handleSend = () => {
    if (channel === "email" && !recipientEmail.trim()) {
      toast.error("Please enter a recipient email address.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(`Message sent to ${lead?.businessName || "lead"} via ${channel}!`);
      onOpenChange(false);
      setMessage("");
      setSubject("");
    }, 1500);
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
          <div className="flex bg-muted p-1 rounded-xl">
            <button
              onClick={() => setChannel("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${channel === "email" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              onClick={() => setChannel("linkedin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${channel === "linkedin" ? "bg-[#0A66C2] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
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
                    : "Write your email here..."
                }
                className="w-full h-48 bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card/50">
          <button
            onClick={handleSend}
            disabled={sending || enriching}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50 ${channel === "linkedin" ? "bg-[#0A66C2] hover:bg-[#084e96]" : "bg-primary hover:brightness-110 glow-primary"}`}
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : `Send via ${channel === "email" ? "Email" : "LinkedIn"}`}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
