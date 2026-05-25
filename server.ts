import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for screenshot uploads / OCR analyses
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in the Secrets panel in AI Studio Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: "ok",
    hasGeminiKey: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// 2. Scam analysis endpoint (Texts, URLs, and Screenshot Analyses)
app.post("/api/analyze", async (req, res) => {
  try {
    const { type, content, screenshotBase64, mimeType } = req.body;
    const ai = getAIClient();

    let contents: any[] = [];
    let systemInstruction = "You are a world-class cybersecurity analysis system designed to detect scams, fraud, phishing, and online threats.";

    if (type === "screenshot" && screenshotBase64) {
      // Analyze screenshot inline data
      contents.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: screenshotBase64.split(",")[1] || screenshotBase64,
        },
      });
      contents.push({
        text: `Analyze this screen capture/image for cybersecurity threats, phishing attempts, fake UPI/payment confirmation screenshots, impersonation chats, WhatsApp scams, or malicious links.
Extract any text present inside the image and perform an intense safety analysis on those contents.
Identify fake elements, suspicious visual alerts, phishing language, urgency, fear tactics, grammar inconsistencies, or fake branding.
Return a structured review matching the requested database schema.`
      });
    } else if (type === "url") {
      contents.push({
        text: `Analyze this suspicious URL/domain: "${content}".
Examine it for signs of phishing, typosquatting (resembling famous companies or bank domains), shortened redirect patterns, suspicious keywords (like login, verify, free_gift, reward, banking), or urgent activation hooks.
Provide a definitive safety index and security overview.`
      });
    } else {
      // General messaging/email text
      contents.push({
        text: `Analyze this suspicious message or email text:
---
${content}
---
Verify if it is a phishing attempt, coupon scam, job scam, lottery scam, fake bank alert, premium customer support scheme, OTP request fraud, or social engineering attempt.
Identify: urgency triggers, suspicious urgency/fear keywords, fake transfer alerts, request for sensitive authentication, or links.`
      });
    }

    // Call Gemini with strict JSON output schema
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: {
              type: Type.INTEGER,
              description: "The percentage rating of danger/scam risk from 0 (completely safe) to 100 (confirmed malicious scam).",
            },
            status: {
              type: Type.STRING,
              description: "One of: 'SAFE', 'WARNING', or 'DANGEROUS'.",
              enum: ["SAFE", "WARNING", "DANGEROUS"],
            },
            threatCategory: {
              type: Type.STRING,
              description: "The exact category of scam flagged (e.g., 'Phishing Link', 'Fake UPI screenshot', 'Fake Job Scam', 'SMS Fraud', 'OTP Impersonation', 'Fake Support', 'None').",
            },
            confidence: {
              type: Type.INTEGER,
              description: "AI's confidence percentage in this analysis from 0 to 100.",
            },
            explanation: {
              type: Type.STRING,
              description: "A professional, rich detailed breakdown explaining why the threat represents a risk, what scam tactics were deployed (urgency, reward, fear), or why it's safe.",
            },
            detectedFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of specific scam identifiers or suspicious patterns flagged (e.g., 'Urgent demand for action', 'Non-standard domain name', 'Requests sensitive credentials', 'Manipulative grammar').",
            },
            safetyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable concrete steps for the user to safeguard themselves immediately.",
            },
            highlightedPhrases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Phases or words in the analyzed content that triggered red flags.",
            },
          },
          required: [
            "riskScore",
            "status",
            "threatCategory",
            "confidence",
            "explanation",
            "detectedFlags",
            "safetyRecommendations",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Analysis Error Details:", error);
    res.status(500).json({
      error: error.message || "Visual analysis pipeline failed",
      details: "Check your GEMINI_API_KEY environment variable and settings.",
    });
  }
});

// 3. ShieldBot AI Cybersecurity Expert Assistant Response Route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const ai = getAIClient();

    // Prepare message history formatted for Gemini SDK
    // ShieldBot identity
    const systemInstruction = `You are "ShieldBot", a state-of-the-art interactive AI cybersecurity assistant and safety guardian.
Your purpose is to answer users' live queries about cyber fraud, phishing risks, credential safety, WhatsApp scams, fake payment setups, UPI security, malware traps, password policies, and digital threat prevention.
- Keep your tone futuristic, reassuring, friendly, highly defensive, and expert.
- Format all your answers beautifully with markdown headers, clean bullet points, and code block definitions of scam templates where applicable.
- Give highly practical advice on how to lock insecure accounts or recover from scam interactions.
- Provide direct and alert feedback. Avoid generic disclaimers. Speak like a premium security architect.`;

    // Map incoming array of message objects to Gemini SDK generateContent format:
    // User messages are mapped into correct prompt format
    const lastUserMessage = messages[messages.length - 1]?.content || "Hello";
    
    // Feed contextual history to Gemini to generate context-rich replies
    const chatContents = messages.map((m: any) => `${m.role === "user" ? "User" : "ShieldBot"}: ${m.content}`).join("\n") + "\nShieldBot:";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "I was unable to analyze this safety vector. Please verify your scam context and try again.",
    });
  } catch (error: any) {
    console.error("ChatBot Error Details:", error);
    res.status(500).json({
      error: error.message || "ShieldBot synthesis module failed",
      reply: "ShieldBot is momentarily recalibrating. Connect with sandbox settings shortly.",
    });
  }
});

// 4. Safe Threat Feed & Trending Cyber News feed API
app.get("/api/news", (req, res) => {
  // Feed dynamic simulated active threats
  res.json({
    timestamp: new Date().toISOString(),
    scamsActiveToday: 1429,
    globalIntegrityScale: "8.4/10",
    activeScams: [
      {
        id: "tr-109",
        title: "Fake FedEx SMS Package Track Delivery",
        severity: "HIGH",
        category: "SMS Phishing",
        trendingDelta: "+48%",
        targetDemographic: "General logistics receivers",
        details: "Users receive SMS alerts saying package status requires active tax/credential validation at premium short domain links.",
        prevention: "Do not visit short links. Track FedEx packages directly from key courier databases."
      },
      {
        id: "tr-110",
        title: "False Customer Support Refund Toll",
        severity: "CRITICAL",
        category: "Phone Vishing / OTP",
        trendingDelta: "+12%",
        targetDemographic: "Retails shoppers",
        details: "Urgent toll representatives claim customer payment requires refund reversal via OTP exchange.",
        prevention: "Banks or retailers never solicit OTP passwords over secondary calls."
      },
      {
        id: "tr-111",
        title: "Phishing: Fake Corporate Appraisal Portal",
        severity: "HIGH",
        category: "Corporate Phishing",
        trendingDelta: "+160%",
        targetDemographic: "Corporate employees",
        details: "Fake internal HR portals prompt employee logins to view non-existent mid-year appraisals.",
        prevention: "Check email sender addresses and look for correct enterprise sub-domains."
      },
      {
        id: "tr-112",
        title: "UPI Scams / Fake Payment Confirmation Visuals",
        severity: "MEDIUM",
        category: "Payment Screenshot Scam",
        trendingDelta: "+25%",
        targetDemographic: "Local digital merchants",
        details: "Scammers show visual proof of transaction success with altered font faces or false timestamp metadata.",
        prevention: "Validate bank ledger notifications instead of scanning visual proof."
      }
    ]
  });
});

// 5. Setup Vite Middleware / Static Files serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VigilantEye AI App Node Server] booted online on port ${PORT}`);
  });
}

bootstrap();
