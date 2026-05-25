import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Award,
  Zap,
  CheckCircle,
  X
} from "lucide-react";
import type { ScanReport } from "../types";
import { useTranslation } from "../context/LanguageContext";

interface ScanHistoryProps {
  scanHistory: ScanReport[];
  onNavigate: (page: string) => void;
}

export default function ScanHistory({ scanHistory, onNavigate }: ScanHistoryProps) {
  const { language, t } = useTranslation();
  const [selectedScan, setSelectedScan] = useState<ScanReport | null>(null);

  // Calculate stats
  const totalScans = scanHistory.length;
  const dangerousScans = scanHistory.filter((s) => s.status === "DANGEROUS").length;
  const warningScans = scanHistory.filter((s) => s.status === "WARNING").length;

  // Modern consumer safety index scoring
  const safetyScore = totalScans === 0 ? 100 : Math.max(25, Math.min(100, 100 - (dangerousScans * 15) - (warningScans * 8)));

  const getRiskBadgeStyles = (status: "SAFE" | "WARNING" | "DANGEROUS") => {
    if (status === "SAFE") {
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-500";
    }
    if (status === "WARNING") {
      return "bg-amber-500/10 border-amber-500/30 text-amber-500";
    }
    return "bg-rose-500/10 border-rose-500/30 text-rose-500";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 selection:bg-brand-accent selection:text-white">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-primary-text tracking-tight flex items-center gap-2">
            {language === "es" ? "Historial de Análisis de Seguridad" : "Security Scan History"}
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            {language === "es" 
              ? "Revise los escaneos de mensajes, enlaces y archivos cargados anteriormente que ha verificado con VigilantEye AI."
              : "Browse through previous message scans, links, and uploaded files you've verified with VigilantEye AI."}
          </p>
        </div>
        <button 
          onClick={() => onNavigate("scanner")}
          className="px-5 py-2.5 bg-brand-accent text-white font-extrabold rounded-xl text-xs hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
        >
          {language === "es" ? "Verificar Otro Mensaje o Enlace" : "Check Another Message or Link"}
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-sans">
        <div className="glass-card rounded-2xl p-5 text-left border border-secondary-text/10 bg-surface relative overflow-hidden">
          <p className="text-secondary-text text-[10px] uppercase font-bold tracking-wider">{language === "es" ? "Total de Análisis" : "Total Checks Made"}</p>
          <h3 className="text-3xl font-display font-extrabold text-primary-text mt-1">{totalScans}</h3>
          <p className="text-[10px] text-brand-accent mt-1 font-semibold">● {language === "es" ? "PROTEGIENDO SUS AHORROS" : "SECURING YOUR SAVINGS"}</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left border border-secondary-text/10 bg-surface relative overflow-hidden">
          <p className="text-secondary-text text-[10px] uppercase font-bold tracking-wider">{language === "es" ? "Estafas Detectadas" : "Scams Detected"}</p>
          <h3 className="text-3xl font-display font-extrabold text-rose-500 mt-1">{dangerousScans}</h3>
          <p className="text-[10px] text-rose-500 mt-1 font-semibold">{language === "es" ? "EVITE ESTE REMITENTE" : "AVOID THESE SENDER INFO"}</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left border border-secondary-text/10 bg-surface relative overflow-hidden">
          <p className="text-secondary-text text-[10px] uppercase font-bold tracking-wider">{language === "es" ? "Advertencias Sospechosas" : "Suspicious Warnings"}</p>
          <h3 className="text-3xl font-display font-extrabold text-amber-500 mt-1">{warningScans}</h3>
          <p className="text-[10px] text-amber-500 mt-1 font-semibold">{language === "es" ? "PRESTE EXTREMA PRECAUCIÓN" : "EXERCISE EXTRA CAUTION"}</p>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left border border-secondary-text/10 bg-surface relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
          <p className="text-secondary-text text-[10px] uppercase font-bold tracking-wider">{language === "es" ? "Puntuación de Guardia" : "Your Guard Rating"}</p>
          <h3 className={`text-3xl font-display font-extrabold mt-1 ${safetyScore > 80 ? "text-emerald-500" : safetyScore > 50 ? "text-amber-500" : "text-rose-500"}`}>{safetyScore}%</h3>
          <p className="text-[10px] text-emerald-500 mt-1 font-semibold">● {language === "es" ? "ESTADO DE GUARDIA ÓPTIMO" : "RATING OPTIMAL"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ledger List */}
        <div className="lg:col-span-8 text-left">
          <div className="glass-card rounded-2xl p-6 border border-secondary-text/10 bg-surface min-h-[350px]">
            <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-secondary-text/10 pb-3 font-display">
              {language === "es" ? "Registro Detallado del Historial" : "Detailed History Logs"}
              <span className="text-[10px] text-secondary-text bg-canvas/60 border border-secondary-text/10 px-2.5 py-0.5 rounded-full normal-case font-semibold ml-auto font-sans">
                {totalScans} {language === "es" ? "elementos en total" : "items total"}
              </span>
            </h2>

            {scanHistory.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[250px] font-sans">
                <h3 className="text-sm font-bold text-primary-text">{language === "es" ? "No se Encontraron Análisis Anteriores" : "No Previous Checks Found"}</h3>
                <p className="text-secondary-text text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                  {language === "es"
                    ? "Comience escaneando fragmentos de texto, enlaces web públicos o imágenes de captura de pantalla. Todos los resultados poblarán este registro."
                    : "Start scanning text snippets, public web links, or screenshot files. All results will populate this history log."}
                </p>
                <button 
                  onClick={() => onNavigate("scanner")}
                  className="mt-5 px-5 py-2.5 bg-brand-accent text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
                >
                  {language === "es" ? "Iniciar Primer Análisis" : "Start First Scan"}
                </button>
              </div>
            ) : (
              <div className="space-y-3 font-sans">
                {scanHistory.map((scan) => (
                  <div 
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className="p-4 rounded-xl bg-canvas/30 border border-secondary-text/10 hover:border-brand-accent/40 cursor-pointer hover:bg-canvas/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 border rounded uppercase ${getRiskBadgeStyles(scan.status)}`}>
                          {scan.status === "SAFE" ? t.riskSafe : scan.status === "WARNING" ? t.riskWarning : t.riskDangerous}
                        </span>
                        <span className="text-[10px] text-secondary-text uppercase font-mono font-semibold">
                          [{scan.type}]
                        </span>
                        <p className="text-primary-text text-xs font-bold leading-none">
                          {language === "es" && scan.threatCategory === "Subscription Renewal Brand Impersonation" 
                            ? "Suplantación de Renovación de Netflix" 
                            : (language === "es" && scan.threatCategory === "SMS Phishing Scam" ? "Estafa Phishing de SMS" : (language === "es" && scan.threatCategory === "Phishing Redirect Link" ? "Enlace de Redirección Phishing" : scan.threatCategory))}
                        </p>
                      </div>
                      
                      <p className="text-[11px] text-secondary-text mt-1.5 line-clamp-1 max-w-sm sm:max-w-md md:max-w-lg font-mono">
                        {scan.contentAnalyzed}
                      </p>
                    </div>

                    <div className="w-full sm:w-auto flex sm:flex-col items-end justify-between sm:justify-start border-t border-secondary-text/10 sm:border-0 pt-2.5 sm:pt-0">
                      <span className="text-[10px] font-bold text-primary-text uppercase sm:text-right">
                        {language === "es" ? "RIESGO" : "RISK"}: <span className={scan.status === "SAFE" ? "text-emerald-500" : scan.status === "WARNING" ? "text-amber-500" : "text-rose-500"}>{scan.riskScore}%</span>
                      </span>
                      <span className="text-[10px] text-secondary-text sm:text-right mt-1 font-medium">
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Informative Side Bar */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          <div className="glass-card rounded-2xl p-6 border border-secondary-text/10 bg-surface">
            <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider mb-3 font-display">
              {language === "es" ? "Comprender los Niveles de Riesgo" : "Understanding Risk Levels"}
            </h3>
            <p className="text-xs text-secondary-text leading-relaxed mb-4 font-medium font-sans">
              {language === "es"
                ? "Nuestra clasificación de seguridad le ayuda a manejar correos, mensajes y llamadas correctamente:"
                : "Our safety classification helps you handle emails, messages, and calls correctly:"}
            </p>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                <span className="text-rose-500 font-bold text-[10px] uppercase block">
                  {language === "es" ? "INFORME PELIGROSO" : "DANGEROUS REPORT"}
                </span>
                <p className="text-[11px] text-secondary-text leading-normal font-medium">
                  {language === "es"
                    ? "Alta probabilidad de estafa. Evite interactuar, no envíe fondos, OTPs, ni inicie sesión."
                    : "High density of scam indicators. Avoid interaction, do not send money, OTPs, or log in."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                <span className="text-amber-500 font-bold text-[10px] uppercase block">
                  {language === "es" ? "ADVERTENCIA DE SOSPECHA" : "SUSPICIOUS WARNING"}
                </span>
                <p className="text-[11px] text-secondary-text leading-normal font-medium">
                  {language === "es"
                    ? "Redirecciones dudosas o tácticas de urgencia detectadas. Verifique al remitente de inmediato."
                    : "Suspicious redirect or pressure tricks found. Verify the sender immediately."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                <span className="text-emerald-500 font-bold text-[10px] uppercase block">
                  {language === "es" ? "COMPLETAMENTE SEGURO" : "SAFE VERIFIED"}
                </span>
                <p className="text-[11px] text-secondary-text leading-normal font-medium">
                  {language === "es"
                    ? "Muy baja probabilidad de engaño digital. No obstante, revise siempre opciones financieras."
                    : "Very low probability of phishing. However, always double check requests for financial actions."}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-secondary-text/10 bg-surface space-y-3">
            <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider font-display">
              {language === "es" ? "100% Seguro y Privado" : "100% Secure & Private"}
            </h3>
            <p className="text-xs text-secondary-text leading-relaxed font-medium font-sans">
              {language === "es"
                ? "Todos los escaneos se ejecutan de manera segura. Al no haber bases de datos en la nube de terceros asociadas, sus registros residen localmente en su propio navegador."
                : "All scanning is safely run inside a private server-side environment. Since there corresponds no active databases linked, all statistics reside locally on your browser."}
            </p>
          </div>
        </div>

      </div>

      {/* User Friendly Scan Detail Full-Screen Drawer Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer transition-opacity duration-300" 
            onClick={() => setSelectedScan(null)} 
          />
          
          {/* Detail Dialog Card */}
          <div className="bg-surface border border-secondary-text/20 rounded-2xl w-full max-w-2xl p-6 text-left relative z-10 shadow-2xl max-h-[85vh] overflow-y-auto font-sans">
            {/* Modal Exit */}
            <button 
              type="button"
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-canvas border border-secondary-text/10 text-secondary-text hover:text-primary-text transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Identity */}
            <div className="flex items-center gap-3.5 mb-6 border-b border-secondary-text/10 pb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedScan.status === "SAFE" ? "bg-emerald-500/10 text-emerald-500" :
                selectedScan.status === "WARNING" ? "bg-amber-500/10 text-amber-500" :
                "bg-rose-500/10 text-rose-500"
              }`}>
                {selectedScan.status === "SAFE" ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">
                  {language === "es" ? "Evaluación de Seguridad de Inteligencia" : "Safety Diagnostic Assessment"}
                </span>
                <h3 className="text-lg font-bold text-primary-text tracking-tight leading-tight mt-0.5 font-display">
                  {language === "es" && selectedScan.threatCategory === "Subscription Renewal Brand Impersonation" 
                    ? "Suplantación de Renovación de Netflix" 
                    : (language === "es" && selectedScan.threatCategory === "SMS Phishing Scam" ? "Estafa Phishing de SMS" : (language === "es" && selectedScan.threatCategory === "Phishing Redirect Link" ? "Enlace de Redirección Phishing" : selectedScan.threatCategory))}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Score Meter */}
              <div className="p-4 rounded-xl bg-canvas border border-secondary-text/10">
                <span className="text-[10px] text-secondary-text uppercase block font-bold">{language === "es" ? "Nivel de riesgo de la amenaza" : "Threat Risk Level"}</span>
                <div className="flex items-baseline gap-2 mt-2 font-mono">
                  <span className={`text-3xl font-extrabold ${
                    selectedScan.status === "SAFE" ? "text-emerald-500" :
                    selectedScan.status === "WARNING" ? "text-amber-500" : "text-rose-500"
                  }`}>
                    {selectedScan.riskScore}%
                  </span>
                  <span className="text-xs text-secondary-text font-semibold">{language === "es" ? "NIVEL RIESGO" : "RISK RANGE"}</span>
                </div>
                {/* Visual bar */}
                <div className="w-full bg-surface h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full rounded-full ${
                    selectedScan.status === "SAFE" ? "bg-emerald-500" :
                    selectedScan.status === "WARNING" ? "bg-amber-500" : "bg-rose-500"
                  }`} style={{ width: `${selectedScan.riskScore}%` }} />
                </div>
              </div>

              {/* Confidence Indices */}
              <div className="p-4 rounded-xl bg-canvas border border-secondary-text/10 text-xs text-secondary-text space-y-2">
                <div>
                  <span className="text-[9px] text-secondary-text uppercase block font-bold">{t.confidenceMeasure}</span>
                  <span className="text-xs text-primary-text mt-0.5 block font-bold">{selectedScan.confidence}% {language === "es" ? "Tasa de coincidencia" : "Match Rate"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-secondary-text uppercase block font-bold font-sans">{language === "es" ? "Analizado el" : "Analyzed On"}</span>
                  <span className="text-xs text-primary-text mt-0.5 block font-semibold">{new Date(selectedScan.timestamp).toLocaleString(language === "es" ? "es" : "en")}</span>
                </div>
              </div>
            </div>

            {/* Analyzed Code/Content Box */}
            <div className="space-y-2 mb-6 text-xs text-left">
              <span className="text-[10px] text-secondary-text uppercase block font-bold">{language === "es" ? "Contenido analizado" : "Target Analyzed Content"}</span>
              <div className="p-4 rounded-xl bg-canvas border border-secondary-text/10 text-primary-text break-all font-mono leading-relaxed text-[11px] max-h-[140px] overflow-y-auto">
                {selectedScan.contentAnalyzed}
              </div>
            </div>

            {/* Technical Explanation analysis */}
            <div className="space-y-2 mb-6 text-xs text-left">
              <span className="text-[10px] text-secondary-text uppercase block font-bold">{language === "es" ? "¿Por qué es sospechoso?" : "Why is this suspicious?"}</span>
              <p className="text-primary-text leading-relaxed text-[11.5px] font-medium font-sans bg-canvas/60 p-3.5 rounded-xl border border-secondary-text/5">
                {selectedScan.explanation}
              </p>
            </div>

            {/* Highlighted Critical Flags if present */}
            {selectedScan.detectedFlags && selectedScan.detectedFlags.length > 0 && (
              <div className="space-y-2.5 mb-6 text-xs text-left">
                <span className="text-[10px] text-rose-500 uppercase block font-bold font-sans">
                  {language === "es" ? "Indicadores Específicos Encontrados" : "Specific Scam Indicators Found"}
                </span>
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {selectedScan.detectedFlags.map((flag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold"
                    >
                      ● {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations checklist */}
            <div className="p-4 rounded-xl bg-brand-accent/5 border border-brand-accent/20 text-xs text-left">
              <span className="text-brand-accent font-bold text-[10px] uppercase block mb-2 tracking-wide font-sans">
                {language === "es" ? "Instrucciones de seguridad inmediatas" : "Immediate Safety Instructions"}
              </span>
              <ul className="space-y-2 text-primary-text text-[11px] font-medium pl-1 font-sans">
                {selectedScan.safetyRecommendations && selectedScan.safetyRecommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed font-semibold">
                    <span className="text-brand-accent font-bold">[{i+1}]</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
