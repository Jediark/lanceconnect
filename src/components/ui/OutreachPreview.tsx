import React from "react";
import { cn } from "@/lib/utils";

interface OutreachPreviewProps {
  channel: "email" | "whatsapp" | "sms" | "linkedin" | "phone_script" | "letter";
  value: string;
  onChange: (val: string) => void;
  senderName: string;
  businessName: string;
  businessEmail?: string;
  placeholder?: string;
}

export function OutreachPreview({
  channel,
  value,
  onChange,
  senderName,
  businessName,
  businessEmail = "info@business.com",
  placeholder = "",
}: OutreachPreviewProps) {
  // Parse subject and body for email
  let subject = `Quick question about ${businessName}`;
  let emailBody = value;

  if (value) {
    if (value.toLowerCase().startsWith("subject:")) {
      const firstLineEnd = value.indexOf("\n");
      if (firstLineEnd !== -1) {
        subject = value.slice(8, firstLineEnd).trim();
        emailBody = value.slice(firstLineEnd).trim();
      } else {
        subject = value.slice(8).trim();
        emailBody = "";
      }
    } else if (value.toLowerCase().startsWith("subject ")) {
      const firstLineEnd = value.indexOf("\n");
      if (firstLineEnd !== -1) {
        subject = value.slice(7, firstLineEnd).trim();
        emailBody = value.slice(firstLineEnd).trim();
      } else {
        subject = value.slice(7).trim();
        emailBody = "";
      }
    }
  }

  const handleEmailSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubj = e.target.value;
    onChange(`Subject: ${newSubj}\n\n${emailBody}`);
  };

  const handleEmailBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    onChange(`Subject: ${subject}\n\n${newBody}`);
  };

  const cleanDisplayValue = (text: string) => {
    if (text.toLowerCase().startsWith("subject:")) {
      const idx = text.indexOf("\n");
      return idx !== -1 ? text.slice(idx).trim() : "";
    }
    return text;
  };

  // WhatsApp Style
  if (channel === "whatsapp" || channel === "sms") {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-slate-700 bg-[#0b141a] font-sans text-left shadow-lg">
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] dark:bg-[#202c33] px-3.5 py-2.5 flex items-center gap-3 border-b border-emerald-900/10">
          <div className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {businessName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h5 className="text-white text-xs font-semibold truncate leading-tight">
              {businessName}
            </h5>
            <span className="text-[10px] text-emerald-200/80 leading-none">Online</span>
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 bg-[#efeae2] dark:bg-[#0b141a] bg-opacity-95 flex flex-col gap-2 min-h-[160px] max-h-[300px] overflow-y-auto">
          <div className="bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tr-none max-w-[85%] self-end shadow-sm border border-emerald-250 dark:border-emerald-900 flex flex-col w-full">
            <textarea
              value={cleanDisplayValue(value || placeholder)}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={5}
              className="w-full bg-transparent border-none outline-none resize-none text-[11px] font-sans p-0 m-0 leading-relaxed text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-0"
            />
            <span className="text-[8px] text-slate-400 dark:text-emerald-300/60 text-right mt-1.5 self-end">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
            </span>
          </div>
        </div>

        {/* Mock Input Bar */}
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-3 py-2 flex items-center gap-2 border-t border-slate-700/20">
          <span className="text-slate-500 text-xs">😊</span>
          <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-3 py-1.5 text-[11px] text-slate-400 truncate">
            Type a message
          </div>
          <span className="text-slate-500 text-xs">🎙️</span>
        </div>
      </div>
    );
  }

  // Email Style
  if (channel === "email") {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f172a] font-sans text-left shadow-lg">
        {/* Email Header */}
        <div className="bg-slate-50 dark:bg-slate-900 p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400 w-12 shrink-0">From:</span>
            <span className="text-slate-800 dark:text-slate-200 truncate">{senderName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400 w-12 shrink-0">To:</span>
            <span className="text-slate-800 dark:text-slate-200 truncate">{businessEmail}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400 w-12 shrink-0">Subject:</span>
            <input
              type="text"
              value={subject}
              onChange={handleEmailSubjectChange}
              placeholder="Enter subject line..."
              className="flex-1 bg-transparent border-none outline-none font-medium text-slate-900 dark:text-white p-0 m-0 focus:ring-0"
            />
          </div>
        </div>

        {/* Email Body */}
        <div className="p-4 bg-white dark:bg-slate-950">
          <textarea
            value={cleanDisplayValue(emailBody || placeholder)}
            onChange={handleEmailBodyChange}
            placeholder={placeholder}
            rows={7}
            className="w-full bg-transparent border-none outline-none resize-none text-[11px] font-sans p-0 m-0 leading-relaxed text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-0"
          />
        </div>
      </div>
    );
  }

  // LinkedIn Style
  if (channel === "linkedin") {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-sans text-left shadow-lg">
        {/* LinkedIn Header */}
        <div className="bg-[#0a66c2] px-3.5 py-2.5 flex items-center gap-2">
          <span className="text-white font-bold text-xs uppercase tracking-wide">💬 LinkedIn Message</span>
        </div>

        {/* LinkedIn Chat Area */}
        <div className="p-4 bg-white dark:bg-slate-950 flex flex-col gap-2 min-h-[140px]">
          <div className="flex gap-2.5 max-w-[85%]">
            <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-bold text-[10px] shrink-0 mt-1">
              IN
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-3 rounded-xl rounded-tl-none shadow-sm flex flex-col w-full border border-slate-200 dark:border-slate-700/50">
              <textarea
                value={cleanDisplayValue(value || placeholder)}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={5}
                className="w-full bg-transparent border-none outline-none resize-none text-[11px] font-sans p-0 m-0 leading-relaxed text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phone Script & Fallback Style
  return (
    <div className="w-full rounded-xl border border-amber-200/50 dark:border-slate-700 bg-amber-50/20 dark:bg-slate-950 p-4 font-mono text-left shadow-inner flex flex-col gap-2">
      <div className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest border-b border-amber-500/20 pb-2 mb-1">
        📞 Spoken Phone Script / Notes
      </div>
      <textarea
        value={value || placeholder}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="w-full bg-transparent border-none outline-none resize-none text-[11px] leading-relaxed text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:ring-0"
      />
    </div>
  );
}
