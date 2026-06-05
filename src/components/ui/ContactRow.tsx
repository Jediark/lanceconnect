import { Phone, Mail, Copy } from "lucide-react";
import { toast } from "sonner";

export function ContactRow({ phone, email }: { phone: string; email: string | null }) {
  const copy = (value: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      toast.success(`${label} copied!`);
    }
  };

  return (
    <div className="space-y-1.5 text-sm">
      <button
        type="button"
        onClick={() => copy(phone, "Phone number")}
        className="group flex w-full items-center gap-2 text-left text-foreground hover:text-primary"
      >
        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono-data">{phone}</span>
        <Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
      </button>
      {email ? (
        <button
          type="button"
          onClick={() => copy(email, "Email")}
          className="group flex w-full items-center gap-2 text-left text-foreground hover:text-primary"
        >
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">{email}</span>
          <Copy className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
        </button>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="text-xs italic">Not publicly listed</span>
        </div>
      )}
    </div>
  );
}
