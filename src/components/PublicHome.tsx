import React, { useState, useEffect } from "react";
import type { ScanReport } from "../types";
import { useTranslation } from "../context/LanguageContext";

interface PublicHomeProps {
  onNavigate: (page: string) => void;
  scanHistory: ScanReport[];
}

const getSecurityTips = (lang: string) => {
  if (lang === "es") {
    return [
      {
        title: "Nunca compartas contraseñas de un solo uso (OTP) o PIN",
        desc: "Su banco, funcionarios gubernamentales o agentes de entrega **nunca** le pedirán sus contraseñas OTP o PIN por llamada telefónica, WhatsApp o correo electrónico. Trate estas solicitudes como estafas inmediatas.",
        badge: "Más crítico",
        type: "CRITICAL"
      },
      {
        title: "Inspeccione los nombres de sitios web detenidamente",
        desc: "Lea siempre los enlaces web importantes con atención. Los sitios web fraudulentos a menudo usan nombres de dominio similares, como **arnazon-offers.com** en lugar de **amazon.com**.",
        badge: "Enlaces de Phishing",
        type: "PHISHING"
      },
      {
        title: "Identifique tácticas de urgencia artificial",
        desc: "Las estafas tienen como objetivo causarle pánico para forzar decisiones rápidas. Los SMS que dicen **'Su cuenta se bloqueará en 1 hora'** son tácticas clásicas. Deténgase, respire y comuníquese con la línea oficial del servicio.",
        badge: "Presión inmediata",
        type: "WARNING"
      },
      {
        title: "Verifique las capturas de recibos de pago",
        desc: "Si vende artículos en línea, **no** confíe en capturas de pantalla de 'Transferencias exitosas' enviadas por compradores. Los estafadores crean recibos falsos realistas con extrema facilidad. Confíe **únicamente** en los movimientos de su cuenta.",
        badge: "Fraude de recibos falsos",
        type: "PAYMENT"
      },
      {
        title: "Evite ofertas de trabajo simples de 'Dar likes a tareas'",
        desc: "Las propuestas en redes sociales para ganar dinero rápido simplemente 'suscribiéndose a canales de YouTube' son trampas de empleo. Le pedirán 'depósitos de activación' y luego desaparecerán con sus fondos.",
        badge: "Estafa de empleo",
        type: "JOBS"
      },
      {
        title: "Verificación segura sobre redes WiFi públicas",
        desc: "Nunca introduzca contraseñas bancarias financieras ni ingrese detalles analíticos importantes en redes públicas de aeropuertos o cafeterías sin un canal cifrado. Use VPN u otros métodos seguros.",
        badge: "Seguridad de red",
        type: "NETWORK"
      }
    ];
  }
  return [
    {
      title: "Never Share OTPs or PINs",
      desc: "Your bank, government officials, or delivery agents will **never** ask for your One-Time Passwords (OTPs) or PINs over a phone call, WhatsApp support, or email. Treat these requests as immediate scams.",
      badge: "Most Critical",
      type: "CRITICAL"
    },
    {
      title: "Inspect Website Names Carefully",
      desc: "Always read high-importance web links closely. Fraudulent websites often use close lookalikes, such as **arnazon-offers.com** instead of **amazon.com** or **icici-banking-verification.biz** instead of **icicibank.com**.",
      badge: "Phishing Links",
      type: "PHISHING"
    },
    {
      title: "Spot Artificial Urgency Tricks",
      desc: "Scams aim to panic you into quick decisions. SMS threats claiming **'Your account will lock in 1 hour'** or **'Immediate penalty of $100 applied'** are classic tactics. Pause, breathe, and contact the official helpline directly.",
      badge: "Immediate Pressure",
      type: "WARNING"
    },
    {
      title: "Verify Buyer Payment Screenshots",
      desc: "If you sell items online, do **not** trust digital screenshots of 'Successful UPI transfer' or credit receipts sent by buyers. Scammers construct realistic fake receipts easily. Rely **only** on your official bank account statement.",
      badge: "Visual Forge Fraud",
      type: "PAYMENT"
    },
    {
      title: "Avoid Simple 'Task-Liking' Job Offers",
      desc: "Social media proposals to earn fast income by merely 'subscribing to YouTube channels' or 'submitting online product ratings' are traps. They will ask for high 'activation deposits' later, then disappear with your funds.",
      badge: "Employment Scam",
      type: "JOBS"
    },
    {
      title: "Secure Verification Over Public WiFi",
      desc: "Never enter financial bank passwords or input critical details on open airport or coffee shop public networks without a secure browser. Scammers can extract transferred packages on unencrypted connections.",
      badge: "Network Security",
      type: "NETWORK"
    }
  ];
};

export default function PublicHome({ onNavigate, scanHistory }: PublicHomeProps) {
  const { language } = useTranslation();
  const tips = getSecurityTips(language);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * tips.length);
    setCurrentTipIdx(randomStart);
  }, [tips.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIdx((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [tips.length]);

  const handlePrevTip = () => {
    setCurrentTipIdx((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleNextTip = () => {
    setCurrentTipIdx((prev) => (prev + 1) % tips.length);
  };

  const currentTip = tips[currentTipIdx];

  const getTipBadgeStyle = (type: string) => {
    switch (type) {
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-500 border-rose-500/25";
      case "PHISHING":
        return "bg-blue-500/10 text-brand-accent border-blue-500/25";
      case "WARNING":
        return "bg-amber-500/10 text-amber-500 border-amber-500/25";
      case "PAYMENT":
        return "bg-purple-500/10 text-purple-400 border-purple-500/25";
      default:
        return "bg-emerald-500/10 text-success-state border-emerald-500/25";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-left selection:bg-brand-accent selection:text-white">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-surface border border-secondary-text/10 p-8 sm:p-12 mb-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-5">
            {language === "es" ? "Protección de Seguridad Pública Gratuita" : "Free Public Security Protection"}
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-display font-black text-primary-text tracking-tight leading-tight">
            {language === "es" ? (
              <>Detenga las Estafas Cibernéticas <br className="hidden sm:inline" /> Antes de que le Perjudiquen.</>
            ) : (
              <>Stop Cyber Scams <br className="hidden sm:inline" /> Before They Damage You.</>
            )}
          </h1>
          
          <p className="text-secondary-text text-sm sm:text-base mt-4 leading-relaxed max-w-xl">
            {language === "es" 
              ? "¿Recibió un mensaje sospechoso, un enlace de inicio de sesión fraudulento o demandas de soporte dudosas? Pegue los detalles o cargue una captura de pantalla. Nuestro escáner inteligente detecta patrones de engaño digital en milisegundos."
              : "Received a suspected fraudulent message, a phishy login link, or atypical support demands? Paste details or upload a screenshot. Our smart scanner spots digital deception pattern codes in milliseconds."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => onNavigate("scanner")}
              className="px-6 py-4 bg-brand-accent hover:opacity-90 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-brand-accent/25 text-center cursor-pointer font-sans"
            >
              {language === "es" ? "Iniciar Comprobación" : "Start Free Security Check"}
            </button>
            <button
              type="button"
              onClick={() => onNavigate("wizard")}
              className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/30 text-rose-500 font-extrabold rounded-xl text-xs transition-all text-center cursor-pointer font-sans flex items-center justify-center gap-1.5"
            >
              ⚠️ {language === "es" ? "Identificar Clonación Voz IA" : "Voice Scam Triage (Panic)"}
            </button>
            <button
              type="button"
              onClick={() => onNavigate("history")}
              className="px-6 py-4 bg-surface hover:bg-surface/80 border border-secondary-text/25 text-primary-text font-semibold rounded-xl text-xs transition-all text-center cursor-pointer font-sans"
            >
              {language === "es" ? "Historial de Escaneos" : "Recent Scan Activity"}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Security Tip Carousel (User Interactive Card) */}
      <div className="mb-12">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden bg-surface/50">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-secondary-text/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold text-secondary-text uppercase tracking-wider font-mono">
                {language === "es" ? "Consejo Diario de Ciberseguridad" : "Daily Vetted Cybersecurity Tip"}
              </h3>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handlePrevTip}
                className="w-7 h-7 rounded-lg bg-surface border border-secondary-text/20 text-primary-text hover:text-brand-accent flex items-center justify-center transition cursor-pointer text-xs"
                title="Previous Tip"
              >
                &larr;
              </button>
              <span className="text-[10px] text-secondary-text font-mono px-2 py-1 select-none">
                {currentTipIdx + 1} / {tips.length}
              </span>
              <button
                type="button"
                onClick={handleNextTip}
                className="w-7 h-7 rounded-lg bg-surface border border-secondary-text/20 text-primary-text hover:text-brand-accent flex items-center justify-center transition cursor-pointer text-xs"
                title="Next Tip"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div className="min-h-[110px] flex flex-col justify-between">
            {currentTip && (
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTipBadgeStyle(currentTip.type)}`}>
                    {currentTip.badge}
                  </span>
                  <h4 className="text-sm font-bold text-primary-text font-display">
                    {currentTip.title}
                  </h4>
                </div>
                <p className="text-xs text-secondary-text leading-relaxed font-sans">
                  {currentTip.desc}
                </p>
              </div>
            )}
            <p className="text-[10px] text-secondary-text italic mt-3 font-mono">
              {language === "es" 
                ? "* Los consejos se rotan automáticamente cada 10s. Haga clic en las flechas para navegar manualmente."
                : "* Advice auto-rotates every 10s. Click direction arrows on the top right to navigate tips."}
            </p>
          </div>
        </div>
      </div>

      {/* Simplified How it works Section */}
      <div className="mb-16">
        <div className="text-center sm:text-left mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-primary-text font-display">
            {language === "es" ? "Ciclos de Análisis Defensivo Vigilante" : "Vigilant Defensive Scanning Cycles"}
          </h2>
          <p className="text-xs sm:text-sm text-secondary-text mt-1 font-sans">
            {language === "es" 
              ? "Un escudo de sensor digital intuitivo que evita ataques fraudulentos en sus cuentas y activos financieros."
              : "An intuitive digital sensor shield preventing fraudulent attacks on your accounts and financial deposits."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="p-6 rounded-2xl bg-surface border border-secondary-text/10 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-mono font-extrabold text-sm mb-4">
              1
            </div>
            <h3 className="text-sm font-bold text-primary-text uppercase tracking-wider font-display">
              {language === "es" ? "Enviar Texto o Enlace" : "Submit Link or text"}
            </h3>
            <p className="text-xs text-secondary-text mt-2 leading-relaxed">
              {language === "es" 
                ? "Copie SMS telefónicos sospechosos, facturas o correos electrónicos. VigilantEye AI consulta dominios, analiza la antigüedad del registro y alerta sobre conductas manipulativas."
                : "Copy suspicious phone SMS, payment invoices, lottery claims, or emails. VigilantEye AI queries domains, check register age, and flags manipulation structures."}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-secondary-text/10 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center text-brand-accent font-mono font-extrabold text-sm mb-4">
              2
            </div>
            <h3 className="text-sm font-bold text-primary-text uppercase tracking-wider font-display">
              {language === "es" ? "Diagnósticos Instantáneos" : "Lightning Diagnostics"}
            </h3>
            <p className="text-xs text-secondary-text mt-2 leading-relaxed">
              {language === "es" 
                ? "Nuestro avanzado motor de patrones aísla indicadores como URL similares, urgencia artificial, recibos de pago falsos escaneados y perfiles de fraude de alta presión."
                : "Our advanced pattern engine isolates indicators such as typosquatting URLs, artificial urgency, payment receipt fraud, and high-pressure telecomm scam profiles."}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-secondary-text/10 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-success-state font-mono font-extrabold text-sm mb-4">
              3
            </div>
            <h3 className="text-sm font-bold text-primary-text uppercase tracking-wider font-display">
              {language === "es" ? "Recomendaciones de Acción" : "Actionable Recommendations"}
            </h3>
            <p className="text-xs text-secondary-text mt-2 leading-relaxed">
              {language === "es" 
                ? "Reciba un informe de confianza detallado con acciones seguras sugeridas: bloquear remitentes, aislar redes, reportar cuentas o ignorar activos maliciosos."
                : "Receive a diagnostic confidence ledger containing immediate safe actions: block senders, isolate networks, report accounts, or ignore malicious assets."}
            </p>
          </div>
        </div>
      </div>

      {/* Public stats callout card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-secondary-text/15 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-primary-text font-display">
            {language === "es" ? "¿Analizando capturas de chat de soporte?" : "Analyzing custom support chat screenshots?"}
          </h4>
          <p className="text-xs text-secondary-text leading-relaxed">
            {language === "es" 
              ? "Nuestra aplicación cuenta con herramientas de análisis OCR visual automático para descifrar hilos de chat y capturas de recibos financieros."
              : "Our app features automatic visual OCR analysis tools that can decipher chat streams and receipts to evaluate financial threat patterns."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("scanner")}
          className="w-full sm:w-auto px-6 py-3 bg-brand-accent text-white hover:opacity-90 font-semibold rounded-xl text-xs transition border border-brand-accent/25 cursor-pointer text-center"
        >
          {language === "es" ? "Escanear Captura de Chat" : "Scan Chat Screenshot"}
        </button>
      </div>
      
    </div>
  );
}
