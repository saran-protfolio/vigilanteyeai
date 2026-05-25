export interface ScanReport {
  id: string;
  timestamp: string;
  type: "text" | "url" | "screenshot";
  contentAnalyzed: string;
  riskScore: number; // 0 to 100
  status: "SAFE" | "WARNING" | "DANGEROUS";
  threatCategory: string;
  confidence: number;
  explanation: string;
  detectedFlags: string[];
  safetyRecommendations: string[];
  highlightedPhrases?: string[];
  userId?: string;
  saved?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ThreatIntelAlert {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: string;
  trendingDelta: string;
  targetDemographic: string;
  details: string;
  prevention: string;
  reportedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  cyberSafetyScoreList: number[]; // track historic scores
  registeredAt: string;
  scansCount: number;
}

export interface EduTopic {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  description: string;
  impactLevel: "HIGH" | "CRITICAL" | "MEDIUM";
  redFlags: string[];
  realExample: string;
  safetyGuides: string[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  scenario: string;
  choices: { text: string; rationale: string; isCorrect: boolean }[];
}
