import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Mail, Send, Loader2, Linkedin } from "lucide-react";
import { toast } from "sonner";

export function QuickConnectModal({ 
  open, 
  onOpenChange, 
  lead 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  lead?: { businessName: string; email?: string | null };
}) {
  const [channel, setChannel] = useState<"email" | "linkedin">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = () => {
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
              Reach out to {lead?.businessName ? <span className="font-bold text-foreground">{lead.businessName}</span> : "your lead"} instantly.
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
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Recipient</label>
                <input 
                  type="email" 
                  defaultValue={lead?.email || ""} 
                  placeholder="contact@business.com" 
                  className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" 
                />
              </div>
            )}
            {channel === "email" && (
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subject</label>
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
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={channel === "linkedin" ? "Add a note to your connection request..." : "Write your email here..."}
                className="w-full h-48 bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card/50">
          <button 
            onClick={handleSend} 
            disabled={sending}
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
