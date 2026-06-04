import { Link } from "@tanstack/react-router";
import { Logo, LanceConnectLogo } from "@/components/Logo";
import { Menu, X, ArrowUp, MessageSquare, Send, Search, ExternalLink, ArrowRight, Globe, Sun, Moon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePreferences, Language, Currency } from "@/contexts/PreferencesContext";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, currency, setCurrency, theme, setTheme, t } = usePreferences();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
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
    { to: "/contact", label: t("nav_contact") },
  ];

  const desktopLinks = links;

  return (
    <div className="w-full shrink-0 sticky top-0 z-50">
      {bannerOpen && (
        <div className="relative bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 py-2 px-4 lg:px-8 select-none flex items-center justify-between gap-3 text-xs font-semibold text-white shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
          <div className="flex-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold animate-pulse">Special Offer</span>
            <span>🎉 Launch Offer: Get 10 verified, high-scoring client leads completely free. No credit card required!</span>
          </div>
          <button 
            onClick={() => setBannerOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition cursor-pointer self-center shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      )}
      <div className="relative bg-card py-1.5 px-4 lg:px-8 border-b border-border/40 select-none flex items-center justify-center lg:justify-between gap-3 text-xs font-mono text-foreground transition-colors duration-300">
        {/* Active Lead Scanning Stats */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-muted-foreground">Active Lead Scanning: 1,482 cities checked today · 41,209 leads indexed today</span>
        </div>

        {/* Search, Language & Currency preferences (Desktop only) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* CMD+K Search Icon Button */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-cmd-palette"))}
            className="p-1 text-muted-foreground hover:text-primary transition cursor-pointer flex items-center gap-1.5 hover:bg-accent rounded-lg px-2"
            aria-label="Search"
            title="Search (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold">Search (⌘K)</span>
          </button>

          <div className="h-3 w-px bg-border" />

          {/* Globe Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center gap-1.5 p-1 text-muted-foreground hover:text-primary transition cursor-pointer text-[10px] font-bold hover:bg-accent rounded-lg px-2"
              aria-label="Settings"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language.toUpperCase()} · {currency}</span>
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Preferences</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-medium">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as Language)}
                      className="w-full bg-background border border-border/60 hover:border-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="en">English (EN)</option>
                      <option value="fr">Français (FR)</option>
                      <option value="it">Italiano (IT)</option>
                      <option value="es">Español (ES)</option>
                      <option value="pt">Português (PT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1 font-medium">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      className="w-full bg-background border border-border/60 hover:border-border rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="BRL">BRL (R$)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        <header className="border-b border-border bg-background w-full py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center group">
            <LanceConnectLogo className="transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-0.5 active:scale-[0.98]" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-5 text-sm text-foreground/80">
              {desktopLinks.map((l) => (
                <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors animate-fade-in" activeProps={{ className: "text-foreground font-semibold border-b border-primary pb-0.5" }}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="h-4 w-px bg-border/40" />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-slate-400 hover:text-foreground hover:bg-accent transition cursor-pointer"
                aria-label="Toggle Theme"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === "light" ? <Moon className="h-4.5 w-4.5 text-slate-700" /> : <Sun className="h-4.5 w-4.5 text-amber-400" />}
              </button>
              <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">{t("nav_login")}</Link>
              <Link to="/register" className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap shadow-sm hover:shadow-md">{t("nav_start_free")}</Link>
            </div>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden rounded-lg p-2 text-slate-300 hover:bg-accent" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="flex flex-col px-4 py-3 gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-foreground">
                  {l.label}
                </Link>
              ))}
              <button 
                onClick={() => { setOpen(false); window.dispatchEvent(new CustomEvent("toggle-cmd-palette")); }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-foreground text-left cursor-pointer"
              >
                <Search className="h-4 w-4" /> Search (⌘K)
              </button>
              
              {/* Mobile Preferences & Theme */}
              <div className="flex items-center gap-2 px-3 py-2 flex-wrap sm:flex-nowrap">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="flex-1 bg-card border border-border rounded-lg px-2.5 py-2 text-sm text-foreground/85 focus:outline-none cursor-pointer"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="it">🇮🇹 Italiano</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="pt">🇧🇷 Português</option>
                </select>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="flex-1 bg-card border border-border rounded-lg px-2.5 py-2 text-sm text-foreground/85 focus:outline-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="BRL">BRL (R$)</option>
                </select>
                
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 border border-border bg-card rounded-lg text-foreground hover:bg-accent flex items-center justify-center cursor-pointer"
                  aria-label="Toggle Theme"
                >
                  {theme === "light" ? <Moon className="h-5 w-5 text-slate-700" /> : <Sun className="h-5 w-5 text-amber-400" />}
                </button>
              </div>

              <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-foreground">{t("nav_login")}</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="mt-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">{t("nav_start_free")}</Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export function MarketingFooter() {
  const cols = [
    { title: "Product", links: [["Portfolio","/portfolio"],["Pricing","/pricing"],["How it works","/how-it-works"],["Changelog","/changelog"]] as const },
    { title: "Company", links: [["About","/about"],["Blog","/blog"],["Contact","/contact"]] as const },
    { title: "For Freelancers", links: [["Web Developers","/freelancers/web-developers"],["Designers","/freelancers/designers"],["Copywriters","/freelancers/copywriters"],["SEO Specialists","/freelancers/seo-specialists"]] as const },
    { title: "Legal", links: [["Privacy Policy","/privacy"],["Terms of Service","/terms"]] as const },
  ];

  return (
    <footer className="border-t border-[#1e293b]/40 bg-[#080B14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4 group">
              <img 
                src="/logo-navy.png" 
                alt="LanceConnect" 
                className="h-12 md:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-0.5 active:scale-[0.98] drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)] group-hover:drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)]" 
              />
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Lead generation built by freelancers, for freelancers. Find businesses that need your skills in 150+ countries.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-200">{c.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                {c.links.map(([label, href]) => {
                  const isFreelancer = href.startsWith("/freelancers/");
                  const slug = href.replace("/freelancers/", "");
                  return (
                    <li key={label}>
                      {isFreelancer ? (
                        <Link to="/freelancers/$slug" params={{ slug }} className="hover:text-white transition-colors">
                          {label}
                        </Link>
                      ) : (
                        <Link to={href as any} className="hover:text-white transition-colors">
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[#1e293b]/40 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} LanceConnect. The Meeting Point for Freelancers and Clients</p>
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  // CMD+K palette states
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top states
  const [showScroll, setShowScroll] = useState(false);

  // Live Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "support"; text: string }>>([
    { sender: "support", text: "Hi there! 👋 I'm Lucas from support. Ask me anything about LanceConnect!" }
  ]);
  const [userMsg, setUserMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Listen to CMD+K triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Monitor Scroll Height for Top Arrow
  useEffect(() => {
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

  // Scroll chat messages box to bottom on update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendChat = (e: React.FormEvent) => {
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

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-40 select-none">
        {/* Scroll-To-Top Arrow */}
        {showScroll && (
          <button 
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-slate-300 hover:text-white hover:bg-accent shadow-2xl transition cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Live Chat Bubble Toggle */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:bg-primary/95 transition cursor-pointer relative"
          aria-label="Chat support"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
        </button>
      </div>

      {/* Mini Chat Drawer */}
      {chatOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-w-[calc(100vw-32px)] h-96 border border-border bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-background p-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-bold text-white">Lucas · Support Ops 🌍</p>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-300 text-xs">Close</button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[80%] rounded-2xl p-3 text-xs leading-normal ${
                  m.sender === "support" 
                    ? "bg-background border border-border text-slate-300 self-start" 
                    : "bg-primary text-white self-end ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="bg-background border border-border text-slate-500 self-start max-w-[80%] rounded-2xl p-3 text-xs flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-border bg-background flex gap-2">
            <input 
              type="text" 
              placeholder="Write a message..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition"
            />
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-lg p-1.5 shrink-0 transition flex items-center justify-center">
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* CMD+K Command Palette Modal */}
      {cmdOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-4 select-none"
          onClick={() => setCmdOpen(false)}
        >
          <div 
            className="w-full max-w-lg border border-border bg-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search portfolios or type navigation commands..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <kbd className="bg-slate-950 border border-slate-800 text-[10px] text-slate-500 rounded px-1.5 py-0.5">ESC</kbd>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              {searchQuery ? (
                <div>
                  <p className="text-[10px] font-mono text-slate-500 px-3 py-1 uppercase tracking-wider">Search Results</p>
                  {[
                    { label: "View Web Developers Portfolios", href: "/portfolio", cat: "web-developers" },
                    { label: "View Brand Designers Portfolios", href: "/portfolio", cat: "designers" },
                    { label: "View SEO Specialists Portfolios", href: "/portfolio", cat: "seo-specialists" },
                    { label: "View Social Media Managers Showcase", href: "/portfolio", cat: "social-media" },
                    { label: "View Videographers Showcase", href: "/portfolio", cat: "videographers" },
                    { label: "View Virtual Assistants Portfolios", href: "/portfolio", cat: "virtual-assistants" },
                  ].filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                    <Link 
                      key={item.label}
                      to={item.href as any}
                      onClick={() => setCmdOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#1E293B] text-xs font-mono transition"
                    >
                      <span className="flex items-center gap-2">{item.label}</span>
                      <span className="text-[10px] text-slate-500">Go to directory →</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-slate-500 px-3 py-1.5 uppercase tracking-wider">Navigation Commands</p>
                  {[
                    { label: "Go to Home Page", href: "/" },
                    { label: "Go to About Us", href: "/about" },
                    { label: "Go to How It Works", href: "/how-it-works" },
                    { label: "Go to Pricing Page", href: "/pricing" },
                    { label: "Go to Blog Page", href: "/blog" },
                    { label: "Go to Portfolios Showcase", href: "/portfolio" },
                    { label: "Go to Contact Page", href: "/contact" },
                  ].map(item => (
                    <Link 
                      key={item.label}
                      to={item.href as any}
                      onClick={() => setCmdOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1E293B] text-xs font-mono transition"
                    >
                      <span className="flex items-center gap-2">{item.label}</span>
                      <span className="text-[10px] text-[#64748B] uppercase tracking-wider">JUMP TO</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Reusable simple page header for inner marketing pages. Uses a full-bleed background image. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#080B14]">
      <div className="absolute inset-0">
        {image && <img src={image} alt="" className="h-full w-full object-cover opacity-15 mix-blend-luminosity" />}
        <div className="absolute inset-0 bg-[#080B14]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080B14]/40 to-[#080B14]/70" />
      </div>
      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center text-white lg:px-8 lg:py-28">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70 mb-2 font-mono">
            // {eyebrow.toLowerCase()}
          </p>
        )}
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] md:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}