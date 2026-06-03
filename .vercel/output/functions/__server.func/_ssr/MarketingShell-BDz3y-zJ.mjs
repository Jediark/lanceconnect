import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as usePreferences } from "./router-DdjAxO3q.mjs";
import { D as ArrowUp, m as MessageSquare, F as Send, e as Search, G as Globe, X, I as Menu } from "../_libs/lucide-react.mjs";
function MarketingNav() {
  const [open, setOpen] = reactExports.useState(false);
  const [bannerOpen, setBannerOpen] = reactExports.useState(true);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const settingsRef = reactExports.useRef(null);
  const { language, setLanguage, currency, setCurrency, t } = usePreferences();
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/about", label: t("nav_about") },
    { to: "/how-it-works", label: t("nav_how") },
    { to: "/pricing", label: t("nav_pricing") },
    { to: "/blog", label: t("nav_blog") },
    { to: "/portfolio", label: t("nav_portfolio") },
    { to: "/contact", label: t("nav_contact") }
  ];
  const desktopLinks = links.filter((l) => l.to !== "/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full shrink-0 sticky top-0 z-50", children: [
    bannerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-[#1E293B] py-2 px-4 text-center text-xs font-mono text-[#CBD5E1] border-b border-border/40 select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🎉 Active Lead Scanning: 1,482 cities checked today · 41,209 leads indexed today →" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setBannerOpen(false),
          className: "absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC] cursor-pointer text-sm",
          children: "×"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-border bg-[#080B14] w-full py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-navy.png", alt: "LanceConnect", className: "h-10 md:h-12 w-auto object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-5 text-sm text-slate-400", children: desktopLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: l.to, className: "hover:text-white transition-colors animate-fade-in", activeProps: { className: "text-white font-semibold" }, children: l.label }, l.to)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => window.dispatchEvent(new CustomEvent("toggle-cmd-palette")),
                className: "p-2 text-slate-400 hover:text-white hover:bg-[#0F172A]/40 rounded-lg border border-border/40 transition cursor-pointer",
                "aria-label": "Search",
                title: "Search (⌘K)",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: settingsRef, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setSettingsOpen(!settingsOpen),
                  className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/40 bg-[#0F172A]/40 text-slate-400 hover:text-white transition cursor-pointer text-xs font-medium",
                  "aria-label": "Settings",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] tracking-tight", children: [
                      language.toUpperCase(),
                      " · ",
                      currency
                    ] })
                  ]
                }
              ),
              settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-56 rounded-xl border border-border bg-[#0F172A] p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2", children: "Preferences" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] text-slate-400 mb-1 font-medium", children: "Language" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        value: language,
                        onChange: (e) => setLanguage(e.target.value),
                        className: "w-full bg-[#080B14] border border-border/60 hover:border-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none transition cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "English (EN)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fr", children: "Français (FR)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "it", children: "Italiano (IT)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "es", children: "Español (ES)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pt", children: "Português (PT)" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] text-slate-400 mb-1 font-medium", children: "Currency" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        value: currency,
                        onChange: (e) => setCurrency(e.target.value),
                        className: "w-full bg-[#080B14] border border-border/60 hover:border-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none transition cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "USD", children: "USD ($)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EUR", children: "EUR (€)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "GBP", children: "GBP (£)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "NGN", children: "NGN (₦)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BRL", children: "BRL (R$)" })
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-accent hover:text-white transition-colors", children: t("nav_login") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black hover:bg-white/90 transition-colors whitespace-nowrap shadow-sm hover:shadow-md", children: t("nav_start_free") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(!open), className: "lg:hidden rounded-lg p-2 text-slate-300 hover:bg-accent", "aria-label": "Menu", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-[#080B14] lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col px-4 py-3 gap-1", children: [
        links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: l.to, onClick: () => setOpen(false), className: "rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-accent hover:text-white", children: l.label }, l.to)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("toggle-cmd-palette"));
            },
            className: "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-accent text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }),
              " Search (⌘K)"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: language,
              onChange: (e) => setLanguage(e.target.value),
              className: "flex-1 bg-[#0F172A] border border-border rounded-lg px-2.5 py-2 text-sm text-slate-300 focus:outline-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "🇺🇸 English" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fr", children: "🇫🇷 Français" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "it", children: "🇮🇹 Italiano" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "es", children: "🇪🇸 Español" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pt", children: "🇧🇷 Português" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
              className: "flex-1 bg-[#0F172A] border border-border rounded-lg px-2.5 py-2 text-sm text-slate-300 focus:outline-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "USD", children: "USD ($)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "EUR", children: "EUR (€)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "GBP", children: "GBP (£)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "NGN", children: "NGN (₦)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BRL", children: "BRL (R$)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: () => setOpen(false), className: "rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-accent hover:text-white", children: t("nav_login") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", onClick: () => setOpen(false), className: "mt-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground", children: t("nav_start_free") })
      ] }) })
    ] })
  ] });
}
function MarketingFooter() {
  const cols = [
    { title: "Product", links: [["Portfolio", "/portfolio"], ["Pricing", "/pricing"], ["How it works", "/how-it-works"], ["Changelog", "/changelog"]] },
    { title: "Company", links: [["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"]] },
    { title: "For Freelancers", links: [["Web Developers", "/freelancers/web-developers"], ["Designers", "/freelancers/designers"], ["Copywriters", "/freelancers/copywriters"], ["SEO Specialists", "/freelancers/seo-specialists"]] },
    { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]] }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border bg-paper", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-14 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 md:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-white.png", alt: "LanceConnect", className: "h-10 md:h-12 w-auto object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs leading-relaxed text-muted-foreground", children: "Lead generation built by freelancers, for freelancers. Find businesses that need your skills in 150+ countries." })
      ] }),
      cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-foreground", children: c.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm text-muted-foreground", children: c.links.map(([label, href]) => {
          const isFreelancer = href.startsWith("/freelancers/");
          const slug = href.replace("/freelancers/", "");
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: isFreelancer ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/freelancers/$slug", params: { slug }, className: "hover:text-foreground", children: label }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: href, className: "hover:text-foreground", children: label }) }, label);
        }) })
      ] }, c.title))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " LanceConnect. The Meeting Point for Freelancers and Clients 🌍"
    ] }) })
  ] }) });
}
function MarketingShell({ children }) {
  const [cmdOpen, setCmdOpen] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showScroll, setShowScroll] = reactExports.useState(false);
  const [chatOpen, setChatOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([
    { sender: "support", text: "Hi there! 👋 I'm Lucas from support. Ask me anything about LanceConnect!" }
  ]);
  const [userMsg, setUserMsg] = reactExports.useState("");
  const [typing, setTyping] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    const handleToggleEvent = () => {
      setCmdOpen((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-cmd-palette", handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-cmd-palette", handleToggleEvent);
    };
  }, []);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;
    const currentMsg = userMsg;
    setMessages((prev) => [...prev, { sender: "user", text: currentMsg }]);
    setUserMsg("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      let reply = "Thanks for checking in! To get 10 free leads immediately with verified phone/email lines, you can create a free account right now. What skills are you planning to showcase?";
      if (currentMsg.toLowerCase().includes("price") || currentMsg.toLowerCase().includes("pricing") || currentMsg.toLowerCase().includes("cost")) {
        reply = "Our plans start at $0/mo (Free tier), with the Individual plan at just $5/mo, and Large Company at $20/mo. All plans cover verified global lead lines, with cancel-anytime triggers.";
      } else if (currentMsg.toLowerCase().includes("portfolio") || currentMsg.toLowerCase().includes("work")) {
        reply = "You can view all verified freelancer portfolio case studies directly on our 'Portfolio' route, linked right in the header navigation!";
      }
      setMessages((prev) => [...prev, { sender: "support", text: reply }]);
    }, 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MarketingNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MarketingFooter, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-6 right-6 flex flex-col items-end gap-3 z-40 select-none", children: [
      showScroll && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: scrollToTop,
          className: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#0F172A]/90 text-slate-300 hover:text-white hover:bg-accent shadow-2xl transition cursor-pointer",
          "aria-label": "Scroll to top",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setChatOpen(!chatOpen),
          className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:bg-primary/95 transition cursor-pointer relative",
          "aria-label": "Chat support",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#080B14] animate-pulse" })
          ]
        }
      )
    ] }),
    chatOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-20 right-6 w-80 max-w-[calc(100vw-32px)] h-96 border border-border bg-[#0F172A] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#080B14] p-3.5 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-white", children: "Lucas · Support Ops 🌍" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setChatOpen(false), className: "text-slate-500 hover:text-slate-300 text-xs", children: "Close" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin", children: [
        messages.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex flex-col max-w-[80%] rounded-2xl p-3 text-xs leading-normal ${m.sender === "support" ? "bg-[#080B14] border border-border text-slate-300 self-start" : "bg-primary text-white self-end ml-auto"}`,
            children: m.text
          },
          idx
        )),
        typing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#080B14] border border-border text-slate-500 self-start max-w-[80%] rounded-2xl p-3 text-xs flex gap-1 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce", style: { animationDelay: "0ms" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce", style: { animationDelay: "150ms" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce", style: { animationDelay: "300ms" } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendChat, className: "p-3 border-t border-border bg-[#080B14] flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Write a message...",
            value: userMsg,
            onChange: (e) => setUserMsg(e.target.value),
            className: "flex-1 bg-[#0F172A] border border-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "bg-primary hover:bg-primary/90 text-white rounded-lg p-1.5 shrink-0 transition flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }),
    cmdOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-4 select-none",
        onClick: () => setCmdOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full max-w-lg border border-border bg-[#0F172A] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5 text-slate-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search portfolios or type navigation commands...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none",
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "bg-slate-950 border border-slate-800 text-[10px] text-slate-500 rounded px-1.5 py-0.5", children: "ESC" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[300px] overflow-y-auto p-2", children: searchQuery ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-slate-500 px-3 py-1 uppercase tracking-wider", children: "Search Results" }),
                [
                  { label: "View Web Developers Portfolios", href: "/portfolio", cat: "web-developers" },
                  { label: "View Brand Designers Portfolios", href: "/portfolio", cat: "designers" },
                  { label: "View SEO Specialists Portfolios", href: "/portfolio", cat: "seo-specialists" },
                  { label: "View Social Media Managers Showcase", href: "/portfolio", cat: "social-media" },
                  { label: "View Videographers Showcase", href: "/portfolio", cat: "videographers" },
                  { label: "View Virtual Assistants Portfolios", href: "/portfolio", cat: "virtual-assistants" }
                ].filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: item.href,
                    onClick: () => setCmdOpen(false),
                    className: "flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#1E293B] text-xs font-mono transition",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        "🔍 ",
                        item.label
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500", children: "Go to directory →" })
                    ]
                  },
                  item.label
                ))
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-slate-500 px-3 py-1.5 uppercase tracking-wider", children: "Navigation Commands" }),
                [
                  { label: "Go to Home Page", href: "/" },
                  { label: "Go to About Us", href: "/about" },
                  { label: "Go to How It Works", href: "/how-it-works" },
                  { label: "Go to Pricing Page", href: "/pricing" },
                  { label: "Go to Blog Page", href: "/blog" },
                  { label: "Go to Portfolios Showcase", href: "/portfolio" },
                  { label: "Go to Contact Page", href: "/contact" }
                ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: item.href,
                    onClick: () => setCmdOpen(false),
                    className: "flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1E293B] text-xs font-mono transition",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        "⚡ ",
                        item.label
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#64748B] uppercase tracking-wider", children: "JUMP TO" })
                    ]
                  },
                  item.label
                ))
              ] }) })
            ]
          }
        )
      }
    )
  ] });
}
function PageHeader({
  eyebrow,
  title,
  subtitle,
  image
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
      image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: "", className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[color:var(--ink-bg)]/85" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--ink-bg)]/40 to-[color:var(--ink-bg)]/70" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-5xl px-4 py-20 text-center text-white lg:px-8 lg:py-28", children: [
      eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-2", children: eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold tracking-[-0.02em] md:text-5xl lg:text-6xl", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg", children: subtitle })
    ] })
  ] });
}
export {
  MarketingShell as M,
  PageHeader as P
};
