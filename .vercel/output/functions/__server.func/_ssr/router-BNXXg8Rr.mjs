import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as notFound, S as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { C as CircleCheck } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const appCss = "/assets/styles-Ds7xBT_U.css";
const AuthContext = reactExports.createContext(null);
const DEFAULT_USER = {
  id: "user-1",
  fullName: "Alex Johnson",
  email: "alex@example.com",
  freelancerCategory: "web_dev",
  plan: "free",
  leadsUsedThisMonth: 7,
  leadsLimit: 10,
  country: "Nigeria",
  avatarUrl: null
};
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("lance_auth");
    if (stored === "1") setUser(DEFAULT_USER);
  }, []);
  const login = () => {
    setUser(DEFAULT_USER);
    if (typeof window !== "undefined") localStorage.setItem("lance_auth", "1");
  };
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("lance_auth");
  };
  const updateUser = (patch) => setUser((u) => u ? { ...u, ...patch } : u);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, isAuthenticated: !!user, login, logout, updateUser }, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
const MOCK_LEADS = [
  { id: "1", businessName: "Mario's Ristorante", businessType: "Restaurant", industry: "web_dev", city: "Naples", country: "Italy", fullAddress: "Via Toledo 45, Naples, Italy", phone: "+39 081 555 0123", email: null, websiteUrl: null, hasWebsite: false, googleRating: 3.2, googleReviewCount: 18, opportunityScore: 92, source: "google_places", savedAt: null, status: null },
  { id: "2", businessName: "Lagos Hair Studio", businessType: "Beauty Salon", industry: "designer", city: "Lagos", country: "Nigeria", fullAddress: "14 Awolowo Road, Ikoyi, Lagos", phone: "+234 802 555 0198", email: "info@lagoshair.ng", websiteUrl: null, hasWebsite: false, googleRating: 4.5, googleReviewCount: 7, opportunityScore: 78, source: "google_places", savedAt: null, status: null },
  { id: "3", businessName: "Smith & Sons Plumbing", businessType: "Contractor", industry: "seo", city: "Manchester", country: "United Kingdom", fullAddress: "8 Deansgate, Manchester, UK", phone: "+44 161 555 0145", email: null, websiteUrl: "http://smithplumbing.co.uk", hasWebsite: true, googleRating: 4.1, googleReviewCount: 34, opportunityScore: 61, source: "google_places", savedAt: null, status: null },
  { id: "4", businessName: "Café Mirador", businessType: "Café", industry: "social_media", city: "Buenos Aires", country: "Argentina", fullAddress: "Av. Corrientes 1234, Buenos Aires", phone: "+54 11 5550 9988", email: null, websiteUrl: null, hasWebsite: false, googleRating: 4.7, googleReviewCount: 5, opportunityScore: 88, source: "google_places", savedAt: null, status: null },
  { id: "5", businessName: "Dr. Patel Dental Clinic", businessType: "Dentist", industry: "copywriter", city: "Mumbai", country: "India", fullAddress: "Linking Road, Bandra West, Mumbai", phone: "+91 98200 55012", email: "drpatel@dentalclinic.in", websiteUrl: null, hasWebsite: false, googleRating: 3.8, googleReviewCount: 42, opportunityScore: 74, source: "google_places", savedAt: null, status: null },
  { id: "6", businessName: "AutoFix Garage", businessType: "Auto Repair", industry: "web_dev", city: "Toronto", country: "Canada", fullAddress: "567 Yonge St, Toronto, ON", phone: "+1 416 555 0177", email: null, websiteUrl: null, hasWebsite: false, googleRating: 4, googleReviewCount: 89, opportunityScore: 55, source: "google_places", savedAt: null, status: null },
  { id: "7", businessName: "Boulangerie Dupont", businessType: "Bakery", industry: "photography", city: "Lyon", country: "France", fullAddress: "23 Rue de la République, Lyon", phone: "+33 4 72 55 01 89", email: null, websiteUrl: null, hasWebsite: false, googleRating: 4.9, googleReviewCount: 3, opportunityScore: 96, source: "google_places", savedAt: null, status: null },
  { id: "8", businessName: "Kuala Lumpur Yoga Studio", businessType: "Fitness Studio", industry: "video", city: "Kuala Lumpur", country: "Malaysia", fullAddress: "Bukit Bintang, Kuala Lumpur", phone: "+60 3-2142 5588", email: "hello@klyoga.my", websiteUrl: null, hasWebsite: false, googleRating: 4.6, googleReviewCount: 11, opportunityScore: 81, source: "google_places", savedAt: null, status: null }
];
const MOCK_PIPELINE_LEADS = [
  { ...MOCK_LEADS[0], savedAt: "2026-05-20", status: "contacted", notes: "Called on Tuesday, left voicemail", followUpDate: "2026-05-30" },
  { ...MOCK_LEADS[1], savedAt: "2026-05-22", status: "interested", notes: "Replied to email, wants a quote", followUpDate: "2026-05-28" },
  { ...MOCK_LEADS[3], savedAt: "2026-05-24", status: "new", notes: "", followUpDate: null },
  { ...MOCK_LEADS[4], savedAt: "2026-05-25", status: "proposal_sent", notes: "Sent proposal for $1,200 website", followUpDate: "2026-06-01" },
  { ...MOCK_LEADS[6], savedAt: "2026-05-26", status: "new", notes: "", followUpDate: null }
];
const MOCK_STATS = {
  totalLeadsDiscovered: 247,
  leadsSavedThisMonth: 18,
  leadsContacted: 12,
  responseRate: "23%"
};
const MOCK_TEMPLATES = [
  { id: "tpl-1", name: "No Website — Web Dev Intro", channel: "email", subject: "Quick question about {{business_name}}'s online presence", body: `Hi there,

I was searching for local businesses in {{city}} and came across {{business_name}} on Google Maps.

I noticed you don't currently have a website. As a web developer who works with local businesses, I've seen firsthand how a clean, professional website can bring in new customers who search online.

I'd love to show you what I could build for you — and I keep my rates affordable for small businesses.

Would you have 10 minutes for a quick call this week?

Best,
{{your_name}}
Web Developer`, isDefault: true },
  { id: "tpl-2", name: "Low Rating — SEO Services", channel: "email", subject: "Helping {{business_name}} get found online", body: `Hi,

I came across {{business_name}} while researching businesses in {{city}}.

I specialize in SEO for local businesses — helping them rank higher on Google and get more customers finding them organically.

Would you be open to a free 15-minute consultation to see how I could help?

Warm regards,
{{your_name}}`, isDefault: false },
  { id: "tpl-3", name: "Phone Script — Cold Call", channel: "phone_script", subject: null, body: `Hi, may I speak with the owner or manager?

[When connected:]

Hi, my name is {{your_name}} and I'm a freelance web developer. I came across {{business_name}} while searching for businesses in {{city}} and noticed you might not have a website yet.

I work with small businesses to build affordable, professional websites that help attract new customers.

Do you have a couple of minutes to chat about what I could do for you?`, isDefault: false }
];
const CATEGORIES = [
  { id: "web_dev", emoji: "💻", label: "Web Development", example: "Find businesses without websites" },
  { id: "designer", emoji: "🎨", label: "Graphic Design", example: "Find brands that need a refresh" },
  { id: "copywriter", emoji: "✍️", label: "Copywriting", example: "Find businesses with no blog or bad content" },
  { id: "seo", emoji: "📈", label: "SEO", example: "Find businesses invisible on Google" },
  { id: "social_media", emoji: "📱", label: "Social Media", example: "Find businesses with no Instagram/Facebook" },
  { id: "video", emoji: "🎥", label: "Video Production", example: "Find businesses with no video content" },
  { id: "photography", emoji: "📸", label: "Photography", example: "Find restaurants, hotels needing photos" },
  { id: "marketing", emoji: "📣", label: "Digital Marketing", example: "Find businesses with zero ad presence" },
  { id: "app_dev", emoji: "📲", label: "App Development", example: "Find businesses needing mobile apps" },
  { id: "va", emoji: "🤝", label: "Virtual Assistant", example: "Find busy entrepreneurs needing support" }
];
const COUNTRIES = [
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "AU", flag: "🇦🇺", name: "Australia" }
];
const STATUS_META = {
  new: { label: "New", emoji: "●", color: "bg-slate-100 text-slate-700", ring: "border-l-slate-400" },
  contacted: { label: "Contacted", emoji: "↗", color: "bg-blue-100 text-blue-700", ring: "border-l-blue-500" },
  interested: { label: "Interested", emoji: "✦", color: "bg-indigo-100 text-indigo-700", ring: "border-l-indigo-500" },
  proposal_sent: { label: "Proposal Sent", emoji: "✉", color: "bg-amber-100 text-amber-700", ring: "border-l-amber-500" },
  won: { label: "Won", emoji: "✓", color: "bg-emerald-100 text-emerald-700", ring: "border-l-emerald-500" },
  lost: { label: "Lost", emoji: "✕", color: "bg-red-100 text-red-700", ring: "border-l-red-400" }
};
const PipelineContext = reactExports.createContext(null);
function PipelineProvider({ children }) {
  const [pipeline, setPipeline] = reactExports.useState(MOCK_PIPELINE_LEADS);
  const savedIds = new Set(pipeline.map((l) => l.id));
  const saveLead = (lead) => {
    setPipeline(
      (prev) => prev.find((l) => l.id === lead.id) ? prev : [{ ...lead, savedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), status: "new", notes: "", followUpDate: null }, ...prev]
    );
  };
  const removeLead = (id) => setPipeline((p) => p.filter((l) => l.id !== id));
  const updateStatus = (id, status) => setPipeline((p) => p.map((l) => l.id === id ? { ...l, status } : l));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineContext.Provider, { value: { pipeline, savedIds, saveLead, removeLead, updateStatus }, children });
}
function usePipeline() {
  const ctx = reactExports.useContext(PipelineContext);
  if (!ctx) throw new Error("usePipeline inside PipelineProvider");
  return ctx;
}
const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_how: "How it works",
    nav_pricing: "Pricing",
    nav_blog: "Blog",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    nav_login: "Login",
    nav_start_free: "Start Free →",
    // Hero
    hero_eyebrow: "// find.clients.globally",
    hero_title: "The Meeting Point for Freelancers and Clients.",
    hero_sub: "Stop waiting for work to come to you. LanceConnect finds businesses that need your skills anywhere in the world and hands you their direct contacts.",
    hero_cta_leads: "Get 10 Free Leads",
    hero_cta_demo: "Watch Demo",
    // Pricing
    pricing_title: "Simple, transparent pricing",
    pricing_sub: "Start free. Upgrade when you're winning work.",
    plan_free: "Free",
    plan_individual: "Individual",
    plan_company: "Large Company",
    plan_mo: "/mo",
    plan_leads_mo: "leads / month",
    plan_cta_free: "Start Free",
    plan_cta_ind: "Get Started",
    plan_cta_comp: "Scale Up",
    plan_free_feature_1: "Basic filters",
    plan_free_feature_2: "1 template",
    plan_free_feature_3: "1 team seat",
    plan_ind_feature_1: "All filters",
    plan_ind_feature_2: "Unlimited templates",
    plan_ind_feature_3: "CRM pipeline",
    plan_ind_feature_4: "CSV export",
    plan_ind_feature_5: "AI outreach writer",
    plan_comp_feature_1: "Everything in Individual",
    plan_comp_feature_2: "3 team seats",
    plan_comp_feature_3: "API access",
    plan_comp_feature_4: "White-label option",
    plan_comp_feature_5: "Priority support",
    // Sandbox
    sandbox_eyebrow: "// interactive.lead.sandbox",
    sandbox_title: "Try the lead scanner sandbox",
    sandbox_sub: "Select your skill and a city to run a mock scan. Experience how our AI engine evaluates businesses and drafts outreach templates in seconds.",
    sandbox_step_1: "1. Select Your Craft",
    sandbox_step_2: "2. Target Location",
    sandbox_run: "Run Scanner Simulator",
    sandbox_running: "Scanning target directory...",
    sandbox_ready_title: "Scanner ready",
    sandbox_ready_desc: "Choose your skill type and target market on the left, then trigger a simulated scan to view opportunity metrics."
  },
  fr: {
    nav_home: "Accueil",
    nav_about: "À propos",
    nav_how: "Comment ça marche",
    nav_pricing: "Tarifs",
    nav_blog: "Blog",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    nav_login: "Connexion",
    nav_start_free: "Commencer Gratuitement →",
    // Hero
    hero_eyebrow: "// trouver.des.clients.partout",
    hero_title: "Le Point de Rencontre des Freelances et des Clients.",
    hero_sub: "Arrêtez d'attendre que le travail vienne à vous. LanceConnect trouve des entreprises qui ont besoin de vos compétences partout dans le monde et vous donne leurs contacts directs.",
    hero_cta_leads: "Obtenir 10 Leads Gratuits",
    hero_cta_demo: "Voir la Démo",
    // Pricing
    pricing_title: "Tarification simple et transparente",
    pricing_sub: "Commencez gratuitement. Mettez à niveau lorsque vous gagnez des contrats.",
    plan_free: "Gratuit",
    plan_individual: "Individuel",
    plan_company: "Grande Entreprise",
    plan_mo: "/mois",
    plan_leads_mo: "leads / mois",
    plan_cta_free: "Commencer Gratuitement",
    plan_cta_ind: "Démarrer",
    plan_cta_comp: "Passer à l'échelle",
    plan_free_feature_1: "Filtres basiques",
    plan_free_feature_2: "1 modèle",
    plan_free_feature_3: "1 place d'équipe",
    plan_ind_feature_1: "Tous les filtres",
    plan_ind_feature_2: "Modèles illimités",
    plan_ind_feature_3: "Pipeline CRM",
    plan_ind_feature_4: "Exportation CSV",
    plan_ind_feature_5: "Rédacteur de messages IA",
    plan_comp_feature_1: "Tout ce qui est dans Individuel",
    plan_comp_feature_2: "3 places d'équipe",
    plan_comp_feature_3: "Accès API",
    plan_comp_feature_4: "Option marque blanche",
    plan_comp_feature_5: "Support prioritaire",
    // Sandbox
    sandbox_eyebrow: "// simulateur.interactif",
    sandbox_title: "Essayez le simulateur de scanneur",
    sandbox_sub: "Sélectionnez votre domaine et une ville pour lancer une simulation de scan. Découvrez comment notre moteur IA évalue les opportunités et rédige des messages en quelques secondes.",
    sandbox_step_1: "1. Sélectionnez votre domaine",
    sandbox_step_2: "2. Emplacement cible",
    sandbox_run: "Lancer le simulateur de scan",
    sandbox_running: "Scan de l'annuaire cible...",
    sandbox_ready_title: "Scanneur prêt",
    sandbox_ready_desc: "Choisissez votre compétence et votre marché cible à gauche, puis lancez une simulation de scan pour voir les opportunités."
  },
  it: {
    nav_home: "Home",
    nav_about: "Chi Siamo",
    nav_how: "Come funziona",
    nav_pricing: "Prezzi",
    nav_blog: "Blog",
    nav_portfolio: "Portfolio",
    nav_contact: "Contatti",
    nav_login: "Accedi",
    nav_start_free: "Inizia Gratis →",
    // Hero
    hero_eyebrow: "// trova.clienti.globalmente",
    hero_title: "Il Punto di Incontro per Freelance e Clienti.",
    hero_sub: "Smetti di aspettare che il lavoro arrivi da te. LanceConnect trova aziende che hanno bisogno delle tue competenze in tutto il mondo e ti fornisce i loro contatti diretti.",
    hero_cta_leads: "Ottieni 10 Lead Gratuiti",
    hero_cta_demo: "Guarda la Demo",
    // Pricing
    pricing_title: "Prezzi semplici e trasparenti",
    pricing_sub: "Inizia gratis. Fai l'upgrade quando trovi lavoro.",
    plan_free: "Gratis",
    plan_individual: "Individuale",
    plan_company: "Grande Azienda",
    plan_mo: "/mese",
    plan_leads_mo: "lead / mese",
    plan_cta_free: "Inizia Gratis",
    plan_cta_ind: "Inizia Ora",
    plan_cta_comp: "Scala il Business",
    plan_free_feature_1: "Filtri di base",
    plan_free_feature_2: "1 modello",
    plan_free_feature_3: "1 posto nel team",
    plan_ind_feature_1: "Tutti i filtri",
    plan_ind_feature_2: "Modelli illimitati",
    plan_ind_feature_3: "Pipeline CRM",
    plan_ind_feature_4: "Esportazione CSV",
    plan_ind_feature_5: "Scrittore outreach AI",
    plan_comp_feature_1: "Tutto in Individuale",
    plan_comp_feature_2: "3 posti nel team",
    plan_comp_feature_3: "Accesso API",
    plan_comp_feature_4: "Opzione white-label",
    plan_comp_feature_5: "Supporto prioritario",
    // Sandbox
    sandbox_eyebrow: "// sandbox.lead.interattiva",
    sandbox_title: "Prova la sandbox del lead scanner",
    sandbox_sub: "Seleziona la tua specializzazione e una città per eseguire un finto scan. Scopri come il nostro motore AI valuta le aziende e redige modelli in pochi secondi.",
    sandbox_step_1: "1. Seleziona la tua abilità",
    sandbox_step_2: "2. Posizione target",
    sandbox_run: "Esegui simulatore scanner",
    sandbox_running: "Scansione della cartella target...",
    sandbox_ready_title: "Scanner pronto",
    sandbox_ready_desc: "Scegli la tua abilità e il mercato a sinistra, quindi avvia la simulazione per vedere le metriche delle opportunità."
  },
  es: {
    nav_home: "Inicio",
    nav_about: "Sobre Nosotros",
    nav_how: "Cómo funciona",
    nav_pricing: "Precios",
    nav_blog: "Blog",
    nav_portfolio: "Portafolio",
    nav_contact: "Contacto",
    nav_login: "Iniciar Sesión",
    nav_start_free: "Comenzar Gratis →",
    // Hero
    hero_eyebrow: "// encontrar.clientes.globalmente",
    hero_title: "El Punto de Encuentro para Freelancers y Clientes.",
    hero_sub: "Deja de esperar a que el trabajo llegue a ti. LanceConnect encuentra empresas que necesitan tus habilidades en cualquier parte del mundo y te entrega sus contactos directos.",
    hero_cta_leads: "Obtén 10 Leads Gratis",
    hero_cta_demo: "Ver Demo",
    // Pricing
    pricing_title: "Precios simples y transparentes",
    pricing_sub: "Comienza gratis. Actualiza cuando ganes proyectos.",
    plan_free: "Gratis",
    plan_individual: "Individual",
    plan_company: "Empresa Grande",
    plan_mo: "/mes",
    plan_leads_mo: "leads / mes",
    plan_cta_free: "Comenzar Gratis",
    plan_cta_ind: "Comenzar",
    plan_cta_comp: "Escalar",
    plan_free_feature_1: "Filtros básicos",
    plan_free_feature_2: "1 plantilla",
    plan_free_feature_3: "1 asiento de equipo",
    plan_ind_feature_1: "Todos los filtros",
    plan_ind_feature_2: "Plantillas ilimitadas",
    plan_ind_feature_3: "Pipeline de CRM",
    plan_ind_feature_4: "Exportación CSV",
    plan_ind_feature_5: "Redactor de mensajes de IA",
    plan_comp_feature_1: "Todo lo de Individual",
    plan_comp_feature_2: "3 asientos de equipo",
    plan_comp_feature_3: "Acceso API",
    plan_comp_feature_4: "Opción marca blanca",
    plan_comp_feature_5: "Soporte prioritario",
    // Sandbox
    sandbox_eyebrow: "// sandbox.interactivo.leads",
    sandbox_title: "Prueba el simulador de escáner",
    sandbox_sub: "Selecciona tu habilidad y una ciudad para simular un escaneo. Mira cómo nuestro motor de IA evalúa los negocios y redacta mensajes en segundos.",
    sandbox_step_1: "1. Selecciona tu habilidad",
    sandbox_step_2: "2. Ubicación objetivo",
    sandbox_run: "Ejecutar simulador de escáner",
    sandbox_running: "Escaneando el directorio objetivo...",
    sandbox_ready_title: "Escáner listo",
    sandbox_ready_desc: "Elige tu habilidad y el mercado objetivo en la izquierda, luego inicia una simulación de escaneo."
  },
  pt: {
    nav_home: "Início",
    nav_about: "Sobre nós",
    nav_how: "Como funciona",
    nav_pricing: "Preços",
    nav_blog: "Blog",
    nav_portfolio: "Portfólio",
    nav_contact: "Contato",
    nav_login: "Entrar",
    nav_start_free: "Começar Grátis →",
    // Hero
    hero_eyebrow: "// encontrar.clientes.globalmente",
    hero_title: "O Ponto de Encontro para Freelancers e Clientes.",
    hero_sub: "Pare de esperar que o trabalho venha até você. O LanceConnect encontra empresas que precisam das suas habilidades em qualquer lugar do mundo e te entrega os contatos diretos.",
    hero_cta_leads: "Ganhe 10 Leads Grátis",
    hero_cta_demo: "Ver Demo",
    // Pricing
    pricing_title: "Preços simples e transparentes",
    pricing_sub: "Comece grátis. Mude de plano quando ganhar projetos.",
    plan_free: "Grátis",
    plan_individual: "Individual",
    plan_company: "Grande Empresa",
    plan_mo: "/mês",
    plan_leads_mo: "leads / mês",
    plan_cta_free: "Começar Grátis",
    plan_cta_ind: "Começar",
    plan_cta_comp: "Expandir",
    plan_free_feature_1: "Filtros básicos",
    plan_free_feature_2: "1 modelo",
    plan_free_feature_3: "1 vaga na equipe",
    plan_ind_feature_1: "Todos os filtros",
    plan_ind_feature_2: "Modelos ilimitados",
    plan_ind_feature_3: "Funil de CRM",
    plan_ind_feature_4: "Exportação CSV",
    plan_ind_feature_5: "Redator de mensagens IA",
    plan_comp_feature_1: "Tudo do plano Individual",
    plan_comp_feature_2: "3 vagas na equipe",
    plan_comp_feature_3: "Acesso à API",
    plan_comp_feature_4: "Opção marca branca",
    plan_comp_feature_5: "Suporte prioritário",
    // Sandbox
    sandbox_eyebrow: "// simulador.de.leads.interativo",
    sandbox_title: "Experimente a sandbox do scanner",
    sandbox_sub: "Selecione sua habilidade e uma cidade para executar um escaneamento simulado. Veja como nosso motor de IA analisa empresas e cria mensagens em segundos.",
    sandbox_step_1: "1. Escolha sua habilidade",
    sandbox_step_2: "2. Localização alvo",
    sandbox_run: "Executar simulador de scanner",
    sandbox_running: "Escaneando o diretório alvo...",
    sandbox_ready_title: "Scanner pronto",
    sandbox_ready_desc: "Escolha sua especialidade e mercado à esquerda, depois ative o simulador para ver as métricas."
  }
};
const PreferencesContext = reactExports.createContext(void 0);
const PreferencesProvider = ({ children }) => {
  const [language, setLanguageState] = reactExports.useState("en");
  const [currency, setCurrencyState] = reactExports.useState("USD");
  reactExports.useEffect(() => {
    const savedLang = localStorage.getItem("lanceconnect_lang");
    const savedCurr = localStorage.getItem("lanceconnect_curr");
    if (savedLang && ["en", "fr", "it", "es", "pt"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    if (savedCurr && ["USD", "EUR", "GBP", "NGN", "BRL"].includes(savedCurr)) {
      setCurrencyState(savedCurr);
    }
  }, []);
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("lanceconnect_lang", lang);
  };
  const setCurrency = (curr) => {
    setCurrencyState(curr);
    localStorage.setItem("lanceconnect_curr", curr);
  };
  const t = (key) => {
    return translations[language][key] || translations["en"][key] || key;
  };
  const formatPrice = (usdAmount) => {
    if (usdAmount === 0) return "0";
    switch (currency) {
      case "EUR":
        return Math.round(usdAmount * 0.9).toString();
      case "GBP":
        return Math.round(usdAmount * 0.8).toString();
      case "NGN":
        return (usdAmount * 1500).toLocaleString();
      case "BRL":
        return (usdAmount * 5).toLocaleString();
      case "USD":
      default:
        return usdAmount.toString();
    }
  };
  const getCurrencySymbol = () => {
    switch (currency) {
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "NGN":
        return "₦";
      case "BRL":
        return "R$";
      case "USD":
      default:
        return "$";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    PreferencesContext.Provider,
    {
      value: {
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatPrice,
        getCurrencySymbol
      },
      children
    }
  );
};
const usePreferences = () => {
  const context = reactExports.useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent", children: "Go home" })
    ] })
  ] }) });
}
const Route$B = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LanceConnect — The Meeting Point for Freelancers and Clients" },
      { name: "description", content: "The Meeting Point for Freelancers and Clients. LanceConnect finds businesses that need your skills anywhere in the world." },
      { property: "og:title", content: "LanceConnect" },
      { property: "og:description", content: "The Meeting Point for Freelancers and Clients" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$B.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PreferencesProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PipelineProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "bottom-right", richColors: true, closeButton: true })
  ] }) }) }) });
}
const $$splitComponentImporter$z = () => import("./verify-email-CuOumJQ2.mjs");
const Route$A = createFileRoute("/verify-email")({
  head: () => ({
    meta: [{
      title: "Verify your email — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./unsubscribe-JCe-I_pM.mjs");
const Route$z = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [{
      title: "Unsubscribe — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./terms-oE3EQOTS.mjs");
const Route$y = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms of Service — LanceConnect"
    }, {
      name: "description",
      content: "The terms governing your use of LanceConnect."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./reset-password-UOSrO83V.mjs");
const Route$x = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{
      title: "Set new password — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./register-CiuivE7_.mjs");
const Route$w = createFileRoute("/register")({
  head: () => ({
    meta: [{
      title: "Create account — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./privacy-Cv_xEhAN.mjs");
const Route$v = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — LanceConnect"
    }, {
      name: "description",
      content: "How we collect, use, and protect your data."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./pricing-C-uEAtn7.mjs");
const Route$u = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing — LanceConnect"
    }, {
      name: "description",
      content: "Plans from $0 to $20/month. 14-day money-back guarantee. No credit card to start."
    }, {
      property: "og:title",
      content: "LanceConnect Pricing"
    }, {
      property: "og:description",
      content: "Free, Individual, Large Company. Simple, transparent."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./portfolio-CXiuzj5O.mjs");
const Route$t = createFileRoute("/portfolio")({
  head: () => ({
    meta: [{
      title: "Freelancer Portfolios — LanceConnect"
    }, {
      name: "description",
      content: "Explore portfolios of top-tier global freelancers across web development, design, SEO, and copywriting."
    }, {
      property: "og:title",
      content: "LanceConnect Portfolio Directory"
    }, {
      property: "og:description",
      content: "See visual work showcases and hire professional freelancers directly."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./onboarding-QLhwqOhW.mjs");
const Route$s = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{
      title: "Welcome — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./maintenance-ViGR4mvd.mjs");
const Route$r = createFileRoute("/maintenance")({
  head: () => ({
    meta: [{
      title: "Down for maintenance — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Logo({ className, size = 32 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 40 40",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className: cn(className),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "20", r: "6", fill: "#6366F1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "26", cy: "20", r: "6", fill: "#10B981" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 20L26 20", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17 20C18.5 18.5 19.5 18.5 22 20C24.5 21.5 25.5 21.5 27 20", stroke: "currentColor", strokeWidth: "1.5", fill: "none" })
      ]
    }
  );
}
function LanceConnectLogo({ className, showText = true, showSlogan = true, size = 32 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3.5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size }),
    showText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline leading-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-foreground", children: "Lance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold", style: { color: "#6366F1" }, children: "Connect" })
      ] }),
      showSlogan && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] text-[#64748B] mt-1 whitespace-nowrap leading-none tracking-tight", children: "The Meeting Point for Freelancers and Clients" })
    ] })
  ] });
}
const $$splitComponentImporter$p = () => import("./login-DCOZF36x.mjs");
const Route$q = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
function AuthSplit({
  children,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-h-screen lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-active lg:flex lg:flex-col lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80", alt: "", className: "absolute inset-0 h-full w-full object-cover opacity-25" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-sidebar/70" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "relative flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 36 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold", children: "LanceConnect" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold leading-tight", children: "Join 10,000+ freelancers finding clients daily." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-3 text-sm text-sidebar-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400" }),
            " 10 free leads, no credit card"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400" }),
            " Works for any freelance skill"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400" }),
            " Businesses in 150+ countries"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative text-xs text-sidebar-foreground/70", children: '"Found 3 clients in my first week." — Taiwo A., Web Dev' })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 lg:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: title }),
      children
    ] }) })
  ] });
}
const $$splitComponentImporter$o = () => import("./how-it-works-CQtMOnef.mjs");
const Route$p = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [{
      title: "How it works — LanceConnect"
    }, {
      name: "description",
      content: "Step-by-step: how LanceConnect helps freelancers go from a blank screen to booked calls."
    }, {
      property: "og:title",
      content: "How LanceConnect works"
    }, {
      property: "og:description",
      content: "A simple 5-step workflow for finding and winning freelance clients."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./forgot-password-Xm7q7k8R.mjs");
const Route$o = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{
      title: "Forgot password — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const IMG = {
  // Hero / general
  heroFreelancer: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80",
  // woman with laptop on bed (Brooke Cagle)
  heroLaptop: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1400&q=80",
  // laptop on desk
  workspace: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&q=80",
  // desk
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80",
  coffeeShop: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1400&q=80",
  marketStall: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
  // Categories
  webDev: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80",
  designer: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=80",
  copywriter: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  seo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  social: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1200&q=80",
  video: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80",
  photo: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
  marketing: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&q=80",
  appDev: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80",
  va: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
  // Faces — for testimonials & team. Real people photos from Unsplash.
  face1: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80",
  face2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
  face3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
  face4: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
  face5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  face6: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
  // Blog images
  blog1: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80",
  blog2: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=80",
  blog3: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80",
  blog4: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1000&q=80",
  blog5: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&q=80",
  blog6: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80"
};
const BLOG_POSTS = [
  {
    slug: "first-five-cold-emails",
    title: "The first 5 cold emails I sent as a freelance web developer",
    excerpt: "What worked, what flopped, and the script I now use on every Monday morning.",
    body: `When I started freelancing in Lagos in 2023, I had a portfolio of three projects and zero leads. Cold email felt awkward — but it was the only honest way to start a pipeline without spending money I didn't have.

The first email I sent was a 400-word essay about my services. No reply. The second was shorter but full of "I"s. No reply. The third was three sentences, ended in a question, and got a reply in 17 minutes.

Here's what I learned: people don't owe you a reply. They owe you about four seconds of attention. Use them well.`,
    cover: IMG.blog1,
    author: "Taiwo Adeyemi",
    authorAvatar: IMG.face1,
    date: "May 21, 2026",
    readMins: 6,
    category: "Outreach"
  },
  {
    slug: "scoring-leads-without-ai",
    title: "How to score leads without fancy AI",
    excerpt: "A back-of-the-envelope framework for ranking businesses before you reach out.",
    body: `Lead scoring sounds like enterprise software jargon, but it's actually something a 15-year-old with a spreadsheet could do. Here's the version I used for two years before any AI got involved.

Give every business 1 point for each painful thing you'd fix for them, and subtract 1 for each blocker. Three painful things and one blocker? Score: 2.`,
    cover: IMG.blog2,
    author: "Maria Silva",
    authorAvatar: IMG.face2,
    date: "May 14, 2026",
    readMins: 4,
    category: "Sales"
  },
  {
    slug: "pricing-as-a-new-freelancer",
    title: "Pricing as a new freelancer (without underselling yourself)",
    excerpt: "Three pricing mistakes I made in my first year — and what I'd do differently.",
    body: `My first website cost the client $80. It took me 32 hours. That's $2.50 per hour, less than a coffee in Naples. Don't be me.`,
    cover: IMG.blog3,
    author: "James Kariuki",
    authorAvatar: IMG.face3,
    date: "May 7, 2026",
    readMins: 5,
    category: "Business"
  },
  {
    slug: "calling-strangers-cold-calls",
    title: "Calling strangers: a freelancer's guide to cold calls that don't suck",
    excerpt: "The opening line that works, the question that doesn't, and how to handle the 'send me an email' brush-off.",
    body: `Cold calls are not dead. They're just badly done. A good cold call is one minute long, ends in a question, and never tries to sell anything.`,
    cover: IMG.blog4,
    author: "Priya Patel",
    authorAvatar: IMG.face4,
    date: "April 30, 2026",
    readMins: 7,
    category: "Outreach"
  },
  {
    slug: "freelance-from-anywhere",
    title: "Freelancing from anywhere: clients I won from a beach in Goa",
    excerpt: "A week-by-week breakdown of how location stopped mattering for my consulting practice.",
    body: `Two years ago I moved from London to Goa for the winter. I assumed my income would tank. It tripled.`,
    cover: IMG.blog5,
    author: "Alex Johnson",
    authorAvatar: IMG.face5,
    date: "April 23, 2026",
    readMins: 8,
    category: "Lifestyle"
  },
  {
    slug: "templates-vs-personal-outreach",
    title: "Templates vs personal outreach: the unsexy truth",
    excerpt: "When templates work, when they backfire, and the 80/20 rule that saved my Mondays.",
    body: `Templates aren't shortcuts — they're scaffolding. The first three sentences are templated. The fourth is yours.`,
    cover: IMG.blog6,
    author: "Sofia Romano",
    authorAvatar: IMG.face6,
    date: "April 16, 2026",
    readMins: 5,
    category: "Outreach"
  }
];
const CHANGELOG = [
  { date: "May 28, 2026", version: "v2.4.0", title: "AI Outreach Writer is live for Pro", tag: "feature", items: ["Personalised email + DM generator, fed from each lead's profile", "Tone slider: friendly, formal, casual, direct", "5 languages: English, Spanish, French, Italian, Portuguese"] },
  { date: "May 14, 2026", version: "v2.3.2", title: "Faster discovery in dense cities", tag: "improvement", items: ["Discover queries in Lagos, Mumbai and São Paulo are 3× faster", "Lead cards now lazy-load — pages with 100+ leads stay snappy"] },
  { date: "May 02, 2026", version: "v2.3.0", title: "Pipeline kanban with drag-and-drop", tag: "feature", items: ["Move leads between stages by dragging", "Per-stage filters and weekly follow-up view", "CSV export of your full pipeline"] },
  { date: "Apr 19, 2026", version: "v2.2.4", title: "Fix: WhatsApp links not opening on iOS 17", tag: "fix", items: ["Outreach links to WhatsApp now use the universal wa.me handler"] },
  { date: "Apr 04, 2026", version: "v2.2.0", title: "9 new freelancer categories", tag: "feature", items: ["Added VAs, photographers, video editors, marketers and 5 more", "Each category gets its own opportunity-scoring model"] }
];
const TEAM = [
  { name: "Taiwo Adeyemi", role: "Co-founder, Engineering", city: "Lagos, Nigeria", avatar: IMG.face1, bio: "Ex-freelance web dev. Built the first version on weekends." },
  { name: "Maria Silva", role: "Co-founder, Design", city: "São Paulo, Brazil", avatar: IMG.face2, bio: "Designed the product after years of cold-emailing her own clients." },
  { name: "James Kariuki", role: "Growth & Sales", city: "Nairobi, Kenya", avatar: IMG.face3, bio: "Helps freelancers close their first 10 clients." },
  { name: "Priya Patel", role: "Engineering", city: "Mumbai, India", avatar: IMG.face4, bio: "Lead-discovery pipelines, opportunity scoring." },
  { name: "Sofia Romano", role: "Content", city: "Naples, Italy", avatar: IMG.face6, bio: "Writes the playbooks freelancers actually use." },
  { name: "Lucas Fernández", role: "Support", city: "Buenos Aires, Argentina", avatar: IMG.face5, bio: "Replies within 4 hours, every day, in 3 languages." }
];
const FREELANCER_CATEGORIES = [
  {
    slug: "web-developers",
    label: "Web Developers",
    emoji: "💻",
    image: IMG.webDev,
    tagline: "Find local businesses still running on a Facebook page.",
    description: "Every week, LanceConnect surfaces hundreds of restaurants, salons, plumbers and clinics in your area that have no website — or a broken one from 2014. Reach them before someone else does.",
    problems: ["No website at all", "Outdated WordPress with broken links", "No mobile-friendly version", "No online booking form"],
    sampleBusinesses: [{ name: "Boulangerie Dupont, Lyon", reason: "4.9★ on Google, no website" }, { name: "Mario's Ristorante, Naples", reason: "Facebook-only presence" }, { name: "Lagos Hair Studio", reason: "Website returns 502" }]
  },
  {
    slug: "designers",
    label: "Graphic Designers",
    emoji: "🎨",
    image: IMG.designer,
    tagline: "Spot brands that desperately need a refresh.",
    description: "Logos from 2008. Menus printed in Comic Sans. Inconsistent colours across every channel. These businesses don't know they need you — until you show them.",
    problems: ["Dated or pixelated logo", "No brand consistency online", "Ugly menus and price lists", "No social media graphics"],
    sampleBusinesses: [{ name: "Smith & Sons Plumbing, Manchester", reason: "Logo is clip-art" }, { name: "Café Mirador, Buenos Aires", reason: "Different colours on each platform" }, { name: "AutoFix Garage, Toronto", reason: "No brand kit" }]
  },
  {
    slug: "copywriters",
    label: "Copywriters",
    emoji: "✍️",
    image: IMG.copywriter,
    tagline: "Find websites whose copy is putting customers to sleep.",
    description: "Generic 'About Us' pages. Headlines that say 'Welcome to our site'. Product descriptions written by the founder at 11pm. The web is full of businesses that need a copywriter — they just don't know it.",
    problems: ["Generic homepage hero copy", "No clear value proposition", "Empty or thin blog", "Vague service descriptions"],
    sampleBusinesses: [{ name: "Dr. Patel Dental Clinic, Mumbai", reason: "Homepage says 'Welcome to our website'" }, { name: "AutoFix Garage, Toronto", reason: "No services described" }]
  },
  {
    slug: "seo-specialists",
    label: "SEO Specialists",
    emoji: "📈",
    image: IMG.seo,
    tagline: "Find businesses invisible on Google.",
    description: "If a restaurant doesn't appear in 'best pizza near me' results in their own city, you have a client. We'll show you which ones.",
    problems: ["No Google Business Profile", "Not indexed for their main keyword", "No backlinks", "Slow page speed"],
    sampleBusinesses: [{ name: "Boulangerie Dupont, Lyon", reason: "Not ranking for 'bakery Lyon'" }, { name: "Kuala Lumpur Yoga Studio", reason: "No GMB profile" }]
  },
  {
    slug: "social-media",
    label: "Social Media Managers",
    emoji: "📱",
    image: IMG.social,
    tagline: "Spot brands whose Instagram hasn't posted since 2022.",
    description: "Restaurants, gyms, boutiques — they all know they 'should' be posting. They just don't have time. That's your opening.",
    problems: ["Last post 6+ months ago", "No Reels or short-form video", "Inconsistent branding across platforms", "No paid social presence"],
    sampleBusinesses: [{ name: "Mario's Ristorante, Naples", reason: "Last post: 2022" }, { name: "Café Mirador, Buenos Aires", reason: "Only 47 followers" }]
  },
  {
    slug: "videographers",
    label: "Videographers",
    emoji: "🎥",
    image: IMG.video,
    tagline: "Find businesses whose YouTube is a wasteland.",
    description: "Hotels with zero room-tour videos. Restaurants with no behind-the-scenes content. Schools with no campus tours. These need video — and they have budgets.",
    problems: ["No video content at all", "Only one shaky phone video", "No Reels or TikTok presence", "Outdated promo from 2019"],
    sampleBusinesses: [{ name: "Kuala Lumpur Yoga Studio", reason: "No class previews" }, { name: "Dr. Patel Dental Clinic", reason: "No clinic tour" }]
  },
  {
    slug: "photographers",
    label: "Photographers",
    emoji: "📸",
    image: IMG.photo,
    tagline: "Find restaurants using stock photos of pasta.",
    description: "Hotels with blurry lobby shots. Restaurants with dimly-lit menu photos. Salons with no portfolio. Your camera is the answer.",
    problems: ["Stock photos instead of real shots", "Blurry phone photos on Google", "No portfolio of their actual work", "No team headshots"],
    sampleBusinesses: [{ name: "Boulangerie Dupont, Lyon", reason: "Generic croissant stock photo" }, { name: "Lagos Hair Studio", reason: "No before/after gallery" }]
  },
  {
    slug: "marketers",
    label: "Digital Marketers",
    emoji: "📣",
    image: IMG.marketing,
    tagline: "Spot businesses spending zero on ads — and growing flat.",
    description: "If they're not on Meta Ads, Google Ads, or running email campaigns, you can probably double their reach in 90 days.",
    problems: ["No paid advertising at all", "No email list", "No remarketing pixels", "No analytics installed"],
    sampleBusinesses: [{ name: "Smith & Sons Plumbing", reason: "No tracking pixels" }, { name: "AutoFix Garage, Toronto", reason: "No email signup" }]
  },
  {
    slug: "virtual-assistants",
    label: "Virtual Assistants",
    emoji: "🤝",
    image: IMG.va,
    tagline: "Find solo founders drowning in admin.",
    description: "Coaches, consultants, agency owners — they all do too much themselves. We surface the busy ones who're showing the signs.",
    problems: ["Founder still doing all email", "No CRM or inbox management", "Manual invoicing", "Booking calls done over DMs"],
    sampleBusinesses: [{ name: "Dr. Patel Dental Clinic", reason: "Owner replies to every DM personally" }, { name: "Café Mirador", reason: "Owner doing all bookings via WhatsApp" }]
  },
  {
    slug: "app-developers",
    label: "App Developers",
    emoji: "📲",
    image: IMG.appDev,
    tagline: "Spot businesses that need a mobile app — not just a website.",
    description: "Loyalty programs, booking apps, delivery apps. There's a huge middle market of established businesses with no app at all.",
    problems: ["No loyalty app for repeat customers", "Booking done via phone only", "No mobile ordering", "No staff scheduling app"],
    sampleBusinesses: [{ name: "Kuala Lumpur Yoga Studio", reason: "Bookings via WhatsApp" }, { name: "AutoFix Garage, Toronto", reason: "Paper service records" }]
  }
];
const $$splitComponentImporter$m = () => import("./features-C3MNqr57.mjs");
const Route$n = createFileRoute("/features")({
  head: () => ({
    meta: [{
      title: "Features — LanceConnect"
    }, {
      name: "description",
      content: "Deep dive into every feature: lead discovery, opportunity scoring, CRM pipeline, outreach templates, and the AI message writer."
    }, {
      property: "og:title",
      content: "LanceConnect Features"
    }, {
      property: "og:description",
      content: "Every feature explained, with screenshots."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./contact-CzqvkEWT.mjs");
const Route$m = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact — LanceConnect"
    }, {
      name: "description",
      content: "Reach the LanceConnect team. We reply within 4 hours, 7 days a week."
    }, {
      property: "og:title",
      content: "Contact LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./changelog-BjgFcbKP.mjs");
const Route$l = createFileRoute("/changelog")({
  head: () => ({
    meta: [{
      title: "Changelog — LanceConnect"
    }, {
      name: "description",
      content: "Every update we ship. Features, improvements, and fixes."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./app-DD2rs1lI.mjs");
const Route$k = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("fc_auth") !== "1") {
      throw redirect({
        to: "/login"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./about-BMq_OGea.mjs");
const Route$j = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — LanceConnect"
    }, {
      name: "description",
      content: "Bridging the gap between skilled freelancers and the clients looking for their expertise."
    }, {
      property: "og:title",
      content: "About LanceConnect"
    }, {
      property: "og:description",
      content: "Connecting freelancers and clients in a simple, trusted, and human way."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./500-BrLeAxI8.mjs");
const Route$i = createFileRoute("/500")({
  head: () => ({
    meta: [{
      title: "Something broke — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./404-BmVHnqaL.mjs");
const Route$h = createFileRoute("/404")({
  head: () => ({
    meta: [{
      title: "Page not found — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./index-CSDk7ApI.mjs");
const Route$g = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "LanceConnect — The Meeting Point for Freelancers and Clients"
    }, {
      name: "description",
      content: "LanceConnect finds businesses that need your skills anywhere in the world, and hands you their contact details."
    }, {
      property: "og:title",
      content: "LanceConnect"
    }, {
      property: "og:description",
      content: "The Meeting Point for Freelancers and Clients"
    }, {
      property: "og:image",
      content: IMG.heroFreelancer
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./blog.index-B3qWN3MG.mjs");
const Route$f = createFileRoute("/blog/")({
  head: () => ({
    meta: [{
      title: "Blog — LanceConnect"
    }, {
      name: "description",
      content: "Real stories, scripts, and playbooks from freelancers who actually win clients."
    }, {
      property: "og:title",
      content: "LanceConnect Blog"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const Route$e = createFileRoute("/app/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/dashboard" });
  }
});
const $$splitComponentImporter$d = () => import("./freelancers._slug-CUk-nFYH.mjs");
const $$splitErrorComponentImporter$1 = () => import("./freelancers._slug-B2S-PfkX.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./freelancers._slug-BGgktZh0.mjs");
const Route$d = createFileRoute("/freelancers/$slug")({
  loader: ({
    params
  }) => {
    const cat = FREELANCER_CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return {
      cat
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `Find clients as a ${loaderData.cat.label.toLowerCase()} — LanceConnect`
    }, {
      name: "description",
      content: loaderData.cat.tagline
    }, {
      property: "og:title",
      content: `For ${loaderData.cat.label}`
    }, {
      property: "og:description",
      content: loaderData.cat.tagline
    }, {
      property: "og:image",
      content: loaderData.cat.image
    }] : []
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./blog._slug-9DDXb72W.mjs");
const $$splitErrorComponentImporter = () => import("./blog._slug-BrKMdDVl.mjs");
const $$splitNotFoundComponentImporter = () => import("./blog._slug-KKyJmG8n.mjs");
const Route$c = createFileRoute("/blog/$slug")({
  loader: ({
    params
  }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return {
      post
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.post.title} — LanceConnect Blog`
    }, {
      name: "description",
      content: loaderData.post.excerpt
    }, {
      property: "og:title",
      content: loaderData.post.title
    }, {
      property: "og:description",
      content: loaderData.post.excerpt
    }, {
      property: "og:image",
      content: loaderData.post.cover
    }, {
      property: "og:type",
      content: "article"
    }] : []
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.upgrade-CHxwFteP.mjs");
const Route$b = createFileRoute("/app/upgrade")({
  head: () => ({
    meta: [{
      title: "Upgrade — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.templates-DseaqjaV.mjs");
const Route$a = createFileRoute("/app/templates")({
  head: () => ({
    meta: [{
      title: "Outreach Templates — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.settings-wj-Mwpf_.mjs");
const Route$9 = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{
      title: "Settings — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
function SettingsField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
const $$splitComponentImporter$8 = () => import("./app.pipeline-Dtnp48yO.mjs");
const Route$8 = createFileRoute("/app/pipeline")({
  head: () => ({
    meta: [{
      title: "My Pipeline — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.discover-OLn5DDBU.mjs");
const Route$7 = createFileRoute("/app/discover")({
  head: () => ({
    meta: [{
      title: "Discover Leads — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.dashboard-CSCzLGx-.mjs");
const Route$6 = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.ai-generator-BXB5-RC8.mjs");
const Route$5 = createFileRoute("/app/ai-generator")({
  head: () => ({
    meta: [{
      title: "AI Outreach Writer — LanceConnect"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./app.settings.index-D49uDb-T.mjs");
const Route$4 = createFileRoute("/app/settings/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.settings.subscription-CKFNpZT1.mjs");
const Route$3 = createFileRoute("/app/settings/subscription")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./app.settings.profile-60P2f1gn.mjs");
const Route$2 = createFileRoute("/app/settings/profile")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.settings.notifications-RUdVVR6M.mjs");
const Route$1 = createFileRoute("/app/settings/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.settings.danger-zone-CiKA8Qpd.mjs");
const Route = createFileRoute("/app/settings/danger-zone")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VerifyEmailRoute = Route$A.update({
  id: "/verify-email",
  path: "/verify-email",
  getParentRoute: () => Route$B
});
const UnsubscribeRoute = Route$z.update({
  id: "/unsubscribe",
  path: "/unsubscribe",
  getParentRoute: () => Route$B
});
const TermsRoute = Route$y.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$B
});
const ResetPasswordRoute = Route$x.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$B
});
const RegisterRoute = Route$w.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$B
});
const PrivacyRoute = Route$v.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$B
});
const PricingRoute = Route$u.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$B
});
const PortfolioRoute = Route$t.update({
  id: "/portfolio",
  path: "/portfolio",
  getParentRoute: () => Route$B
});
const OnboardingRoute = Route$s.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$B
});
const MaintenanceRoute = Route$r.update({
  id: "/maintenance",
  path: "/maintenance",
  getParentRoute: () => Route$B
});
const LoginRoute = Route$q.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$B
});
const HowItWorksRoute = Route$p.update({
  id: "/how-it-works",
  path: "/how-it-works",
  getParentRoute: () => Route$B
});
const ForgotPasswordRoute = Route$o.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$B
});
const FeaturesRoute = Route$n.update({
  id: "/features",
  path: "/features",
  getParentRoute: () => Route$B
});
const ContactRoute = Route$m.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$B
});
const ChangelogRoute = Route$l.update({
  id: "/changelog",
  path: "/changelog",
  getParentRoute: () => Route$B
});
const AppRoute = Route$k.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$B
});
const AboutRoute = Route$j.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$B
});
const R500Route = Route$i.update({
  id: "/500",
  path: "/500",
  getParentRoute: () => Route$B
});
const R404Route = Route$h.update({
  id: "/404",
  path: "/404",
  getParentRoute: () => Route$B
});
const IndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$B
});
const BlogIndexRoute = Route$f.update({
  id: "/blog/",
  path: "/blog/",
  getParentRoute: () => Route$B
});
const AppIndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const FreelancersSlugRoute = Route$d.update({
  id: "/freelancers/$slug",
  path: "/freelancers/$slug",
  getParentRoute: () => Route$B
});
const BlogSlugRoute = Route$c.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$B
});
const AppUpgradeRoute = Route$b.update({
  id: "/upgrade",
  path: "/upgrade",
  getParentRoute: () => AppRoute
});
const AppTemplatesRoute = Route$a.update({
  id: "/templates",
  path: "/templates",
  getParentRoute: () => AppRoute
});
const AppSettingsRoute = Route$9.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppPipelineRoute = Route$8.update({
  id: "/pipeline",
  path: "/pipeline",
  getParentRoute: () => AppRoute
});
const AppDiscoverRoute = Route$7.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$6.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppAiGeneratorRoute = Route$5.update({
  id: "/ai-generator",
  path: "/ai-generator",
  getParentRoute: () => AppRoute
});
const AppSettingsIndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppSettingsRoute
});
const AppSettingsSubscriptionRoute = Route$3.update({
  id: "/subscription",
  path: "/subscription",
  getParentRoute: () => AppSettingsRoute
});
const AppSettingsProfileRoute = Route$2.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AppSettingsRoute
});
const AppSettingsNotificationsRoute = Route$1.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AppSettingsRoute
});
const AppSettingsDangerZoneRoute = Route.update({
  id: "/danger-zone",
  path: "/danger-zone",
  getParentRoute: () => AppSettingsRoute
});
const AppSettingsRouteChildren = {
  AppSettingsDangerZoneRoute,
  AppSettingsNotificationsRoute,
  AppSettingsProfileRoute,
  AppSettingsSubscriptionRoute,
  AppSettingsIndexRoute
};
const AppSettingsRouteWithChildren = AppSettingsRoute._addFileChildren(
  AppSettingsRouteChildren
);
const AppRouteChildren = {
  AppAiGeneratorRoute,
  AppDashboardRoute,
  AppDiscoverRoute,
  AppPipelineRoute,
  AppSettingsRoute: AppSettingsRouteWithChildren,
  AppTemplatesRoute,
  AppUpgradeRoute,
  AppIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  R404Route,
  R500Route,
  AboutRoute,
  AppRoute: AppRouteWithChildren,
  ChangelogRoute,
  ContactRoute,
  FeaturesRoute,
  ForgotPasswordRoute,
  HowItWorksRoute,
  LoginRoute,
  MaintenanceRoute,
  OnboardingRoute,
  PortfolioRoute,
  PricingRoute,
  PrivacyRoute,
  RegisterRoute,
  ResetPasswordRoute,
  TermsRoute,
  UnsubscribeRoute,
  VerifyEmailRoute,
  BlogSlugRoute,
  FreelancersSlugRoute,
  BlogIndexRoute
};
const routeTree = Route$B._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AuthSplit as A,
  BLOG_POSTS as B,
  CATEGORIES as C,
  FREELANCER_CATEGORIES as F,
  IMG as I,
  Logo as L,
  MOCK_TEMPLATES as M,
  Route$d as R,
  STATUS_META as S,
  TEAM as T,
  usePreferences as a,
  COUNTRIES as b,
  cn as c,
  CHANGELOG as d,
  Route$c as e,
  LanceConnectLogo as f,
  usePipeline as g,
  MOCK_LEADS as h,
  MOCK_STATS as i,
  SettingsField as j,
  router as r,
  useAuth as u
};
