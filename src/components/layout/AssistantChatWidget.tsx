import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Check, Shield } from "lucide-react";
import { getCountry } from "@/data/dynamicRouteData";

interface Message {
  id: string;
  sender: "assistant" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface Slots {
  goal: string | null;
  category: string | null;
  location: string | null;
  budget: string | null;
  experience_level: string | null;
}

const INITIAL_SLOTS: Slots = {
  goal: null,
  category: null,
  location: null,
  budget: null,
  experience_level: null,
};

const CATEGORY_MAP: Record<string, string> = {
  "Web Development": "web_dev",
  "Graphic Design": "designer",
  "Virtual Assistant": "va",
  "Content Writing": "copywriter",
  "Pet Care": "local_business",
};

function getCategoryParam(catLabel: string | null): string {
  if (!catLabel) return "local_business";
  if (CATEGORY_MAP[catLabel]) return CATEGORY_MAP[catLabel];

  const norm = catLabel.toLowerCase();
  if (norm.includes("web")) return "web_dev";
  if (norm.includes("design")) return "designer";
  if (norm.includes("assist") || norm.includes("va")) return "va";
  if (norm.includes("writ") || norm.includes("copy")) return "copywriter";
  if (norm.includes("pet") || norm.includes("dog")) return "local_business";
  if (norm.includes("seo")) return "seo";
  if (norm.includes("social")) return "social_media";
  if (norm.includes("video")) return "video";
  if (norm.includes("photo")) return "photography";
  if (norm.includes("market")) return "marketing";
  if (norm.includes("app")) return "app_dev";
  if (norm.includes("tutor")) return "tutor";

  return "local_business";
}

function resolveCountryFromCity(city: string | null): string {
  if (!city) return "Nigeria";
  const slug = city.trim().toLowerCase().replace(/\s+/g, "-");
  const country = getCountry(slug);
  return country || "Nigeria";
}

const OPENING_TEXT = `Hey there 👋 I'm the LanceConnect Assistant — here to help you find real clients, fast, with zero bidding wars and zero platform commissions.

LanceConnect connects freelancers directly with local and global clients across every category — web development, design, writing, virtual assistance, pet care, home services, and more.

To get you matched with the right opportunities, I just need a few quick details:

1. What type of work do you do (your category/service)?
2. Where are you (or your clients) located?
3. What's your target budget or rate?
4. What's your experience level?

Let's start — what's your main service or specialty?`;

const OPENING_MESSAGE: Message = {
  id: "opening",
  sender: "assistant",
  text: OPENING_TEXT,
  timestamp: new Date(),
  quickReplies: [
    "Web Development",
    "Graphic Design",
    "Virtual Assistant",
    "Content Writing",
    "Pet Care",
    "Something Else",
  ],
};

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
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [slots, setSlots] = useState<Slots>(INITIAL_SLOTS);
  const [currentUnfilledSlot, setCurrentUnfilledSlot] = useState<keyof Slots | null>("category");
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

  // Natural Language Slot Parser
  const parseSlotsFromInput = (text: string, expectedSlot: keyof Slots | null): Partial<Slots> => {
    const parsed: Partial<Slots> = {};
    const lower = text.toLowerCase().trim();

    // 1. Goal extraction
    if (
      lower.includes("find client") ||
      lower.includes("looking for client") ||
      lower.includes("get client") ||
      lower.includes("find work") ||
      lower.includes("freelance") ||
      lower.includes("freelancer") ||
      lower.includes("find clients") ||
      lower === "find clients"
    ) {
      parsed.goal = "freelancer";
    } else if (
      lower.includes("hire") ||
      lower.includes("looking for freelancer") ||
      lower.includes("business looking") ||
      lower.includes("looking to hire") ||
      lower === "hire a freelancer"
    ) {
      parsed.goal = "client";
    }

    // 2. Category extraction
    if (
      lower.includes("web dev") ||
      lower.includes("web development") ||
      lower.includes("website") ||
      lower.includes("developer") ||
      lower.includes("coding") ||
      lower.includes("programmer")
    ) {
      parsed.category = "Web Development";
    } else if (
      lower.includes("design") ||
      lower.includes("graphic design") ||
      lower.includes("designer") ||
      lower.includes("branding") ||
      lower.includes("logo")
    ) {
      parsed.category = "Graphic Design";
    } else if (
      lower.includes("virtual assistant") ||
      lower.includes("assistant") ||
      lower.includes("va ") ||
      lower === "va" ||
      lower.includes("admin")
    ) {
      parsed.category = "Virtual Assistant";
    } else if (
      lower.includes("writing") ||
      lower.includes("writer") ||
      lower.includes("copywriter") ||
      lower.includes("content writing")
    ) {
      parsed.category = "Content Writing";
    } else if (
      lower.includes("pet") ||
      lower.includes("dog") ||
      lower.includes("cat") ||
      lower.includes("pet care") ||
      lower.includes("animal")
    ) {
      parsed.category = "Pet Care";
    }

    // 3. Experience level extraction
    if (lower.includes("beginner") || lower.includes("junior") || lower.includes("entry")) {
      parsed.experience_level = "Beginner";
    } else if (lower.includes("intermediate") || lower.includes("mid")) {
      parsed.experience_level = "Intermediate";
    } else if (
      lower.includes("expert") ||
      lower.includes("senior") ||
      lower.includes("advanced") ||
      lower.includes("pro")
    ) {
      parsed.experience_level = "Expert";
    }

    // 4. Budget extraction
    const budgetRegex =
      /(\$\d+(?:,\d+)*(?:\/\w+)?|\d+\s*(?:usd|gbp|ngn|eur|dollars|pounds)|rate\s*of\s*\d+|budget\s*of\s*\d+)/gi;
    const match = lower.match(budgetRegex);
    if (match) {
      parsed.budget = match[0];
    }

    // 5. Direct filling for current unfilled slot if parsing failed
    if (expectedSlot === "goal" && !parsed.goal) {
      if (lower.includes("client") || lower.includes("find")) {
        parsed.goal = "freelancer";
      } else if (lower.includes("hire") || lower.includes("business")) {
        parsed.goal = "client";
      }
    } else if (expectedSlot === "category" && !parsed.category) {
      if (lower !== "something else") {
        parsed.category = text;
      }
    } else if (expectedSlot === "location" && !parsed.location) {
      parsed.location = text;
    } else if (expectedSlot === "budget" && !parsed.budget) {
      parsed.budget = text;
    } else if (expectedSlot === "experience_level" && !parsed.experience_level) {
      if (lower === "beginner" || lower === "intermediate" || lower === "expert") {
        parsed.experience_level = text;
      } else {
        parsed.experience_level = text;
      }
    }

    return parsed;
  };

  const getBotPromptForNextSlot = (
    currentSlots: Slots,
  ): { text: string; quickReplies?: string[] } => {
    if (!currentSlots.goal) {
      return {
        text: "Are you looking to find clients for your freelance work, or are you a business looking to hire a freelancer?",
        quickReplies: ["Find Clients", "Hire a Freelancer"],
      };
    }
    if (!currentSlots.category) {
      return {
        text: "What type of work do you do (your category or specialty)?",
        quickReplies: [
          "Web Development",
          "Graphic Design",
          "Virtual Assistant",
          "Content Writing",
          "Pet Care",
          "Something Else",
        ],
      };
    }
    if (!currentSlots.location) {
      return {
        text: "Where are you (or your clients) located? Please type a city name (e.g. Lagos, London, or Austin).",
      };
    }
    if (!currentSlots.budget) {
      return {
        text: "What's your target budget or rate? (e.g. $50/hr or $2,000 project budget)",
      };
    }
    if (!currentSlots.experience_level) {
      return {
        text: "What's your experience level?",
        quickReplies: ["Beginner", "Intermediate", "Expert"],
      };
    }

    const summaryText = `Perfect — here's what I've got:

📂 Category: ${currentSlots.category}
📍 Location: ${currentSlots.location}
💰 Target Budget: ${currentSlots.budget}
⭐ Experience Level: ${currentSlots.experience_level}

I'll plug this into your search so you can start finding real, contactable leads right away. Want me to run the search now?`;

    return {
      text: summaryText,
      quickReplies: ["Run Search", "Edit Details", "Save for Later"],
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // 1. Check commands / special options
    if (text === "Edit Details") {
      setSlots(INITIAL_SLOTS);
      setMessages([OPENING_MESSAGE]);
      setCurrentUnfilledSlot("category");
      return;
    }

    if (text === "Something Else") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: "No problem! What is your main service or specialty? Just type it below.",
            timestamp: new Date(),
          },
        ]);
        setCurrentUnfilledSlot("category");
      }, 800);
      return;
    }

    if (text === "Save for Later") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        localStorage.setItem("lc_chat_slots", JSON.stringify(slots));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: "Preferences saved successfully! You can access them or run a search whenever you're ready. Let me know if you want to make any changes.",
            timestamp: new Date(),
            quickReplies: ["Edit Details", "Run Search"],
          },
        ]);
      }, 1000);
      return;
    }

    if (text === "Run Search") {
      const catId = getCategoryParam(slots.category);
      const cityVal = slots.location || "";
      const countryVal = resolveCountryFromCity(cityVal);

      sessionStorage.setItem("lc_shared_category", catId);
      sessionStorage.setItem("lc_shared_city", cityVal);
      sessionStorage.setItem("lc_shared_country", countryVal);
      sessionStorage.setItem("lc_shared_has_session", "true");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: `Launching leads search for ${slots.category} in ${cityVal}... 🚀`,
            timestamp: new Date(),
          },
        ]);
        setTimeout(() => {
          const queryParams = new URLSearchParams({
            autoSearch: "true",
            category: catId,
            city: cityVal,
            country: countryVal,
          });
          window.location.href = `/app/discover?${queryParams.toString()}`;
        }, 800);
      }, 1000);
      return;
    }

    // 2. Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    // 3. Process slot filling
    setTimeout(() => {
      setIsThinking(false);

      // Parse text for slots
      const parsed = parseSlotsFromInput(text, currentUnfilledSlot);

      // Merge slots
      const updatedSlots = { ...slots, ...parsed };
      setSlots(updatedSlots);

      // Find next unfilled slot
      let nextSlot: keyof Slots | null = null;
      if (!updatedSlots.goal) nextSlot = "goal";
      else if (!updatedSlots.category) nextSlot = "category";
      else if (!updatedSlots.location) nextSlot = "location";
      else if (!updatedSlots.budget) nextSlot = "budget";
      else if (!updatedSlots.experience_level) nextSlot = "experience_level";

      setCurrentUnfilledSlot(nextSlot);

      // Get next bot prompt
      const prompt = getBotPromptForNextSlot(updatedSlots);

      const botMsg: Message = {
        id: Date.now().toString(),
        sender: "assistant",
        text: prompt.text,
        timestamp: new Date(),
        quickReplies: prompt.quickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
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
              "bottom-0 right-0 w-full h-full max-h-[100dvh] rounded-none sm:bottom-24 sm:right-6 sm:w-[360px] sm:h-[520px] sm:rounded-2xl",
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
                  <h3 className="text-xs font-bold text-slate-100 tracking-wide">
                    LanceConnect Assistant
                  </h3>
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
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                    )}
                  >
                    {msg.sender === "assistant" && (
                      <div className="h-6 w-6 rounded-full bg-[#101B30] border border-slate-700 flex items-center justify-center flex-shrink-0">
                        <LCWaveLogo size={18} />
                      </div>
                    )}
                    <div
                      className={cn(
                        "text-xs px-3.5 py-2.5 shadow-sm leading-relaxed whitespace-pre-line",
                        msg.sender === "assistant"
                          ? "bg-[#101B30] text-slate-100 rounded-2xl rounded-bl-none border border-slate-800/50"
                          : "bg-gradient-to-r from-[#2D6CFF] to-[#5B8CFF] text-white rounded-2xl rounded-br-none",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Quick replies */}
                  {msg.sender === "assistant" &&
                    msg.quickReplies &&
                    msg.quickReplies.length > 0 && (
                      <div className="pl-8 flex flex-wrap gap-2 animate-in fade-in duration-300">
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
        <LCWaveLogo size={18} />
      </div>
      <div className="bg-[#101B30] border border-slate-800/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
