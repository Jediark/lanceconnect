import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Check, Shield } from "lucide-react";

interface Message {
  id: string;
  sender: "assistant" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "assistant",
    text: "Hello! I'm your LanceConnect AI Assistant. How can I help you find clients, optimize your profile, or manage your pipeline today?",
    timestamp: new Date(Date.now() - 60000 * 5),
    quickReplies: ["Find local clients", "Improve my lead score", "Outreach templates"],
  },
  {
    id: "2",
    sender: "user",
    text: "How do I find local clients in Seattle?",
    timestamp: new Date(Date.now() - 60000 * 4),
  },
  {
    id: "3",
    sender: "assistant",
    text: "To find local clients in Seattle, head to the **Discover** tab in the sidebar. Select your category (e.g., Web Developer), enter 'Seattle' as the city, and hit Search. We will scan local business registries and active online opportunities in that area!",
    timestamp: new Date(Date.now() - 60000 * 3),
    quickReplies: ["Go to Discover", "Outreach templates"],
  },
];

// Helper to render LC Wave Logo inside SVGs
function LCWaveLogo({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="14" cy="20" r="6" fill="#2D6CFF" />
      <circle cx="26" cy="20" r="6" fill="#10B981" />
      <path d="M14 20L26 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M17 20C18.5 18.5 19.5 18.5 22 20C24.5 21.5 25.5 21.5 27 20"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
      />
    </svg>
  );
}

export function AssistantChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      setIsThinking(false);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: getMockReplyForInput(text),
        timestamp: new Date(),
        quickReplies: getQuickRepliesForInput(text),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close LanceConnect Assistant" : "Open LanceConnect Assistant"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-[#0B1220] to-[#2D6CFF] text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <LCWaveLogo size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden bg-[#0B1220]/90 border border-slate-700/50 backdrop-blur-[10px] shadow-2xl",
              // Mobile styles (bottom sheet/full screen) vs Desktop styles (floating panel)
              "bottom-0 right-0 w-full h-full max-h-[100dvh] rounded-none sm:bottom-24 sm:right-6 sm:w-[360px] sm:h-[520px] sm:rounded-2xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#101B30]/95 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center">
                  <LCWaveLogo size={20} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#101B30]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 tracking-wide">LanceConnect Assistant</h3>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Chat"
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 flex items-center justify-center transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Messages Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2.5">
                  <div
                    className={cn(
                      "flex items-end gap-2.5 max-w-[85%]",
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {msg.sender === "assistant" && (
                      <div className="h-6 w-6 rounded-full bg-[#101B30] border border-slate-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3.5 w-3.5 text-[#2D6CFF]" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "text-xs px-3.5 py-2.5 shadow-sm leading-relaxed",
                        msg.sender === "assistant"
                          ? "bg-[#101B30] text-slate-100 rounded-2xl rounded-bl-none border border-slate-800/50"
                          : "bg-gradient-to-r from-[#2D6CFF] to-[#5B8CFF] text-white rounded-2xl rounded-br-none"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Quick replies */}
                  {msg.sender === "assistant" && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="pl-8 flex flex-wrap gap-2">
                      {msg.quickReplies.map((qr, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(qr)}
                          tabIndex={0}
                          className="px-3 py-1.5 rounded-full border border-[#2D6CFF] text-[#2D6CFF] text-[11px] font-semibold hover:bg-[#2D6CFF]/10 focus:outline-none focus-visible:bg-[#2D6CFF]/15 active:scale-95 transition"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isThinking && <TypingIndicator />}
            </div>

            {/* Chat Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 bg-[#101B30]/95 border-t border-slate-800/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                tabIndex={0}
                className="flex-1 bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D6CFF] focus-visible:ring-1 focus-visible:ring-[#2D6CFF] transition"
              />
              <button
                type="submit"
                aria-label="Send Message"
                tabIndex={0}
                disabled={!inputValue.trim()}
                className="h-8 w-8 bg-[#2D6CFF] hover:bg-[#2D6CFF]/90 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101B30] focus-visible:ring-[#2D6CFF]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 max-w-[85%] mr-auto">
      <div className="h-6 w-6 rounded-full bg-[#101B30] border border-slate-700 flex items-center justify-center flex-shrink-0">
        <Bot className="h-3.5 w-3.5 text-[#2D6CFF]" />
      </div>
      <div className="bg-[#101B30] border border-slate-800/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

// Simple Helper to return contextual mock replies
function getMockReplyForInput(input: string): string {
  const norm = input.toLowerCase();
  if (norm.includes("discover")) {
    return "Great choice! The Discover tab scans and pulls verified emails, phone numbers, and web domains for local service providers. Would you like me to guide you on formatting your search queries?";
  }
  if (norm.includes("outreach") || norm.includes("template")) {
    return "Outreach templates are located in our Resources drawer! A strong message is concise: state your service, mention a local value add, and link to your portfolio. Would you like a template example?";
  }
  if (norm.includes("discover") || norm.includes("find local")) {
    return "I can help with that! Head to the Discover section in the main navigation. Set your target category and local area to retrieve leads instantly.";
  }
  return "That's interesting! I can help you locate targets, refine outreach scripts, or manage client entries. What would you like to explore next?";
}

function getQuickRepliesForInput(input: string): string[] {
  const norm = input.toLowerCase();
  if (norm.includes("discover")) {
    return ["Search tips", "Filter options"];
  }
  if (norm.includes("outreach") || norm.includes("template")) {
    return ["Cold email template", "WhatsApp template"];
  }
  return ["Find local clients", "Optimize my profile"];
}
