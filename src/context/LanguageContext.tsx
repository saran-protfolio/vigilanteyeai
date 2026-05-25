import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "es";

export interface TranslationDictionary {
  // Header & Navigation
  logoName: string;
  navHome: string;
  navScanEngine: string;
  navThreatRecords: string;
  navDeepfakeWizard: string;
  activeBadge: string;
  
  // PublicHome
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaStartCheck: string;
  ctaRecentActivity: string;
  vettedTipHeader: string;
  tipCriticalBadge: string;
  tipPhishingBadge: string;
  tipUrgencyBadge: string;
  tipPaymentBadge: string;
  tipJobsBadge: string;
  tipNetworkBadge: string;
  learnSlightTitle: string;
  learnSlightDesc: string;

  // AIScanner Controls & Tabs
  scanEngineTitle: string;
  tabText: string;
  tabUrl: string;
  tabScreenshot: string;
  vectorHeading: string;
  formTextLabel: string;
  formUrlLabel: string;
  formBtnAnalysis: string;
  scanningActive: string;
  errEnterText: string;
  errEnterUrl: string;
  errEnterFile: string;

  // Ghost Overlay Panel
  ghostTitle: string;
  ghostSub: string;
  ghostSecZone: string;
  ghostMetadataGuard: string;
  ghost100Secure: string;
  ghostLocalRedactLayer: string;
  ghostAddressMasked: string;
  ghostScrubbed: string;
  ghostMetadataEnvelope: string;
  ghostCardShrouded: string;
  ghostIsolated: string;
  ghostScrub: string;
  ghostPurged: string;
  ghostRoute: string;
  ghostSecureText: string;
  ghostComfortText: string;
  ghostClearImage: string;
  ghostReplaceImage: string;
  ghostDisableShield: string;
  ghostPreviewMask: string;

  // Smart Phishing Mimic Contextual Alert
  targetHijacked: string;
  targetNetflix: string;
  neuralPatternConfirm: string;
  toExploit: string;
  fraudRedirectLink: string;
  risksSiphoning: string;
  verifiedOfficialAddress: string;
  secureLegitGateway: string;
  redirectSafelyBtn: string;

  // General Scan Results Card
  riskScoreLabel: string;
  riskDangerous: string;
  riskWarning: string;
  riskSafe: string;
  confidenceMeasure: string;
  explanationLabel: string;
  detectedFlagsLabel: string;
  safetyRecommendationsLabel: string;
  newScanBtn: string;

  // ScanHistory Page
  threatRecordTitle: string;
  threatRecordSubtitle: string;
  noHistoryTitle: string;
  noHistoryDesc: string;
  threatLevel: string;
  timestampLabel: string;
  viewScanDetails: string;
  scannedText: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    logoName: "VigilantEye AI",
    navHome: "Home",
    navScanEngine: "Scan Engine",
    navThreatRecords: "Threat Records",
    navDeepfakeWizard: "Voice Triage Wizard",
    activeBadge: "Active",
    heroBadge: "Free Public Security Protection",
    heroTitle: "Stop Cyber Scams Before They Damage You.",
    heroSubtitle: "Received a suspected fraudulent message, a phishy login link, or atypical support demands? Paste details or upload a screenshot. Our smart scanner spots digital deception pattern codes in milliseconds.",
    ctaStartCheck: "Start Free Security Check",
    ctaRecentActivity: "Recent Scan Activity",
    vettedTipHeader: "Daily Vetted Cybersecurity Tip",
    tipCriticalBadge: "Most Critical",
    tipPhishingBadge: "Phishing Links",
    tipUrgencyBadge: "Immediate Pressure",
    tipPaymentBadge: "Visual Forge Fraud",
    tipJobsBadge: "Employment Scam",
    tipNetworkBadge: "Network Security",
    learnSlightTitle: "VigilantEye Threat Database Intelligence",
    learnSlightDesc: "Track real-time digital fraud attempts, SMS/web spoofing reports, and telemetry anomalies registered across global networks.",
    scanEngineTitle: "Security Sandbox Engine",
    tabText: "Analyze Text",
    tabUrl: "Verify Link URL",
    tabScreenshot: "Upload Screenshot",
    vectorHeading: "Instant Test Vectors",
    formTextLabel: "Suspicious Text Content",
    formUrlLabel: "Suspicious Link Address",
    formBtnAnalysis: "Perform Security Analysis",
    scanningActive: "Decompressing Neural Signatures...",
    errEnterText: "Please paste standard text contents to scan.",
    errEnterUrl: "Please enter a valid HTTP/HTTPS link to verify.",
    errEnterFile: "Please upload a transaction screenshot or chat image to scan.",
    ghostTitle: "Ghost Overlay Privacy Shield",
    ghostSub: "On-Device Security Active",
    ghostSecZone: "Real-Time Redaction Guard",
    ghostMetadataGuard: "[GHOST METADATA GUARD]",
    ghost100Secure: "100% SECURE",
    ghostLocalRedactLayer: "LOCAL REDACTION LAYER",
    ghostAddressMasked: "Sender Address Token Masked",
    ghostScrubbed: "SCRUBBED",
    ghostMetadataEnvelope: "METADATA ENVELOPE",
    ghostCardShrouded: "Access Token & Card Shrouded",
    ghostIsolated: "ISOLATED",
    ghostScrub: "Sender ID Scrub",
    ghostPurged: "Meta-Data Purged",
    ghostRoute: "Network Route",
    ghostSecureText: "On-Device Sanitization Core",
    ghostComfortText: "Sensitive identifiers (phone protocols, avatars, network headers) are automatically pre-scrubbed in your local browser engine. Only safe lexical content is processed by the remote AI server, guaranteeing absolute data safety.",
    ghostClearImage: "Clear Image & Choose Another",
    ghostReplaceImage: "REPLACE IMAGE",
    ghostDisableShield: "DISABLE SHIELD",
    ghostPreviewMask: "PREVIEW MASK",
    targetHijacked: "Impersonation Target Hijacked",
    targetNetflix: "Netflix Subscription System",
    neuralPatternConfirm: "Our neural pattern recognition model has confirmed this vector mimics premium template structures of",
    toExploit: "to exploit personal billing credentials.",
    fraudRedirectLink: "⚠️ Fraudulent Redirect Link:",
    risksSiphoning: "Risks: Siphoning passwords, harvest billing logs",
    verifiedOfficialAddress: "🛡️ Verified Official Address:",
    secureLegitGateway: "Secure: Legitimate subscriptions gateway",
    redirectSafelyBtn: "REDIRECT SAFELY TO OFFICIAL PAGE",
    riskScoreLabel: "Overall Threat Risk Score",
    riskDangerous: "DANGEROUS",
    riskWarning: "WARNING",
    riskSafe: "SAFE",
    confidenceMeasure: "Confidence Match",
    explanationLabel: "Core Threat Signature Explanation",
    detectedFlagsLabel: "Neural Signals Detected",
    safetyRecommendationsLabel: "Mandatory Safety Interventions",
    newScanBtn: "Analyze New Incident Thread",
    threatRecordTitle: "Isolated Threats Ledger",
    threatRecordSubtitle: "Historical log of local scan inquiries and security sandbox evaluations parsed.",
    noHistoryTitle: "Isolated Ledger is Empty",
    noHistoryDesc: "You have not performed any sandboxed threat signature scans in this session. Run your first check now to begin tracking risk matrices.",
    threatLevel: "Threat Level",
    timestampLabel: "Timestamp Logged",
    viewScanDetails: "View Sandbox Report",
    scannedText: "Analyzed Source Content",
  },
  es: {
    logoName: "VigilantEye AI",
    navHome: "Inicio",
    navScanEngine: "Escanear",
    navThreatRecords: "Incidentes",
    navDeepfakeWizard: "Protección de Voz",
    activeBadge: "Activo",
    heroBadge: "Protección Pública de Seguridad Gratuita",
    heroTitle: "Detenga Ciberestafas Antes de que lo Dañen.",
    heroSubtitle: "¿Recibió un mensaje sospechoso de fraude, un enlace de inicio de sesión dudoso o demandas de soporte atípicas? Pegue los detalles o suba una captura de pantalla. Nuestro escáner inteligente detecta patrones de engaño digital en milisegundos.",
    ctaStartCheck: "Iniciar Análisis de Seguridad",
    ctaRecentActivity: "Actividad de Escaneo Reciente",
    vettedTipHeader: "Consejo Diario de Ciberseguridad",
    tipCriticalBadge: "Más Crítico",
    tipPhishingBadge: "Enlaces Phishing",
    tipUrgencyBadge: "Presión Inmediata",
    tipPaymentBadge: "Fraude de Recibo Falso",
    tipJobsBadge: "Estafa de Empleo",
    tipNetworkBadge: "Seguridad de Red",
    learnSlightTitle: "Inteligencia de Amenazas VigilantEye",
    learnSlightDesc: "Rastree intentos de fraude digital en tiempo real, informes de suplantación de SMS/web y anomalías de telemetría registradas en redes globales.",
    scanEngineTitle: "Motor de Sandbox de Seguridad",
    tabText: "Analizar Texto",
    tabUrl: "Verificar URL",
    tabScreenshot: "Subir Captura",
    vectorHeading: "Vectores de Prueba Rápidos",
    formTextLabel: "Contenido de Texto Sospechoso",
    formUrlLabel: "Dirección de Enlace Sospechoso",
    formBtnAnalysis: "Realizar Análisis de Seguridad",
    scanningActive: "Descomprimiendo Firmas Neuronales...",
    errEnterText: "Por favor pegue el texto sospechoso para escanear.",
    errEnterUrl: "Por favor ingrese un enlace HTTP/HTTPS válido para verificar.",
    errEnterFile: "Por favor suba una captura de pantalla de la transacción o chat.",
    ghostTitle: "Escudo de Privacidad Ghost Overlay",
    ghostSub: "Seguridad en Dispositivo Activa",
    ghostSecZone: "Guardia de Redacción en Tiempo Real",
    ghostMetadataGuard: "[PROTECCIÓN DE METADATOS GHOST]",
    ghost100Secure: "100% SEGURO",
    ghostLocalRedactLayer: "CAPA DE REDACCIÓN LOCAL",
    ghostAddressMasked: "Dirección del Remitente Enmascarada",
    ghostScrubbed: "SANEADO",
    ghostMetadataEnvelope: "SOBRE DE METADATOS",
    ghostCardShrouded: "Token de Acceso y Tarjeta Ocultos",
    ghostIsolated: "AISLADO",
    ghostScrub: "Saneamiento de Remitente",
    ghostPurged: "Metadatos Eliminados",
    ghostRoute: "Ruta de Red",
    ghostSecureText: "Núcleo de Sanitización en Dispositivo",
    ghostComfortText: "Los identificadores sensibles (teléfono, avatares, encabezados de red) se depuran automáticamente en el motor de su navegador local. Solo se procesa texto seguro en el servidor de IA remoto, lo que garantiza la privacidad total.",
    ghostClearImage: "Limpiar Imagen y Elegir Otra",
    ghostReplaceImage: "REEMPLAZAR IMAGEN",
    ghostDisableShield: "DESACTIVAR ESCUDO",
    ghostPreviewMask: "VISTA PREVIA DE MÁSCARA",
    targetHijacked: "Objetivo de Suplantación Detectado",
    targetNetflix: "Sistema de Suscripción Netflix",
    neuralPatternConfirm: "Nuestro modelo de reconocimiento de patrones neuronales ha confirmado que este vector imita la estructura de",
    toExploit: "para robar sus credenciales de facturación personal.",
    fraudRedirectLink: "⚠️ Enlace de Redirección Fraudulento:",
    risksSiphoning: "Riesgos: Robo de contraseñas, captura de datos financieros",
    verifiedOfficialAddress: "🛡️ Dirección Oficial Verificada:",
    secureLegitGateway: "Seguro: Pasarela legítima de suscripciones",
    redirectSafelyBtn: "REDIRECCIONAR SEGURO A LA PÁGINA OFICIAL",
    riskScoreLabel: "Puntuación de Riesgo de Amenaza",
    riskDangerous: "PELIGROSO",
    riskWarning: "ADVERTENCIA",
    riskSafe: "SEGURO",
    confidenceMeasure: "Nivel de Confianza",
    explanationLabel: "Explicación de la Firma de Amenaza",
    detectedFlagsLabel: "Señales Neuronales Detectadas",
    safetyRecommendationsLabel: "Intervenciones Obligatorias de Seguridad",
    newScanBtn: "Analizar Nuevo Incidente",
    threatRecordTitle: "Libro de Amenazas Aisladas",
    threatRecordSubtitle: "Registro histórico de análisis locales y evaluaciones de sandboxing procesados.",
    noHistoryTitle: "El Libro de Registro está Vacío",
    noHistoryDesc: "No ha realizado análisis de amenazas en esta sesión. Inicie un análisis ahora para comenzar el historial.",
    threatLevel: "Nivel de Amenaza",
    timestampLabel: "Fecha Registrada",
    viewScanDetails: "Ver Informe de Sandbox",
    scannedText: "Contenido de Origen Analizado",
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Keep saved language preference in localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("vigilanteye-lang");
    if (savedLang === "en" || savedLang === "es") {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("vigilanteye-lang", lang);
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
