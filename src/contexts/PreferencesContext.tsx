import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr" | "it" | "es" | "pt";
export type Currency = "USD" | "EUR" | "GBP" | "NGN" | "BRL";

interface PreferencesContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  t: (key: string) => string;
  formatPrice: (usdAmount: number) => string;
  getCurrencySymbol: () => string;
  safetyPopupDismissed: boolean;
  setSafetyPopupDismissed: (dismissed: boolean) => void;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_how: "How it works",
    nav_services: "Services",
    nav_pricing: "Pricing",
    nav_blog: "Blog",
    nav_portfolio: "Portfolio",
    nav_directory: "Freelancers",
    nav_contact: "Contact",
    nav_login: "Login",
    nav_start_free: "Start Free →",
    // Hero
    hero_eyebrow: "// find.clients.globally",
    hero_title: "The Meeting Point for Freelancers and Clients.",
    hero_sub:
      "Stop waiting for work to come to you. LanceConnect finds businesses that need your skills anywhere in the world and hands you their direct contacts.",
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
    sandbox_sub:
      "Select your skill and a city to run a mock scan. Experience how our AI engine evaluates businesses and drafts outreach templates in seconds.",
    sandbox_step_1: "1. Select Your Craft",
    sandbox_step_2: "2. Target Location",
    sandbox_run: "Run Scanner Simulator",
    sandbox_running: "Scanning target directory...",
    sandbox_ready_title: "Scanner ready",
    sandbox_ready_desc:
      "Choose your skill type and target market on the left, then trigger a simulated scan to view opportunity metrics.",
  },
  fr: {
    nav_home: "Accueil",
    nav_about: "À propos",
    nav_how: "Comment ça marche",
    nav_services: "Services",
    nav_pricing: "Tarifs",
    nav_blog: "Blog",
    nav_portfolio: "Portfolio",
    nav_directory: "Freelances",
    nav_contact: "Contact",
    nav_login: "Connexion",
    nav_start_free: "Commencer Gratuitement →",
    // Hero
    hero_eyebrow: "// trouver.des.clients.partout",
    hero_title: "Le Point de Rencontre des Freelances et des Clients.",
    hero_sub:
      "Arrêtez d'attendre que le travail vienne à vous. LanceConnect trouve des entreprises qui ont besoin de vos compétences partout dans le monde et vous donne leurs contacts directs.",
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
    sandbox_sub:
      "Sélectionnez votre domaine et une ville pour lancer une simulation de scan. Découvrez comment notre moteur IA évalue les opportunités et rédige des messages en quelques secondes.",
    sandbox_step_1: "1. Sélectionnez votre domaine",
    sandbox_step_2: "2. Emplacement cible",
    sandbox_run: "Lancer le simulateur de scan",
    sandbox_running: "Scan de l'annuaire cible...",
    sandbox_ready_title: "Scanneur prêt",
    sandbox_ready_desc:
      "Choisissez votre compétence et votre marché cible à gauche, puis lancez une simulation de scan pour voir les opportunités.",
  },
  it: {
    nav_home: "Home",
    nav_about: "Chi Siamo",
    nav_how: "Come funziona",
    nav_services: "Servizi",
    nav_pricing: "Prezzi",
    nav_blog: "Blog",
    nav_portfolio: "Portfolio",
    nav_directory: "Freelance",
    nav_contact: "Contatti",
    nav_login: "Accedi",
    nav_start_free: "Inizia Gratis →",
    // Hero
    hero_eyebrow: "// trova.clienti.globalmente",
    hero_title: "Il Punto di Incontro per Freelance e Clienti.",
    hero_sub:
      "Smetti di aspettare che il lavoro arrivi da te. LanceConnect trova aziende che hanno bisogno delle tue competenze in tutto il mondo e ti fornisce i loro contatti diretti.",
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
    sandbox_sub:
      "Seleziona la tua specializzazione e una città per eseguire un finto scan. Scopri come il nostro motore AI valuta le aziende e redige modelli in pochi secondi.",
    sandbox_step_1: "1. Seleziona la tua abilità",
    sandbox_step_2: "2. Posizione target",
    sandbox_run: "Esegui simulatore scanner",
    sandbox_running: "Scansione della cartella target...",
    sandbox_ready_title: "Scanner pronto",
    sandbox_ready_desc:
      "Scegli la tua abilità e il mercato a sinistra, quindi avvia la simulazione per vedere le metriche delle opportunità.",
  },
  es: {
    nav_home: "Inicio",
    nav_about: "Sobre Nosotros",
    nav_how: "Cómo funciona",
    nav_services: "Servicios",
    nav_pricing: "Precios",
    nav_blog: "Blog",
    nav_portfolio: "Portafolio",
    nav_directory: "Freelancers",
    nav_contact: "Contacto",
    nav_login: "Iniciar Sesión",
    nav_start_free: "Comenzar Gratis →",
    // Hero
    hero_eyebrow: "// encontrar.clientes.globalmente",
    hero_title: "El Punto de Encuentro para Freelancers y Clientes.",
    hero_sub:
      "Deja de esperar a que el trabajo llegue a ti. LanceConnect encuentra empresas que necesitan tus habilidades en cualquier parte del mundo y te entrega sus contactos directos.",
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
    sandbox_sub:
      "Selecciona tu habilidad y una ciudad para simular un escaneo. Mira cómo nuestro motor de IA evalúa los negocios y redacta mensajes en segundos.",
    sandbox_step_1: "1. Selecciona tu habilidad",
    sandbox_step_2: "2. Ubicación objetivo",
    sandbox_run: "Ejecutar simulador de escáner",
    sandbox_running: "Escaneando el directorio objetivo...",
    sandbox_ready_title: "Escáner listo",
    sandbox_ready_desc:
      "Elige tu habilidad y el mercado objetivo en la izquierda, luego inicia una simulación de escaneo.",
  },
  pt: {
    nav_home: "Início",
    nav_about: "Sobre nós",
    nav_how: "Como funciona",
    nav_services: "Serviços",
    nav_pricing: "Preços",
    nav_blog: "Blog",
    nav_portfolio: "Portfólio",
    nav_directory: "Freelancers",
    nav_contact: "Contato",
    nav_login: "Entrar",
    nav_start_free: "Começar Grátis →",
    // Hero
    hero_eyebrow: "// encontrar.clientes.globalmente",
    hero_title: "O Ponto de Encontro para Freelancers e Clientes.",
    hero_sub:
      "Pare de esperar que o trabalho venha até você. O LanceConnect encontra empresas que precisam das suas habilidades em qualquer lugar do mundo e te entrega os contatos diretos.",
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
    sandbox_sub:
      "Selecione sua habilidade e uma cidade para executar um escaneamento simulado. Veja como nosso motor de IA analisa empresas e cria mensagens em segundos.",
    sandbox_step_1: "1. Escolha sua habilidade",
    sandbox_step_2: "2. Localização alvo",
    sandbox_run: "Executar simulador de scanner",
    sandbox_running: "Escaneando o diretório alvo...",
    sandbox_ready_title: "Scanner pronto",
    sandbox_ready_desc:
      "Escolha sua especialidade e mercado à esquerda, depois ative o simulador para ver as métricas.",
  },
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [safetyPopupDismissed, setSafetyPopupDismissedState] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem("lc_safety_popup_dismissed") === "true";
    setSafetyPopupDismissedState(dismissed);
    const savedLang = localStorage.getItem("lanceconnect_lang") as Language;
    const savedCurr = localStorage.getItem("lanceconnect_curr") as Currency;
    const savedTheme = localStorage.getItem("lanceconnect_theme") as "dark" | "light";
    if (savedLang && ["en", "fr", "it", "es", "pt"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    if (savedCurr && ["USD", "EUR", "GBP", "NGN", "BRL"].includes(savedCurr)) {
      setCurrencyState(savedCurr);
    }
    if (savedTheme && ["dark", "light"].includes(savedTheme)) {
      setThemeState(savedTheme);
      const root = document.documentElement;
      if (savedTheme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lanceconnect_lang", lang);
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    if (typeof window !== "undefined") {
      localStorage.setItem("lanceconnect_curr", curr);
    }
  };

  const setTheme = (t: "dark" | "light") => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("lanceconnect_theme", t);
      const root = document.documentElement;
      if (root) {
        if (t === "light") {
          root.classList.add("light");
          root.classList.remove("dark");
        } else {
          root.classList.add("dark");
          root.classList.remove("light");
        }
      }
    }
  };

  const setSafetyPopupDismissed = (val: boolean) => {
    setSafetyPopupDismissedState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("lc_safety_popup_dismissed", val ? "true" : "false");
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  const formatPrice = (usdAmount: number): string => {
    if (usdAmount === 0) return "0";

    switch (currency) {
      case "EUR":
        return Math.round(usdAmount * 0.9).toString();
      case "GBP":
        return Math.round(usdAmount * 0.8).toString();
      case "NGN":
        if (usdAmount === 7) return "10,000";
        if (usdAmount === 6) return "8,000";
        if (usdAmount === 20) return "30,000";
        if (usdAmount === 16) return "24,000";
        return (usdAmount * 1500).toLocaleString();
      case "BRL":
        return (usdAmount * 5).toLocaleString();
      case "USD":
      default:
        return usdAmount.toString();
    }
  };

  const getCurrencySymbol = (): string => {
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

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        setTheme,
        t,
        formatPrice,
        getCurrencySymbol,
        safetyPopupDismissed,
        setSafetyPopupDismissed,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
