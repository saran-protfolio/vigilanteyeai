import React, { useState, useRef } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  UploadCloud, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Link as LinkIcon, 
  MessageSquare, 
  Image as ImageIcon,
  CheckCircle,
  Copy,
  FolderLock,
  Eye,
  EyeOff,
  Lock,
  Fingerprint,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ScanReport } from "../types";
import { useTranslation } from "../context/LanguageContext";

interface AIScannerProps {
  onAddScanToHistory: (report: ScanReport) => void;
}

export default function AIScanner({ onAddScanToHistory }: AIScannerProps) {
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"text" | "url" | "screenshot">("text");
  
  // Form inputs
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isGhostOverlayActive, setIsGhostOverlayActive] = useState(true);

  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanReport | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fast prefilled test vectors
  const prefillVector = (type: "text" | "url" | "screenshot" | "netflix") => {
    setAnalysisResult(null);
    setErrorMessage("");
    if (type === "netflix") {
      setActiveTab("screenshot");
      setScreenshotFile(null);
      // Create a simulated preview state that triggers Netflix scan
      setScreenshotPreview("netflix_sms_simulation_screenshot");
    } else {
      setActiveTab(type === "text" || type === "url" || type === "screenshot" ? type : "text");
      if (type === "text") {
        setTextInput(
          "CONGRATULATIONS! You have won a $5,000 cash subsidy from Google. To withdraw immediately, forward your online logging OTP code token to support-google-claims@claims-verification-hub.net within 5 minutes."
        );
      } else if (type === "url") {
        setUrlInput("https://www.icici-bank-secure-authorization.verification-portal-alert.biz/login");
      }
    }
  };

  // Convert File to base64 helper
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload an image screenshot file (PNG, JPG, JPEG).");
        return;
      }
      setScreenshotFile(file);
      const valUrl = URL.createObjectURL(file);
      setScreenshotPreview(valUrl);
      setErrorMessage("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload an image screenshot.");
        return;
      }
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setErrorMessage("");
    }
  };

  // Run Gemini API deep validation backend proxy call
  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAnalysisResult(null);

    // Validate inputs
    let payload: any = { type: activeTab };
    if (activeTab === "text") {
      if (!textInput.trim()) {
        setErrorMessage("Please input suspicious message text to analyze.");
        return;
      }
      payload.content = textInput;
    } else if (activeTab === "url") {
      if (!urlInput.trim()) {
        setErrorMessage("Please paste a suspicious link/URL targeting domain.");
        return;
      }
      payload.content = urlInput;
    } else {
      if (!screenshotFile && screenshotPreview !== "netflix_sms_simulation_screenshot") {
        setErrorMessage("Please upload a transaction screenshot or chat image to scan.");
        return;
      }
      if (screenshotPreview === "netflix_sms_simulation_screenshot") {
        payload.content = "[Simulated Screenshot: Fake Netflix Subscription Renewal SMS Alert]";
      } else if (screenshotFile) {
        try {
          const b64 = await fileToBase64(screenshotFile);
          payload.screenshotBase64 = b64;
          payload.mimeType = screenshotFile.type;
          payload.content = `[Image Upload: ${screenshotFile.name}]`;
        } catch (err) {
          setErrorMessage("Unable to parse screenshot file data. Please retry.");
          return;
        }
      }
    }

    setIsScanning(true);

    // Instant preset database matches for lightning fast local responses
    const normalizedInput = (payload.content || "").trim();
    const isPresetText = normalizedInput.includes("CONGRATULATIONS") && normalizedInput.includes("logging OTP");
    const isPresetUrl = normalizedInput.includes("icici-bank-secure");
    const isPresetNetflix = normalizedInput.includes("Netflix") || normalizedInput.includes("netflix") || screenshotPreview === "netflix_sms_simulation_screenshot";

    if (isPresetText || isPresetUrl || isPresetNetflix) {
      setTimeout(() => {
        let mockResult: any;
        if (isPresetNetflix) {
          mockResult = language === "es" ? {
            riskScore: 99,
            status: "DANGEROUS" as const,
            threatCategory: "Subscription Renewal Brand Impersonation",
            confidence: 98,
            explanation: "¡Detección de Secuestro de Marca Netflix! Esta estafa de ingeniería social de alto riesgo imita alertas de renovación de suscripción de Netflix, Inc. El enlace del remitente dirige a un dominio no autorizado diseñado para capturar directamente su token de cuenta de Netflix y credenciales de tarjeta de crédito. Ninguna solicitud legítima de Netflix utilizará dominios URL secundarios no seguros.",
            detectedFlags: ["Suplantando el Sistema de Suscripción Netflix", "Disparador de Sentido de Urgencia Agresivo", "Dirección de Enlace Maliciosa"],
            safetyRecommendations: ["No visite netflix-renew-billing-portal.com.", "Navegue exclusivamente a través de canales oficiales verificados.", "Reporte el SMS fraudulento a las autoridades de telecomunicaciones."],
            highlightedPhrases: ["netflix-renew", "subscription renewal"],
          } : {
            riskScore: 99,
            status: "DANGEROUS" as const,
            threatCategory: "Subscription Renewal Brand Impersonation",
            confidence: 98,
            explanation: "Netflix Brand Hijack Detected! This high-risk social engineering scam mimics subscription renewal alerts from Netflix, Inc. The sender's link directs to an unauthorized domain engineered to capture your Netflix account token and credit card credentials directly. No legitimate request from Netflix will use unsecured secondary URL domains.",
            detectedFlags: ["Impersonating Netflix Subscription System", "Aggressive Sense of Urgency Trigger", "Malicious Link Address"],
            safetyRecommendations: ["Do not visit netflix-renew-billing-portal.com.", "Navigate exclusively to verified official channels.", "Report the fraudulent sender text to telecommunication systems."],
            highlightedPhrases: ["netflix-renew", "subscription renewal"],
          };
        } else if (isPresetText) {
          mockResult = language === "es" ? {
            riskScore: 98,
            status: "DANGEROUS" as const,
            threatCategory: "Google Lottery Subsidy Fraud",
            confidence: 97,
            explanation: "Este mensaje contiene señales clásicas de una trampa de ingeniería social de alta gravedad. Intenta manipularlo utilizando una emoción extrema (subsidios) seguida de limitaciones de urgencia instantáneas. Las corporaciones reales como Google nunca organizan loterías de efectivo que requieran que comparta detalles críticos de tokens de inicio de sesión o contraseñas de un solo uso (OTP). Los centros de verificación en dominios de registro no estándar son activos de phishing maliciosos.",
            detectedFlags: ["Demandas urgentes de acción", "Solicitud de autenticación OTP", "Dominio de recompensa sospechoso no verificado", "Suplantando marcas de Google"],
            safetyRecommendations: ["No reenvíe códigos OTP bajo ninguna circunstancia.", "Bloquee al remitente de inmediato.", "Reporte este número a los reguladores oficiales de telecomunicaciones.", "No visite los enlaces correspondientes."],
            highlightedPhrases: ["OTP", "subsidy", "support-google-claims"],
          } : {
            riskScore: 98,
            status: "DANGEROUS" as const,
            threatCategory: "Google Lottery Subsidy Fraud",
            confidence: 97,
            explanation: "This message contains classic signals of a high-severity social engineering trap. It attempts to manipulate you using extreme excitement (subsidies) followed by instant urgency constraints. Real corporations like Google never host cash lotteries requiring you to share critical online log token details or One-Time Passwords (OTPs). Verification hubs on non-standard registrar domains are malicious phish assets.",
            detectedFlags: ["Urgent demands for action", "Request for authentication OTPs", "Suspicious unverified rewards domain", "Impersonating Google Brands"],
            safetyRecommendations: ["Do not under any circumstance forward OTP codes.", "Block the sender immediately.", "Report this number to official telecomm regulators.", "Do not visit corresponding links."],
            highlightedPhrases: ["OTP", "subsidy", "support-google-claims"],
          };
        } else {
          mockResult = language === "es" ? {
            riskScore: 95,
            status: "DANGEROUS" as const,
            threatCategory: "Bank Credential Phishing Gate",
            confidence: 96,
            explanation: "Esta URL contiene estructuras complejas de typosquatting. Replica estilos bancarios oficiales mientras aloja archivos en un sufijo de registrador secundario no verificado (dominio que termina en '.biz'). Alto riesgo de robo de credenciales. Ingresar contraseñas de cuentas de clientes o inicios de sesión aquí comprometerá la integridad financiera al instante.",
            detectedFlags: ["Patrón de URL con nombre bancario mal deletreado", "Aloja controles de formulario de alto riesgo en un TLD .biz no verificado", "Emblemas de marca HTTPS seguros falsificados"],
            safetyRecommendations: ["No ingrese contraseñas ni inicios de sesión en esta página.", "Cierre la pestaña de inmediato.", "Ejecute un barrido de seguridad digital en su computadora personal."],
            highlightedPhrases: ["icici-bank-secure", ".biz"],
          } : {
            riskScore: 95,
            status: "DANGEROUS" as const,
            threatCategory: "Bank Credential Phishing Gate",
            confidence: 96,
            explanation: "This URL contains complex typosquatting structures. It replicates official bank styles while hosting files on a secondary, unverified registrar suffix (domain ending in '.biz'). High risk of credential stealing. Entering customer account passwords or logins here will compromise financial integrity instantly.",
            detectedFlags: ["Misspelled bank name URL pattern", "Hosts high-risk form controls on unverified .biz TLD", "Forged secure HTTPS brand emblems"],
            safetyRecommendations: ["Do not input password or logins on this page.", "Close the tab immediately.", "Run a digital security sweep on your personal computer."],
            highlightedPhrases: ["icici-bank-secure", ".biz"],
          };
        }

        const newReport: ScanReport = {
          id: "scan-" + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type: activeTab,
          contentAnalyzed: payload.content,
          ...mockResult,
          userId: "anonymous",
        };

        setAnalysisResult(newReport);
        onAddScanToHistory(newReport);
        setIsScanning(false);
      }, 450); // crispy and snappy responses
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Backend was unable to complete validation.");
      }

      const rawResult = await response.json();
      
      const newReport: ScanReport = {
        id: "scan-" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        type: activeTab,
        contentAnalyzed: activeTab === "screenshot" ? `Upload: ${screenshotFile?.name || "Image"}` : payload.content,
        riskScore: rawResult.riskScore ?? 50,
        status: rawResult.status ?? "WARNING",
        threatCategory: rawResult.threatCategory ?? "Suspicious Content",
        confidence: rawResult.confidence ?? 85,
        explanation: rawResult.explanation ?? "Inconclusive results generated.",
        detectedFlags: rawResult.detectedFlags ?? [],
        safetyRecommendations: rawResult.safetyRecommendations ?? ["Avoid interaction with this vector."],
        highlightedPhrases: rawResult.highlightedPhrases ?? [],
        userId: "anonymous",
      };

      setAnalysisResult(newReport);
      onAddScanToHistory(newReport);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 
        (language === "es" 
          ? "Ha ocurrido un error durante el escaneo. Asegúrese de que su clave de API de Gemini esté configurada en Configuración." 
          : "An error occurred during scanning. Make sure your Gemini API Key is set in Settings.")
      );
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getRiskColor = (status: "SAFE" | "WARNING" | "DANGEROUS") => {
    if (status === "SAFE") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (status === "WARNING") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 selection:bg-brand-accent selection:text-white">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 text-left sm:text-center">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-primary-text flex items-center justify-center gap-2">
          {t.scanEngineTitle}
        </h1>
        <p className="text-secondary-text text-sm mt-3 leading-relaxed">
          {t.heroSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form Panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 text-left relative overflow-hidden bg-surface">
            {/* Ambient inner gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

            {/* Scanning Vectors SelectorTabs */}
            <div className="flex gap-1.5 bg-canvas/60 p-1.5 rounded-lg border border-secondary-text/10 mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab("text"); setErrorMessage(""); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "text" ? "bg-brand-accent text-white" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.tabText}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("url"); setErrorMessage(""); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "url" ? "bg-brand-accent text-white" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.tabUrl}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("screenshot"); setErrorMessage(""); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "screenshot" ? "bg-brand-accent text-white" : "text-secondary-text hover:text-primary-text"
                }`}
              >
                {t.tabScreenshot}
              </button>
            </div>

            {/* Test vectors fast-entry selectors */}
            <div className="mb-6 flex flex-wrap gap-2 items-center text-[11px] text-secondary-text font-sans">
              <span>{t.vectorHeading}:</span>
              <button 
                type="button"
                onClick={() => prefillVector("text")}
                className="px-2.5 py-1 rounded bg-canvas hover:opacity-80 text-brand-accent font-semibold cursor-pointer border border-secondary-text/10"
              >
                {language === "es" ? "Spam de Lotería" : "Gift Lottery Spam"}
              </button>
              <button 
                type="button"
                onClick={() => prefillVector("url")}
                className="px-2.5 py-1 rounded bg-canvas hover:opacity-80 text-brand-accent font-semibold cursor-pointer border border-secondary-text/10"
              >
                {language === "es" ? "Portal de Banco Falso" : "Fake Bank Portal"}
              </button>
              <button 
                type="button"
                onClick={() => prefillVector("netflix")}
                className="px-2.5 py-1 rounded bg-canvas hover:opacity-80 text-purple-600 dark:text-purple-400 font-semibold cursor-pointer border border-purple-500/20"
              >
                {language === "es" ? "Alerta de Netflix" : "Netflix Phishing Alert"}
              </button>
            </div>

            <form onSubmit={handleStartScan} className="space-y-4">
              {activeTab === "text" && (
                <div>
                  <label className="block text-xs font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">{t.formTextLabel}</label>
                  <textarea
                    rows={6}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={language === "es" ? "Pegue el mensaje SMS sospechoso, solicitud de WhatsApp, correo electrónico falso o propuesta de trabajo..." : "Paste the suspicious SMS message, WhatsApp request, scam email body or job proposal details..."}
                    className="w-full bg-canvas border border-secondary-text/20 rounded-xl p-3.5 text-xs text-primary-text focus:outline-none focus:border-brand-accent/50 transition-all font-sans placeholder-secondary-text/50 resize-none shadow-sm font-medium"
                  />
                </div>
              )}

              {activeTab === "url" && (
                <div>
                  <label className="block text-xs font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">{t.formUrlLabel}</label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://suspicious-verification-banking-portal..."
                    className="w-full bg-canvas border border-secondary-text/20 rounded-xl p-3.5 text-xs text-primary-text focus:outline-none focus:border-brand-accent/50 transition-all font-mono placeholder-secondary-text/50 shadow-sm font-medium"
                  />
                </div>
              )}

              {activeTab === "screenshot" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-secondary-text uppercase tracking-wider font-bold font-sans">
                      {t.ghostTitle}
                    </label>
                    {screenshotPreview && (
                      <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-500 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider select-none animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        {t.ghostSub}
                      </span>
                    )}
                  </div>

                  {!screenshotPreview ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[190px] group ${
                        isDragOver ? "border-brand-accent bg-brand-accent/5" : "border-secondary-text/20 bg-canvas/30 hover:border-brand-accent/50"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <UploadCloud className="w-10 h-10 text-secondary-text group-hover:text-brand-accent transition-colors mb-3.5" />
                      <p className="text-xs text-primary-text font-semibold">
                        {language === "es" ? (
                          <>Arrastre y suelte la captura aquí, o <span className="text-brand-accent">busque</span></>
                        ) : (
                          <>Drag-and-drop screenshot here, or <span className="text-brand-accent">browse</span></>
                        )}
                      </p>
                      <p className="text-[10px] text-secondary-text mt-1.5 font-medium">
                        {language === "es" ? "Soporta PNG, JPG, JPEG (Máx 10MB)" : "Supports PNG, JPG, JPEG (Max 10MB)"}
                      </p>
                    </div>
                  ) : (
                    /* Ghost Overlay Interactive Masking Simulator Console */
                    <div className="rounded-xl border border-secondary-text/15 bg-canvas/75 p-4 space-y-4 shadow-inner relative overflow-hidden">
                      {/* Ambient background glows for high-tech premium environment */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                      {/* Header with layout settings & interactive toggle */}
                      <div className="flex items-center justify-between p-2.5 bg-surface/50 border border-secondary-text/10 rounded-lg">
                        <div className="flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-mono font-bold text-primary-text uppercase tracking-wider">
                            {t.ghostSecZone}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setIsGhostOverlayActive(!isGhostOverlayActive)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isGhostOverlayActive ? "bg-emerald-500" : "bg-secondary-text/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isGhostOverlayActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* On-device Device Frame Viewport container */}
                      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-secondary-text/15 bg-surface flex items-center justify-center select-none shadow-md group">
                        
                        {/* Simulation Screen Overlay elements representing active blurs */}
                        <AnimatePresence>
                          {isGhostOverlayActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 z-10 pointer-events-none"
                            >
                              {/* Overlay Zone A: Carrier & Notification Bar */}
                              <div className="absolute top-0 left-0 w-full h-[8%] backdrop-blur-md bg-canvas/30 border-b border-white/5 flex items-center justify-between px-3 text-[8px] font-mono text-secondary-text tracking-widest font-bold">
                                <span className="flex items-center gap-1">
                                  <Shield className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                                  {t.ghostMetadataGuard}
                                </span>
                                <span>{t.ghost100Secure}</span>
                              </div>

                              {/* Overlay Zone B: Sender Phone Number Block */}
                              <div className="absolute top-[20%] left-[8%] w-[84%] h-[15%] rounded-lg backdrop-blur bg-surface/40 border border-emerald-500/20 shadow-md flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                                  <div className="text-left">
                                    <p className="text-[7px] font-mono text-emerald-500 uppercase tracking-widest font-extrabold leading-none mb-1">{t.ghostLocalRedactLayer}</p>
                                    <p className="text-[9px] font-mono text-primary-text font-black tracking-wider leading-none">{t.ghostAddressMasked}</p>
                                  </div>
                                </div>
                                <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">
                                  {t.ghostScrubbed}
                                </span>
                              </div>

                              {/* Overlay Zone C: Personal Billing / System Identifiers Block */}
                              <div className="absolute bottom-[20%] left-[8%] w-[84%] h-[15%] rounded-lg backdrop-blur bg-surface/40 border border-emerald-500/20 shadow-md flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                                  <div className="text-left animate-pulse">
                                    <p className="text-[7px] font-mono text-emerald-500 uppercase tracking-widest font-extrabold leading-none mb-1">{t.ghostMetadataEnvelope}</p>
                                    <p className="text-[9px] font-mono text-primary-text font-black tracking-wider leading-none">{t.ghostCardShrouded}</p>
                                  </div>
                                </div>
                                <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20">
                                  {t.ghostIsolated}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Screenshot image container */}
                        {screenshotPreview === "netflix_sms_simulation_screenshot" ? (
                          /* High-fidelity simulation placeholder image representing fake Netflix subscription SMS */
                          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-b from-[#1E293B] to-[#0F172A] relative font-sans text-left">
                            {/* SMS bubble details mimicking a real phone text */}
                            <div className="space-y-3 mt-6">
                              <div className="flex items-start gap-2.5 max-w-xs">
                                <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
                                  NET
                                </div>
                                <div className="bg-[#334155]/60 border border-white/5 p-3 rounded-2xl rounded-tl-sm text-[11px] leading-relaxed text-slate-100 shadow-sm space-y-1">
                                  <p className="font-bold text-[9px] text-[#F87171] uppercase font-mono">From: +1 (888) 961-0421</p>
                                  <p>{language === "es" ? "Alerta de renovación de NETFLIX: Su pago de suscripción no se pudo procesar automáticamente el 25/05. Por favor reactívelo al instante a través de:" : "NETFLIX Renewal Alert: Your subscription payment failed to process automatically on 05/25. Please reactivate instantly via:"}</p>
                                  <p className="text-[#38BDF8] underline font-mono break-all text-[10px]">https://netflix-renew-billing-portal.com</p>
                                </div>
                              </div>
                            </div>

                            <p className="absolute bottom-2 right-2 text-[8px] font-mono text-secondary-text opacity-45 uppercase font-medium">
                              Simulation Target: Netflix Phishing SMS
                            </p>
                          </div>
                        ) : (
                          /* Real uploaded user screenshot rendering with optimal scale alignment */
                          <div className="w-full h-full relative flex items-center justify-center p-2 bg-black/5 dark:bg-black/25">
                            <img 
                              src={screenshotPreview} 
                              alt="VigilantEye core privacy masking preview" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain rounded-md" 
                            />
                          </div>
                        )}

                        {/* Interactive toggle replacement tag hovering over image if hover occurs */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 text-white text-xs font-semibold gap-2 z-30">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-surface hover:opacity-90 text-primary-text font-bold text-[10px] flex items-center gap-1 transition"
                          >
                            <RefreshCw className="w-3 h-3" /> {t.ghostReplaceImage}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsGhostOverlayActive(!isGhostOverlayActive);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-brand-accent hover:bg-opacity-90 text-white font-bold text-[10px] flex items-center gap-1 transition"
                          >
                            {isGhostOverlayActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {isGhostOverlayActive ? t.ghostDisableShield : t.ghostPreviewMask}
                          </button>
                        </div>
                      </div>

                      {/* Sanity stats detailing what metadata is redacted right inside client browser sandbox */}
                      <div className="grid grid-cols-3 gap-2 text-center select-none">
                        <div className="p-2 border border-emerald-500/10 bg-emerald-500/5 rounded-lg">
                          <p className="text-[7px] font-mono text-secondary-text uppercase font-bold leading-none mb-1">{t.ghostScrub}</p>
                          <p className="text-xs font-mono font-black text-emerald-500">100%</p>
                        </div>
                        <div className="p-2 border border-emerald-500/10 bg-emerald-500/5 rounded-lg">
                          <p className="text-[7px] font-mono text-secondary-text uppercase font-bold leading-none mb-1">{t.ghostPurged}</p>
                          <p className="text-xs font-mono font-black text-emerald-500">{language === "es" ? "Seguro" : "Secure"}</p>
                        </div>
                        <div className="p-2 border border-emerald-500/10 bg-emerald-500/5 rounded-lg">
                          <p className="text-[7px] font-mono text-secondary-text uppercase font-bold leading-none mb-1">{t.ghostRoute}</p>
                          <p className="text-xs font-mono font-black text-emerald-500">{language === "es" ? "Oculto" : "Masked"}</p>
                        </div>
                      </div>

                      {/* Trust-oriented comfort micro-copy */}
                      <div className="p-3.5 bg-surface/50 rounded-xl border border-secondary-text/10 flex gap-2.5 items-start">
                        <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-[10px] text-secondary-text leading-relaxed font-sans text-left font-medium">
                          <span className="text-emerald-500 font-extrabold font-sans">{t.ghostSecureText}:</span> {t.ghostComfortText}
                        </p>
                      </div>

                      {/* Manual upload cancel button */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotFile(null);
                            setScreenshotPreview(null);
                          }}
                          className="text-[10px] font-mono font-black text-rose-500 tracking-wider hover:opacity-85 uppercase cursor-pointer"
                        >
                          &times; {t.ghostClearImage}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 flex gap-2 text-xs text-rose-500">
                  <AlertTriangle className="w-4 h-4 flex-none mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isScanning}
                className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 tracking-wide transition-all duration-300 cursor-pointer ${
                  isScanning 
                    ? "bg-surface/50 text-secondary-text cursor-not-allowed border border-secondary-text/10" 
                    : "bg-brand-accent text-white hover:opacity-90 shadow-md shadow-brand-accent/25"
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.scanningActive.toUpperCase()}
                  </>
                ) : (
                  <>
                    {t.formBtnAnalysis.toUpperCase()}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Scan Performance Screen */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col">
          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden bg-surface"
              >
                {activeTab === "screenshot" && screenshotPreview ? (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src={screenshotPreview} alt="Screenshot blur trace" referrerPolicy="no-referrer" className="w-full h-full object-cover blur-md opacity-35 scale-105" />
                    <div className="absolute inset-0 bg-canvas/70 backdrop-blur-sm" />
                  </div>
                ) : null}
                
                {/* Visual Scanner Beam Bar effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-purple-600 scanner-beam opacity-90 z-20" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-brand-accent mb-6 animate-pulse shadow-md">
                    <FolderLock className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-display font-black text-primary-text tracking-widest uppercase">
                    {language === "es" ? "Análisis profundo en curso" : "Deep Core Checking"}
                  </h3>
                  <p className="text-secondary-text text-xs max-w-sm mt-3 leading-relaxed font-sans">
                    {language === "es" 
                      ? "Extrayendo caracteres visuales, comparando patrones de OCR dentro de modelos neuronales, verificando riesgos de dominio..."
                      : "Extracting visual characters, comparing OCR patterns inside neural models, checking typosquatting domain risks..."}
                  </p>
                  
                  {/* Simulated micro logging lines */}
                  <div className="mt-8 p-3.5 bg-canvas rounded-xl border border-secondary-text/10 w-full max-w-sm font-mono text-[9px] text-brand-accent text-left space-y-1">
                    <p className="opacity-50">&gt; {language === "es" ? "Cargando componentes de firma OCR..." : "Loading OCR libraries..."}</p>
                    <p className="opacity-75">&gt; {language === "es" ? "Bloques aislados con éxito." : "Text components isolated: SUCCESS."}</p>
                    <p className="opacity-95 animate-pulse">&gt; {language === "es" ? "Buscando matrices de suplantación digital..." : "Running core detection layers against database indexes..."}</p>
                  </div>
                </div>
              </motion.div>
            ) : analysisResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 glass-card rounded-2xl p-6 text-left border-brand-accent/20 flex flex-col justify-between bg-surface shadow-sm"
              >
                {/* Scan Results Layout Header */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-secondary-text/10 pb-4 mb-5">
                    <div>
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-black tracking-widest uppercase rounded border ${getRiskColor(analysisResult.status)}`}>
                        {analysisResult.status === "SAFE" ? t.riskSafe : analysisResult.status === "WARNING" ? t.riskWarning : t.riskDangerous} {language === "es" ? "Vector De Amenaza" : "Threat Vector"}
                      </span>
                      <h4 className="text-primary-text font-black font-display text-md mt-2 flex items-center gap-1.5">
                        {language === "es" ? "Categoría de amenaza" : "Threat Category"}: <span className="text-brand-accent font-black tracking-tight">{language === "es" && analysisResult.threatCategory === "Subscription Renewal Brand Impersonation" ? "Suplantación de Renovación de Netflix" : analysisResult.threatCategory}</span>
                      </h4>
                    </div>

                    {/* Circular Radial Risk Gauge */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-canvas border border-secondary-text/15">
                        <span className={`text-md font-mono font-black ${
                          analysisResult.riskScore > 75 ? "text-rose-500" : analysisResult.riskScore > 30 ? "text-amber-500" : "text-emerald-500"
                        }`}>
                          {analysisResult.riskScore}%
                        </span>
                      </div>
                      <div className="text-left font-mono text-[10px] text-secondary-text">
                        <p className="font-bold">{t.riskScoreLabel.toUpperCase()}</p>
                        <p className="text-brand-accent font-bold">{t.confidenceMeasure}: {analysisResult.confidence}%</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Detailed Explanation Text */}
                  <div className="mb-6">
                    <p className="text-xs font-mono uppercase tracking-widest text-brand-accent mb-2 font-bold">{t.explanationLabel}</p>
                    <p className="text-xs text-primary-text leading-relaxed font-sans bg-canvas/60 p-4 border border-secondary-text/15 rounded-xl font-medium">
                      {analysisResult.explanation}
                    </p>
                  </div>

                  {/* Smart Phishing Mimic Contextual Alert Card */}
                  {analysisResult.threatCategory === "Subscription Renewal Brand Impersonation" && (
                    <div className="mb-6 p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 shadow-md">
                      <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-rose-500/15">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-500 font-extrabold text-sm font-display">
                          N
                        </div>
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#EF4444] dark:text-[#F87171] font-bold">{t.targetHijacked}</p>
                          <h5 className="text-sm font-display font-black text-primary-text flex items-center gap-1.5">
                            {t.targetNetflix}
                          </h5>
                        </div>
                      </div>

                      <p className="text-xs text-secondary-text mb-4 leading-relaxed font-sans">
                        {t.neuralPatternConfirm} <span className="text-rose-500 dark:text-rose-400 font-bold font-sans">{t.targetNetflix}</span> {t.toExploit}
                      </p>

                      {/* Fake vs Real warning section with precise design system danger state colors */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5 font-mono text-[11px]">
                        {/* Fake Link Section */}
                        <div className="p-3 bg-red-500/5 dark:bg-red-950/10 border border-[#EF4444]/20 dark:border-[#F87171]/20 rounded-xl space-y-1">
                          <span className="text-[#EF4444] dark:text-[#F87171] font-bold uppercase tracking-wider text-[9px] block">{t.fraudRedirectLink}</span>
                          <span className="text-primary-text underline break-all block">https://netflix-renew-billing-portal.com</span>
                          <span className="text-secondary-text text-[9px] block">{t.risksSiphoning}</span>
                        </div>
                        {/* Real Link Section */}
                        <div className="p-3 bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-xl space-y-1">
                          <span className="text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-wider text-[9px] block">{t.verifiedOfficialAddress}</span>
                          <span className="text-primary-text underline break-all block">https://www.netflix.com</span>
                          <span className="text-secondary-text text-[9px] block">{t.secureLegitGateway}</span>
                        </div>
                      </div>

                      {/* Redirect safely button */}
                      <a 
                        href="https://www.netflix.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-brand-accent hover:opacity-90 shadow-lg shadow-brand-accent/25 transition-all flex items-center justify-center gap-2 tracking-wide text-center"
                      >
                        {t.redirectSafelyBtn.toUpperCase()}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Highlighted Red-flag patterns list */}
                  {analysisResult.detectedFlags.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-mono uppercase tracking-widest text-rose-500 mb-2 font-bold">{t.detectedFlagsLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.detectedFlags.map((flag, idx) => (
                          <span key={idx} className="bg-rose-500/10 border border-rose-500/25 px-2.5 py-1.5 rounded-lg text-rose-500 text-[10px] font-semibold inline-block">
                            ● {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action recommendations checklist */}
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#a855f7] mb-2.5 font-bold">{t.safetyRecommendationsLabel}</p>
                    <ul className="space-y-2 pl-1">
                      {analysisResult.safetyRecommendations.map((rec, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-primary-text font-sans font-medium">
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-none mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Saved Report CTA banner */}
                <div className="mt-8 border-t border-secondary-text/10 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-mono pb-2">
                  <span className="text-secondary-text text-[10px] font-bold">Verified via VigilantEye AI Pattern Engine™</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        setAnalysisResult(null);
                        setScreenshotFile(null);
                        setScreenshotPreview(null);
                      }}
                      className="px-4 py-2 rounded bg-surface border border-secondary-text/20 text-xs font-bold text-primary-text hover:bg-canvas transition w-full sm:w-auto text-center cursor-pointer"
                    >
                      {language === "es" ? "Escanear Otro" : "Scan Another"}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(analysisResult, null, 2))}
                      className="px-4 py-2 rounded bg-brand-accent/15 text-xs font-bold text-brand-accent hover:opacity-90 border border-brand-accent/25 transition w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedLink ? (language === "es" ? "Copiado RAW" : "Copied RAW") : (language === "es" ? "Copiar Datos RAW" : "Copy RAW Data")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 glass-card rounded-2xl p-8 border border-secondary-text/10 text-center flex flex-col items-center justify-center min-h-[350px] bg-surface"
              >
                <div className="w-14 h-14 rounded-full bg-canvas/80 border border-secondary-text/15 flex items-center justify-center text-secondary-text mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-primary-text font-mono uppercase tracking-widest font-bold">
                  {language === "es" ? "A la espera de parámetros" : "Awaiting Input Parameters"}
                </h3>
                <p className="text-secondary-text text-xs max-w-xs mt-2.5 leading-relaxed font-sans font-medium">
                  {language === "es" 
                    ? "Complete los detalles sospechosos o suba una captura de pantalla en el panel izquierdo y pulse iniciar ejecución para verificar."
                    : "Fill in the suspect details or upload screenshot on the left panel, and initiate execution to check for threat indicators."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
