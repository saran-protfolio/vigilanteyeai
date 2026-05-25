import React, { useState, useEffect } from "react";
import type { ScanReport } from "./types";
import { Sun, Moon, Globe } from "lucide-react";
import { LanguageProvider, useTranslation } from "./context/LanguageContext";

// Page Components
import PublicHome from "./components/PublicHome";
import AIScanner from "./components/AIScanner";
import ScanHistory from "./components/ScanHistory";
import DeepfakeWizard from "./components/DeepfakeWizard";

// Initial realistic default scans to populate dashboard instantly
const INITIAL_SCANS: ScanReport[] = [
  {
    id: "scan-pr-11",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h ago
    type: "text",
    contentAnalyzed: "URGENT PAYMENT ALERT: Your account requires immediate security update at secure-billing-bankapp.com/login before 24h to avoid $100 penalty fee.",
    riskScore: 96,
    status: "DANGEROUS",
    threatCategory: "SMS Phishing Scam",
    confidence: 94,
    explanation: "High density of psychological stress indicators identified. Fake brand billing redirect URL impersonates traditional banking endpoints to harvest authorization tokens.",
    detectedFlags: ["Fake Brand Impersonation", "Urgency Manipulation", "Malicious Link Address"],
    safetyRecommendations: ["Do not visit URL links.", "Do not input credit cards or passphrases."],
  },
  {
    id: "scan-pr-12",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 24h ago
    type: "url",
    contentAnalyzed: "https://pages-amazon-claims-rewards.com/claim-coupon",
    riskScore: 88,
    status: "DANGEROUS",
    threatCategory: "Phishing Redirect Link",
    confidence: 91,
    explanation: "Brand name imitation URL impersonates retail merchant coupon portals with altered hyphen structure.",
    detectedFlags: ["Typosquatting Domain", "Prize Scam Trigger"],
    safetyRecommendations: ["Observe sender headers.", "Avoid credential synchronization."],
  }
];

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home"); // "home" | "scanner" | "history"
  const [scanHistory, setScanHistory] = useState<ScanReport[]>(INITIAL_SCANS);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { language, setLanguage, t } = useTranslation();

  // Keep local storage theme state in synchronization if desired
  useEffect(() => {
    const savedTheme = localStorage.getItem("scambuster-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("scambuster-theme", nextTheme);
  };

  const handleAddScanToHistory = (report: ScanReport) => {
    setScanHistory((prev) => [report, ...prev]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-28 md:pb-8 selection:bg-brand-accent selection:text-white ${theme === "light" ? "light bg-canvas text-primary-text" : "dark bg-canvas text-primary-text"}`}>
      <div className="bg-cyber-gradient min-h-screen w-full">
        
        {/* Top Application Header */}
        <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-secondary-text/10 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between font-sans gap-3">
            
            {/* Elegant Clean Typographic Header Brand */}
            <div 
              onClick={() => setCurrentPage("home")}
              className="cursor-pointer hover:opacity-90 transition flex-none select-none text-center md:text-left mx-auto md:mx-0"
            >
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-[#6366F1] to-[#818CF8] bg-clip-text text-transparent">
                  {t.logoName}
                </span>
              </div>
            </div>
 
            {/* Desktop Navigation Router Tabs */}
            <nav className="hidden md:flex items-center gap-2 bg-surface/50 border border-secondary-text/10 p-1 rounded-xl text-xs font-sans">
              <button 
                onClick={() => setCurrentPage("home")}
                className={`px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPage === "home" 
                    ? "bg-brand-accent text-white shadow-sm" 
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.navHome}
              </button>
              <button 
                onClick={() => setCurrentPage("scanner")}
                className={`px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPage === "scanner" 
                    ? "bg-brand-accent text-white shadow-md shadow-brand-accent/10" 
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.navScanEngine}
              </button>
              <button 
                onClick={() => setCurrentPage("history")}
                className={`px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPage === "history" 
                    ? "bg-brand-accent text-white shadow-sm" 
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.navThreatRecords} ({scanHistory.length})
              </button>
              <button 
                onClick={() => setCurrentPage("wizard")}
                className={`px-5 py-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPage === "wizard" 
                    ? "bg-brand-accent text-white shadow-sm" 
                    : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.navDeepfakeWizard}
              </button>
            </nav>
 
            {/* Quick Actions Panel: Theme + Language switcher + System Status */}
            <div className="flex items-center gap-2 font-sans shrink-0">
              
              {/* Premium Language Switcher (Desktop) */}
              <div className="hidden md:flex items-center gap-1 bg-surface border border-secondary-text/15 p-1 rounded-xl text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    language === "en" ? "bg-brand-accent text-white font-extrabold" : "text-secondary-text hover:text-primary-text"
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    language === "es" ? "bg-brand-accent text-white font-extrabold" : "text-secondary-text hover:text-primary-text"
                  }`}
                  title="Español"
                >
                  ES
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleTheme}
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl border border-secondary-text/20 bg-surface text-secondary-text hover:text-primary-text transition hover:scale-105 cursor-pointer shadow-sm"
                title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
              >
                {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-[#6366F1]" />}
              </button>
 
              <div className="hidden sm:flex items-center gap-2 border border-success-state/20 px-3 py-1 bg-success-state/5 rounded-full select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-success-state animate-pulse inline-block" />
                <span className="text-[10px] text-success-state font-bold font-mono tracking-wider uppercase">{t.activeBadge}</span>
              </div>
            </div>
 
          </div>
        </header>
 
        {/* Primary Body Canvas */}
        <main className="relative z-10 w-full animate-fade-in">
          {currentPage === "home" && (
            <PublicHome onNavigate={setCurrentPage} scanHistory={scanHistory} />
          )}
          {currentPage === "scanner" && (
            <AIScanner onAddScanToHistory={handleAddScanToHistory} />
          )}
          {currentPage === "history" && (
            <ScanHistory scanHistory={scanHistory} onNavigate={setCurrentPage} />
          )}
          {currentPage === "wizard" && (
            <DeepfakeWizard />
          )}
        </main>
 
        {/* Footer */}
        <footer className="relative z-10 border-t border-secondary-text/10 bg-surface/30 backdrop-blur-md py-8 px-6 mt-16 pb-24 md:pb-8 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-start select-none text-left">
              <span className="font-display font-black text-md tracking-tight text-[#6366F1] dark:text-[#818CF8]">
                {t.logoName}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-secondary-text font-bold">
                Active Threat Shield
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-5 text-xs text-secondary-text font-semibold">
              <button onClick={() => setCurrentPage("home")} className="hover:text-primary-text transition cursor-pointer">{t.navHome}</button>
              <button onClick={() => setCurrentPage("scanner")} className="hover:text-primary-text transition cursor-pointer">{t.navScanEngine}</button>
              <button onClick={() => setCurrentPage("history")} className="hover:text-primary-text transition cursor-pointer">{t.navThreatRecords}</button>
              <button onClick={() => setCurrentPage("wizard")} className="hover:text-primary-text transition cursor-pointer">{t.navDeepfakeWizard}</button>
            </div>
 
            <div className="text-center md:text-right space-y-1">
              <p className="text-[10px] font-mono text-secondary-text font-medium">
                &copy; {new Date().getFullYear()} {t.logoName}. {t.heroBadge}.
              </p>
              <p className="text-[9px] text-secondary-text/60">
                All checks query isolated server-side logic sandboxes privately.
              </p>
            </div>
          </div>
        </footer>
 
        {/* Mobile-First Floating Bottom Navigation Bar + Mobile Theme Toggle + Mobile Language Toggle */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-lg border border-secondary-text/20 p-1.5 rounded-2xl z-50 flex items-center justify-around shadow-lg font-sans">
          
          <button 
            onClick={() => setCurrentPage("home")}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              currentPage === "home" ? "bg-brand-accent text-white font-extrabold rounded-xl text-xs" : "text-secondary-text hover:text-primary-text text-xs"
            }`}
          >
            {t.navHome}
          </button>
 
          <button 
            onClick={() => setCurrentPage("scanner")}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              currentPage === "scanner" ? "bg-brand-accent text-white font-extrabold rounded-xl text-xs" : "text-secondary-text hover:text-primary-text text-xs"
            }`}
          >
            {t.navScanEngine}
          </button>
 
          <button 
            onClick={() => setCurrentPage("history")}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              currentPage === "history" ? "bg-brand-accent text-white font-extrabold rounded-xl text-xs" : "text-secondary-text hover:text-primary-text text-xs"
            }`}
          >
            {t.navThreatRecords}
          </button>

          <button 
            onClick={() => setCurrentPage("wizard")}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              currentPage === "wizard" ? "bg-brand-accent text-white font-extrabold rounded-xl text-xs" : "text-secondary-text hover:text-primary-text text-xs"
            }`}
          >
            {language === "es" ? "Voz" : "Voice"}
          </button>
 
          {/* Quick Language Toggle for Mobile Users */}
          <button
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="px-2 w-9 h-10 text-center text-secondary-text hover:text-primary-text text-xs font-mono font-bold cursor-pointer flex items-center justify-center border-l border-secondary-text/15"
            title="Switch Language"
          >
            <Globe size={13} className="mr-0.5" />
            {language.toUpperCase()}
          </button>

          {/* Quick theme action for mobile users */}
          <button
            onClick={handleToggleTheme}
            className="px-2 w-10 text-center text-secondary-text hover:text-primary-text text-xs font-mono cursor-pointer flex items-center justify-center border-l border-secondary-text/15"
            title="Toggle theme mode"
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-brand-accent" />}
          </button>
 
        </div>
 
      </div>
    </div>
  );
}


