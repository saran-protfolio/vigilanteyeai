import React, { useState, useEffect } from "react";
import { 
  PhoneCall, 
  Shield, 
  AlertOctagon, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Heart, 
  Copy, 
  Check, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { useTranslation } from "../context/LanguageContext";

interface StepData {
  id: number;
  categoryEn: string;
  categoryEs: string;
  titleEn: string;
  titleEs: string;
  questionEn: string;
  questionEs: string;
  descriptionEn: string;
  descriptionEs: string;
  tipEn: string;
  tipEs: string;
}

export default function DeepfakeWizard() {
  const { language } = useTranslation();
  
  // State for the wizard
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // Calming grounded breather toggle
  const [showBreather, setShowBreather] = useState<boolean>(true);
  const [breatherText, setBreatherText] = useState<string>("Inhale...");
  
  // Audio Simulator
  const [audioState, setAudioState] = useState<"quiet" | "analyzing" | "scam_vector">("quiet");
  const [audioProgress, setAudioProgress] = useState<number>(0);
  
  // Cooldown / Copy Actions
  const [copiedSafetyWord, setCopiedSafetyWord] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);

  // Breathing state controller
  useEffect(() => {
    let breathCycle = 0;
    const interval = setInterval(() => {
      breathCycle = (breathCycle + 1) % 4;
      if (breathCycle === 0) {
        setBreatherText(language === "es" ? "Inhale profundamente..." : "Inhale deeply...");
      } else if (breathCycle === 1) {
        setBreatherText(language === "es" ? "Retenga el aire..." : "Hold your breath...");
      } else if (breathCycle === 2) {
        setBreatherText(language === "es" ? "Exhale suavemente..." : "Exhale slowly...");
      } else {
        setBreatherText(language === "es" ? "Pause y relájese..." : "Rest and pause...");
      }
    }, 4000); // 4 seconds per cycle

    return () => clearInterval(interval);
  }, [language]);

  // Audio simulation loader
  useEffect(() => {
    if (audioState === "analyzing") {
      setAudioProgress(0);
      const timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setAudioState("scam_vector");
            return 100;
          }
          return prev + 12;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [audioState]);

  const stepsList: StepData[] = [
    {
      id: 1,
      categoryEn: "CRISIS & FINANCIAL DEMANDS",
      categoryEs: "CRISIS Y DEMANDAS FINANCIERAS",
      titleEn: "Identify High-Pressure Distress Scenarios",
      titleEs: "Identificar Escenarios de Presión Suprema",
      questionEn: "Is the caller screaming, crying, claiming an extreme immediate tragedy (e.g., car accident, sudden arrest, hostage crisis), and demanding irreversible funds like Crypto, Wire transfers, or Gift Cards immediately?",
      questionEs: "¿El interlocutor grita, llora, afirma sufrir una tragedia extrema inmediata (ej. accidente de tránsito, arresto repentino, secuestro) y exige fondos irreversibles como criptomonedas, transferencias inmediatas o tarjetas de regalo?",
      descriptionEn: "Scammers leverage massive stress to bypass your critical think patterns. Legitimate rescue agencies or medical teams do not request digital retail currencies.",
      descriptionEs: "Los estafadores se aprovechan del estrés masivo para eludir su pensamiento lógico. Los equipos médicos oficiales jamás exigen cobros en criptomonedas o tarjetas.",
      tipEn: "Never engage in emergency payments on the first unsolicited call. Legitimate authorities always grant validation protocols.",
      tipEs: "Nunca realice pagos de emergencia en la primera llamada no solicitada. Las autoridades reales siempre permiten protocolos de validación."
    },
    {
      id: 2,
      categoryEn: "ACOUSTIC ANALYSIS & FORENSICS",
      categoryEs: "ANÁLISIS ACÚSTICO Y FORENSE",
      titleEn: "Examine Auditory Texture Anomalies",
      titleEs: "Examinar Anomalías de Textura Auditiva",
      questionEn: "Are there micro-robotic pauses, odd electronic noise thresholds, metallic textures in their speech, or does the vocal background sound unnaturally quiet or clean for their supposed crisis environment?",
      questionEs: "¿Detecta micro-pausas robóticas, umbrales de ruido electrónico extraños, texturas metálicas en el habla o el fondo de voz suena extrañamente silencioso para el entorno de crisis reportado?",
      descriptionEn: "AI audio clones use voice blueprints compiled off social media feeds. They often struggle with organic breathing patterns, slang, or sudden emotional shifts, yielding synthetic voice packets.",
      descriptionEs: "Las clonaciones de audio IA usan huellas compiladas de redes sociales. Carecen de patrones de respiración orgánicos, modismos propios o reacciones emocionales humanas naturales.",
      tipEn: "Deepfake systems exhibit trouble handling rapid sentence interruptions or non-scripted dialogue questions.",
      tipEs: "Los sistemas de Deepfake tienen problemas para manejar interrupciones rápidas u oraciones con dobles intenciones."
    },
    {
      id: 3,
      categoryEn: "IDENTITY SHIELDS & VALIDATION",
      categoryEs: "RECONOCIMIENTO Y VALIDACIÓN DE IDENTIDAD",
      titleEn: "Verify Personal Security Checkpoints",
      titleEs: "Verificar Puntos de Control Personal",
      questionEn: "Have they flatly discouraged you from hanging up to isolate you from families, or failed to answer basic personal verification questions (such as a private childhood memory, pet's secret name, or family word)?",
      questionEs: "¿Le impiden colgar para aislarlo de otros familiares, o han fallado al responder preguntas de verificación sencillas (como un apodo infantil, el nombre secreto de la mascota o el código familiar)?",
      descriptionEn: "Synthesizer models have access to public directories but fail when probed with specific private stories that don't exist in web data files.",
      descriptionEs: "Los modelos de IA tienen acceso a bases de datos públicas, pero fracasan ante recuerdos íntimos fuera del espectro de internet.",
      tipEn: "Establish a mutual family safety word today. It acts as a cryptographic handshake in threat verification scenarios.",
      tipEs: "Establezca una clave secreta familiar hoy. Funciona como un protocolo criptográfico en escenarios de urgencia."
    }
  ];

  const handleAnswer = (value: boolean) => {
    const updatedAnswers = { ...answers, [currentStep]: value };
    setAnswers(updatedAnswers);
    
    if (currentStep < stepsList.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      // Automatically test voice analyzer simulator for UX immersion
      setAudioState("analyzing");
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setAudioState("quiet");
    setAudioProgress(0);
  };

  // Diagnostic calculations
  const calculateResultScore = () => {
    let yesCount = 0;
    Object.values(answers).forEach((val) => {
      if (val === true) yesCount++;
    });
    return (yesCount / stepsList.length) * 100;
  };

  const threatRating = calculateResultScore();

  const getThreatVerdict = () => {
    if (threatRating === 100) {
      return {
        verdictEn: "Critical Threat Vector - Voice Cloning Confirmed",
        verdictEs: "Vector de Amenaza Crítico - Clonación de Voz Confirmada",
        descEn: "Every high-urgency signature indicates an active AI Synthesizer/Deepfake scam attempting to extract assets. The vocal pacing and transfer paths represent synthetic voice fraud.",
        descEs: "Cada indicador de alta urgencia confirma una estafa activa de Sintetizador de IA/Deepfake que intenta sustraer fondos. No continúe la llamada.",
        color: "text-rose-500 border-rose-500/20 bg-rose-500/5",
        statusBadge: "CRITICAL DEEPFAKE",
        advicesEn: [
          "Hang up immediately. Scammers use psychological lock-in.",
          "Call the targeted family member using their pre-saved personal phone contact directly.",
          "Never authorize instant banking wires, crypto tokens, or purchase Apple/Amazon gift cards.",
          "Inform local police departments or internet safety portals instantly."
        ],
        advicesEs: [
          "Cuelgue la llamada de inmediato. Usan técnicas de manipulación psíquica.",
          "Llame directamente al familiar afectado usando su número de contacto original guardado en su agenda.",
          "Nunca autorice giros bancarios rápidos ni compre tarjetas de regalo de tiendas.",
          "Informe de inmediato a los reguladores de seguridad cibernética de su región."
        ]
      };
    } else if (threatRating >= 60) {
      return {
        verdictEn: "High Risk - Suspicious Impersonation Profile",
        verdictEs: "Riesgo Alto - Perfil Sospechoso de Suplantación",
        descEn: "At least two primary deepfake characteristics were flagged. While background noise or synthesis limits may slightly obscure patterns, this exhibits high traits of automated voice harvesting scams.",
        descEs: "Se identificaron al menos dos características de Deepfake. Aunque el ruido de fondo empañe los bloques, la muestra posee elementos de secuestro de voz sintética.",
        color: "text-amber-500 border-amber-500/20 bg-amber-500/5",
        statusBadge: "HIGH RISK SUSPECT",
        advicesEn: [
          "Do not supply personal names, cities of residency, or date points.",
          "Politely execute a sudden disconnect: 'I am hanging up to verify this directly.'",
          "Contact other family members to confirm whether they knew about the reported incident."
        ],
        advicesEs: [
          "No revele nombres, direcciones de residencia ni datos bancarios.",
          "Realice un descarte cortés: 'Voy a colgar el teléfono para verificar esto por otra línea privada'.",
          "Consulte con otros familiares para confirmar si tenían constancia de la supuesta situación."
        ]
      };
    } else if (threatRating >= 30) {
      return {
        verdictEn: "Moderate Risk - Social Engineering Alert",
        verdictEs: "Riesgo Moderado - Célula de Ingeniería Social",
        descEn: "Only one scam criteria was met, but exercising rigid caution remains vital. Social manipulation groups often combine human actors speaking with artificial distress templates to deceive users.",
        descEs: "Solo un criterio de fraude coincide, pero la precaución rígida sigue siendo vital. Estafadores reales combinan llamadas con clips artificiales para engañar.",
        color: "text-amber-500 border-amber-500/10 bg-amber-500/5",
        statusBadge: "PROBABLE FRAUD",
        advicesEn: [
          "Demand high-granularity private verification details.",
          "Use alternate devices to double check social media logs for active locations.",
          "Disconnect if the phone interlocutor requires rapid financial compliance."
        ],
        advicesEs: [
          "Exija datos íntimos o de anécdotas privadas con alta granularidad.",
          "Revise redes sociales en otro dispositivo para chequear las publicaciones de su familiar.",
          "Corte la comunicación si le insisten en autorizar movimientos de capital."
        ]
      };
    } else {
      return {
        verdictEn: "Low Risk - Low Synthetic Signature Pattern",
        verdictEs: "Riesgo Bajo - Patrón de Clonación No Identificado",
        descEn: "None of the specific digital deepfake voice cues or emergency extraction indicators were detected. However, never lower your guard with unsolicited phone calls.",
        descEs: "No se identificaron firmas de audio artificial ni solicitudes financieras sospechosas. Sin embargo, no comparta información privada ante de llamadas imprevistas.",
        color: "text-emerald-500 border-emerald-500/10 bg-emerald-500/5",
        statusBadge: "VERIFIED LOW CORRELATION",
        advicesEn: [
          "Confirm callers' identification credentials calmly if suspicious.",
          "Avoid answering 'Yes' or giving biometric voice approvals to open questions (e.g., 'Are you listening?').",
          "If they ask for unexpected help, hang up and coordinate directly."
        ],
        advicesEs: [
          "Confirme serenamente la identidad del emisor si le quedan dudas.",
          "Evite responder 'Sí' o conceder afirmaciones de voz a grabaciones ambiguas.",
          "Si le solicitan apoyo monetario imprevisto, coordine de forma directa por canales de confianza."
        ]
      };
    }
  };

  const verdict = getThreatVerdict();

  const handleCopyWord = () => {
    // Generate temporary standard safety word code for user
    const words = ["SHIELD_AXIS", "PINE_GLEN", "BLUE_STORM", "MINT_VERIFY", "OMEGA_ECHO", "SUMMER_SENTRY"];
    const randomWord = words[Math.floor(Date.now() / 1000000) % words.length];
    navigator.clipboard.writeText(randomWord);
    setCopiedSafetyWord(true);
    setTimeout(() => setCopiedSafetyWord(false), 2000);
  };

  const handleCopyTemplate = () => {
    const text = language === "es" 
      ? "Hola familiar, si alguna vez te llamo con una supuesta emergencia grave exigiendo dinero rápido, por favor cuelga y pídeme nuestra Palabra Familiar Segura. Si no la sé, es un Deepfake IA."
      : "Family notice: If I ever call you claiming an extreme emergency demanding quick money, immediately hang up and ask me for our Family Safety Word. If I don't know it, it's an AI audio clone. Act safe!";
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-jakarta selection:bg-brand-accent selection:text-white">
      
      {/* Top Calming Header & Breather Integration */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:text-center text-left">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
          🛡️ {language === "es" ? "DIAGNÓSTICO EN TIEMPO REAL" : "REAL-TIME CRISIS SHIELD"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-primary-text tracking-tight">
          {language === "es" ? "Asistente Contra Estafas de Voz e IA" : "AI Deepfake & Voice Scam Triage Wizard"}
        </h1>
        <p className="text-secondary-text text-sm mt-3 leading-relaxed">
          {language === "es" 
            ? "Un entorno intuitivo desarrollado para calmar la ansiedad y guiar su toma de decisiones cuando recibe llamadas de emergencia sospechosas."
            : "A high-stress diagnostic interface designed to reduce panic and analyze suspicious incoming phone calls from distressed relatives."}
        </p>

        {/* Dynamic Interactive Breathing grounder widget */}
        {showBreather && (
          <div className="mt-6 p-4 bg-brand-accent/5 rounded-2xl border border-brand-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              {/* Pulsing breathing dot widget */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-accent/20 rounded-full animate-ping" />
                <div className="absolute w-8 h-8 bg-brand-accent/30 rounded-full animate-pulse flex items-center justify-center text-brand-accent">
                  <Heart className="w-4 h-4 animate-bounce" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-text uppercase tracking-wide">
                  {language === "es" ? "GROUNDING DE SEGURIDAD MENTAL" : "MENTAL SAFETY GROUNDING"}
                </p>
                <p className="text-xs text-secondary-text mt-0.5 leading-relaxed font-sans font-medium">
                  {language === "es" ? "Los estafadores le presionan para anular su razón. Deténgase, respire con el pulso:" : "Scammers count on high urgency. Take a breath with our anchor:"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-extrabold text-brand-accent bg-[#818CF8]/10 border border-[#818CF8]/20 px-3 py-1.5 rounded-lg select-none min-w-[170px] text-center">
                {breatherText}
              </span>
              <button
                onClick={() => setShowBreather(false)}
                className="text-[10px] text-secondary-text hover:text-primary-text font-bold uppercase font-sans p-1 hover:underline cursor-pointer"
                title="Hide guide"
              >
                {language === "es" ? "Ocultar" : "Dismiss"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step-by-Step Quiz Container */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 bg-surface text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />
            
            {!isCompleted ? (
              <div>
                {/* Header indicators */}
                <div className="flex justify-between items-center mb-6 border-b border-secondary-text/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-brand-accent uppercase tracking-widest block">
                      {stepsList[currentStep].categoryEn && language === "es" ? stepsList[currentStep].categoryEs : stepsList[currentStep].categoryEn}
                    </span>
                    <h2 className="text-md font-bold text-primary-text font-display mt-0.5">
                      {stepsList[currentStep].titleEn && language === "es" ? stepsList[currentStep].titleEs : stepsList[currentStep].titleEn}
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-canvas border border-secondary-text/15 text-[10px] font-mono text-secondary-text font-bold rounded-full select-none">
                    {language === "es" ? "Paso" : "Step"} {currentStep + 1} / {stepsList.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-canvas h-1.5 rounded-full mb-8 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-accent to-indigo-400 transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / stepsList.length) * 100}%` }}
                  />
                </div>

                {/* Question Copy Section */}
                <div className="min-h-[140px] space-y-3">
                  <div className="flex gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-accent shrink-0 mt-1" />
                    <p className="text-sm sm:text-base font-bold text-primary-text leading-relaxed tracking-tight">
                      {language === "es" ? stepsList[currentStep].questionEs : stepsList[currentStep].questionEn}
                    </p>
                  </div>
                  <p className="text-xs text-secondary-text leading-relaxed font-sans font-medium pl-8">
                    {language === "es" ? stepsList[currentStep].descriptionEs : stepsList[currentStep].descriptionEn}
                  </p>
                </div>

                {/* Interactive Options Panels */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => handleAnswer(true)}
                    className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40 hover:bg-rose-500/10 cursor-pointer text-center transition-all group hover:scale-[1.02]"
                  >
                    <AlertOctagon className="w-6 h-6 text-rose-500 mx-auto mb-2 text-rose-400" />
                    <span className="block text-sm font-black text-rose-500 uppercase tracking-widest">
                      {language === "es" ? "SÍ, SE ADAPTA" : "YES, IT MATCHES"}
                    </span>
                    <span className="block text-[10px] text-rose-400/60 font-semibold mt-1 font-sans">
                      {language === "es" ? "Registra señal de fraude" : "Flags danger criteria"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAnswer(false)}
                    className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 cursor-pointer text-center transition-all group hover:scale-[1.02]"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    <span className="block text-sm font-black text-emerald-500 uppercase tracking-widest">
                      {language === "es" ? "NO COINCIDE" : "NO, UNRELATED"}
                    </span>
                    <span className="block text-[10px] text-emerald-500/60 font-semibold mt-1 font-sans">
                      {language === "es" ? "Libera este indicador" : "Normal behavior"}
                    </span>
                  </button>
                </div>

                {/* Extra Vetted Tip under the quiz */}
                <div className="mt-8 pt-4 border-t border-secondary-text/10 flex items-start gap-2.5 text-xs text-secondary-text font-sans font-medium">
                  <span className="px-2 py-0.5 bg-brand-accent/10 border border-brand-accent/20 rounded text-[9px] font-mono text-brand-accent uppercase font-extrabold select-none">
                    {language === "es" ? "CONTIENE" : "CONTEXT"}
                  </span>
                  <p className="italic leading-normal text-[11px]">
                    {language === "es" ? stepsList[currentStep].tipEs : stepsList[currentStep].tipEn}
                  </p>
                </div>

              </div>
            ) : (
              // Results Presentation screen
              <div>
                {/* Simulated Core Engine Check */}
                {audioState === "analyzing" ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mx-auto animate-spin">
                      <RefreshCw className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs mx-auto space-y-1">
                      <h3 className="text-sm font-bold text-primary-text font-mono uppercase tracking-wider">
                        {language === "es" ? "COMPILANDO DIAGNÓSTICO..." : "ANALYZING SIGNAL BLUEPRINT..."}
                      </h3>
                      <p className="text-[10px] text-secondary-text font-sans font-semibold">
                        {language === "es" ? "Mapeando amplitudes neuronales de voz en sandbox..." : "Mapping sonic frequencies of synthesis waveform..."}
                      </p>
                    </div>
                    <div className="w-48 bg-canvas h-1.5 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${audioProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  // Deep Diagnostic report output
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-secondary-text/10 pb-4">
                      <div>
                        <span className="text-[10px] text-secondary-text uppercase font-mono font-bold tracking-widest">
                          {language === "es" ? "DIAGNÓSTICO FINAL COMPILADO" : "FINAL DIAGNOSTIC VERDICT"}
                        </span>
                        <h2 className="text-lg font-bold text-primary-text font-display mt-0.5">
                          {language === "es" ? "Evaluación de Clones e Inteligencia de Estafas" : "AI Cyber Scam Triage Outcome"}
                        </h2>
                      </div>
                      <button
                        onClick={handleRestart}
                        className="px-3.5 py-1.5 rounded-lg bg-canvas hover:opacity-90 border border-secondary-text/15 text-[10px] font-mono font-extrabold text-primary-text cursor-pointer flex items-center gap-1.5 transition"
                      >
                        <RefreshCw className="w-3 h-3" /> {language === "es" ? "REINICIAR CUESTIONARIO" : "RETEST INCIDENT"}
                      </button>
                    </div>

                    {/* Threat meter panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-canvas/40 p-5 rounded-2xl border border-secondary-text/10">
                      <div className="sm:col-span-4 text-center pb-4 sm:pb-0 sm:border-r border-secondary-text/10">
                        <span className="text-[9px] text-secondary-text uppercase font-bold tracking-wider">{language === "es" ? "PROBABILIDAD AMENAZADO" : "SCAM CORRELATION SCORE"}</span>
                        <div className="text-4xl font-display font-black text-primary-text mt-1.5 font-mono">
                          <span className={threatRating >= 60 ? "text-rose-500" : "text-emerald-500"}>
                            {threatRating}%
                          </span>
                        </div>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded border mt-2 font-mono font-black ${
                          threatRating === 100 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                          threatRating >= 60 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                        }`}>
                          {verdict.statusBadge}
                        </span>
                      </div>

                      <div className="sm:col-span-8 text-left space-y-1">
                        <h3 className="text-sm font-bold text-primary-text flex items-center gap-1.5">
                          <ShieldAlert className={`w-4 h-4 shrink-0 ${threatRating >= 60 ? "text-rose-500" : "text-emerald-500"}`} />
                          {language === "es" ? verdict.verdictEs : verdict.verdictEn}
                        </h3>
                        <p className="text-[11.5px] text-secondary-text leading-relaxed font-sans font-medium">
                          {language === "es" ? verdict.descEs : verdict.descEn}
                        </p>
                      </div>
                    </div>

                    {/* Highly actionable steps based on user response */}
                    <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/25 space-y-3">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold text-brand-accent uppercase block">
                        🛡️ {language === "es" ? "PROTOCOLO CORTAFUEGOS INMEDIATO" : "IMMEDIATE PROTECTION PROTOCOL"}
                      </span>
                      <ul className="space-y-2.5 font-sans">
                        {(language === "es" ? verdict.advicesEs : verdict.advicesEn).map((advice, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-primary-text font-semibold items-start leading-relaxed">
                            <span className="w-5 h-5 rounded bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-[10px] text-brand-accent font-mono font-extrabold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prompt, Static emergency action card under the answers block */}
          <div className="p-6 rounded-2xl border bg-surface/50 glow-border-brand text-left font-sans">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent animate-pulse shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-accent">
                  {language === "es" ? "MEDIDAS DE SEGURIDAD ESTÁTICAS DE EMERGENCIA" : "CRITICAL STATIC EMERGENCY ACTION CARD"}
                </span>
                <h3 className="text-sm font-bold text-primary-text uppercase tracking-wider font-display leading-tight mt-0.5">
                  {language === "es" ? "Regla De Oro Para Sospechas De Secuestro De Voz" : "Incoming Emergency Scam Golden Rules"}
                </h3>
              </div>
            </div>

            <p className="text-xs text-secondary-text leading-relaxed font-medium mb-4">
              {language === "es"
                ? "Las llamadas fraudulentas de urgencia emocional son calculadas para forzar el pánico. Al memorizar y apegarse rígidamente a estas tres reglas estáticas, inutiliza el 100% de los ataques de clonación cibernética:"
                : "Emergency voice cloning scams rely entirely on shock factor and speed. Committing these baseline safety rules to memory renders artificial extortion vectors harmless instantly:"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-3 bg-canvas border border-secondary-text/10 rounded-xl space-y-1">
                <span className="text-rose-500 font-extrabold font-mono text-[9px] uppercase tracking-wider block">
                  1. {language === "es" ? "COLGAR AL INSTANTE" : "HANG UP ENTIRELY"}
                </span>
                <p className="text-[11px] text-secondary-text leading-relaxed font-medium">
                  {language === "es"
                    ? "Incluso si amenazan con consecuencias terribles. El canal de control se rompe al colgar."
                    : "No matter how catastrophic the threat. Control networks break entirely when the call terminates."}
                </p>
              </div>

              <div className="p-3 bg-canvas border border-secondary-text/10 rounded-xl space-y-1">
                <span className="text-brand-accent font-extrabold font-mono text-[9px] uppercase tracking-wider block">
                  2. {language === "es" ? "LLAMAR POR VÍA SEGURA" : "TRUST LOCAL CONTACTS"}
                </span>
                <p className="text-[11px] text-secondary-text leading-relaxed font-medium">
                  {language === "es"
                    ? "Llame al familiar utilizando su número de teléfono guardado normalmente, nunca el del llamante."
                    : "Use saved phone agenda profiles to reach the family member, never dial back the sender's details."}
                </p>
              </div>

              <div className="p-3 bg-canvas border border-secondary-text/10 rounded-xl space-y-1">
                <span className="text-emerald-500 font-extrabold font-mono text-[9px] uppercase tracking-wider block">
                  3. {language === "es" ? "PEDIR LA PALABRA" : "CHALLENGE KEYWORD"}
                </span>
                <p className="text-[11px] text-secondary-text leading-relaxed font-medium">
                  {language === "es"
                    ? "Solicite de inmediato la palabra secreta de la familia para validar la identidad."
                    : "Demand the custom predetermined safety palabra to immediately confirm caller identity metrics."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Info Panel with Family Safeguard Generators */}
        <div className="lg:col-span-4 space-y-6 text-left font-sans">
          
          {/* Animated Interactive Voice Waveform visualizer */}
          <div className="p-5 rounded-2xl border border-secondary-text/10 bg-surface/80 text-left relative overflow-hidden">
            <h3 className="text-xs font-black text-primary-text uppercase tracking-widest leading-none mb-1 font-display">
              {language === "es" ? "ESPECTRO VOCAL SINTÉTICO (DEMO)" : "SYNTHETIC VOICE INTERCEPTOR (DEMO)"}
            </h3>
            <p className="text-[10px] text-secondary-text leading-relaxed font-medium mb-4">
              {language === "es"
                ? "Usa esto para visualizar la diferencia de texturas entre modulaciones humanas y clonaciones sintetizadas mediante algoritmos de IA."
                : "Visualize visual acoustic pacing differences between natural organic breathing voices vs voicepacks generated via machine learning."}
            </p>

            {/* Simulated Voice wave grid bars animating */}
            <div className="h-16 flex items-end justify-center gap-1 bg-canvas rounded-xl p-3 mb-3 border border-secondary-text/10 overflow-hidden relative">
              <span className="absolute top-2 left-2 text-[8px] font-mono font-bold text-brand-accent tracking-wider grayscale uppercase opacity-75">
                {audioState === "analyzing" ? (language === "es" ? "Escanendo..." : "Scanning...") : audioState === "scam_vector" ? "RISK VECTOR IDENTIFIED" : "IDLE"}
              </span>

              {/* Multiple bars animating with transition delays */}
              <div className={`w-1 bg-brand-accent ${audioState === "analyzing" ? "h-12 animate-pulse" : audioState === "scam_vector" ? "h-6 bg-rose-500 animate-bounce" : "h-2"}`} />
              <div className={`w-1 bg-brand-accent ${audioState === "analyzing" ? "h-10 animate-pulse" : audioState === "scam_vector" ? "h-8 bg-rose-400 animate-pulse" : "h-3"}`} style={{ animationDelay: "150px" }} />
              <div className={`w-1 bg-indigo-500 ${audioState === "analyzing" ? "h-6 animate-pulse" : audioState === "scam_vector" ? "h-10 bg-rose-500 animate-bounce" : "h-2"}`} style={{ animationDelay: "300px" }} />
              <div className={`w-1 bg-indigo-400 ${audioState === "analyzing" ? "h-12 animate-pulse" : audioState === "scam_vector" ? "h-7 bg-rose-500 animate-pulse" : "h-4"}`} style={{ animationDelay: "120px" }} />
              <div className={`w-1 bg-brand-accent ${audioState === "analyzing" ? "h-8 animate-pulse" : audioState === "scam_vector" ? "h-12 bg-rose-600 animate-bounce" : "h-1.5"}`} style={{ animationDelay: "240px" }} />
              <div className={`w-1 bg-indigo-500 ${audioState === "analyzing" ? "h-10 animate-pulse" : audioState === "scam_vector" ? "h-5 bg-rose-500 animate-pulse" : "h-3"}`} style={{ animationDelay: "450px" }} />
              <div className={`w-1 bg-brand-accent ${audioState === "analyzing" ? "h-4 animate-pulse" : audioState === "scam_vector" ? "h-9 bg-rose-400 animate-bounce" : "h-2"}`} style={{ animationDelay: "350px" }} />
              <div className={`w-1 bg-indigo-400 ${audioState === "analyzing" ? "h-12 animate-pulse" : audioState === "scam_vector" ? "h-11 bg-rose-500 animate-pulse" : "h-5"}`} style={{ animationDelay: "200px" }} />
            </div>

            <div className="flex gap-2 text-[10px] justify-between text-secondary-text border-t border-secondary-text/5 pt-3">
              <span className="font-mono flex items-center gap-1 font-bold">
                <Volume2 className="w-3 h-3 text-brand-accent" />
                PCM 16kHZ
              </span>
              <span className="font-mono flex items-center gap-1 font-bold">
                <VolumeX className="w-3 h-3 text-rose-500" />
                {language === "es" ? "Algoritmo Resonador" : "Synthesis Filter"}
              </span>
            </div>
          </div>

          {/* Safe word and family protection tool */}
          <div className="p-5 rounded-2xl border border-secondary-text/10 bg-surface/50 text-left space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-primary-text uppercase tracking-widest font-display">
                {language === "es" ? "Kit De Palabra Familiar Segura" : "Family Safe-Word Toolkit"}
              </h3>
              <p className="text-[10px] text-secondary-text leading-relaxed font-medium">
                {language === "es"
                  ? "Establezca una palabra secreta privada y compártala hoy de manera segura con sus padres, hijos o parejas."
                  : "Help shield vulnerable elders and family networks by distributing an isolated pre-shared secret key today."}
              </p>
            </div>

            {/* Generate & Copy Safe Word button */}
            <button
              onClick={handleCopyWord}
              className="w-full py-2.5 px-3 bg-canvas hover:bg-canvas/80 rounded-xl border border-secondary-text/15 text-xs text-primary-text font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                {language === "es" ? "Obtener Palabra Aleatoria" : "Get Random Token Code"}
              </span>
              {copiedSafetyWord ? (
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 select-none">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-secondary-text" />
              )}
            </button>

            {/* SMS broadcast share invitation template */}
            <div className="p-3.5 bg-canvas/45 border border-secondary-text/10 rounded-xl text-[10px] leading-relaxed relative">
              <span className="text-[8px] font-mono bg-indigo-500/10 border border-indigo-500/25 text-brand-accent font-bold px-1.5 py-0.5 rounded uppercase tracking-wider block mb-1.5 w-max">
                {language === "es" ? "Plantilla SMS Familiar de Concientización" : "Family Awareness SMS Template"}
              </span>
              <p className="text-secondary-text italic select-none">
                {language === "es"
                  ? '"Hola familiar, si alguna vez te llamo con una supuesta emergencia grave exigiendo dinero rápido, por favor cuelga y pídeme nuestra Palabra Familiar Segura..."'
                  : '"Family notice: If I ever call you claiming an extreme emergency demanding quick money, immediately hang up and ask me for our Family Safety Word..."'}
              </p>
              
              <button
                onClick={handleCopyTemplate}
                className="mt-2.5 w-full py-1.5 bg-brand-accent hover:opacity-95 text-white font-bold rounded-lg text-[9px] flex items-center justify-center gap-1 transition cursor-pointer"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-2.5 h-2.5" /> {language === "es" ? "Copiado!" : "Copied Template!"}
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" /> {language === "es" ? "Copiar Mensaje Para Enviar" : "Copy Alert SMS Text"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Global consumer guides callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-secondary-text/10 text-left font-sans text-xs space-y-2.5">
            <h4 className="font-bold text-primary-text leading-tight font-display text-xs">
              {language === "es" ? "¿Aún tienes dudas de la llamada?" : "Still uncertain if the voice is cloned?"}
            </h4>
            <p className="text-[11px] text-secondary-text leading-relaxed font-semibold font-sans">
              {language === "es"
                ? "Las llamadas de suplantación digital son extremadamente persuasivas. Si el interlocutor se niega a colgar el teléfono bajo ninguna circunstancia, está lidiando con un scammer profesional de alta presión."
                : "Digital cloning attacks bypass human suspicion patterns through shock value. If the caller refuses to allow a quick 2-minute hang up protocol, you are dealing with a professional extortion network."}
            </p>
            <div className="flex gap-2">
              <a 
                href="https://www.fcc.gov/consumer-alerts-active" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] font-mono font-bold text-brand-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                {language === "es" ? "Ver Alertas de la FCC" : "Browse FCC Alerts"}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
