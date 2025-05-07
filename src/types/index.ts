// Common types used across the application
export type AllowedTone = "professional" | "friendly" | "casual" | "formal" | "empathetic";
export type AllowedPace = "medium" | "slow" | "fast";
export type AllowedVocabulary = "standard" | "simple" | "advanced";

export interface PhoneAgentConfig {
  id: string;
  name: string;
  voice: {
    gender: "neutral" | "female" | "male";
    pitch: number;
    rate: number;
  };
  personality: {
    tone: AllowedTone;
    pace: AllowedPace;
    vocabulary: AllowedVocabulary;
  };
  compliance: {
    recordingDisclosure: boolean;
    dataPrivacyStatements: string[];
    requiredDisclosures: string[];
    prohibitedPhrases: string[];
    sensitiveTopics: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  filtering?: {
    inputFilters: string[];
    outputFilters: string[];
    realTimeFiltering: boolean;
    sensitivityLevel: number;
  };
  capabilities?: {
    languages: string[];
    canTransferToHuman: boolean;
    canSendSMS: boolean;
    canSendEmail: boolean;
    canScheduleCallback: boolean;
    canProcessPayments: boolean;
  };
  metrics?: {
    trackCallDuration: boolean;
    trackSentiment: boolean;
    trackResolution: boolean;
    trackTransferRate: boolean;
  };
}

export interface CallMonitorConfig {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Call {
  id: string;
  phoneNumber: string;
  status: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  callerId?: string;
}

export interface CallSession extends Call {
  agentId: string;
  recordingUrl?: string;
  transcript?: Array<{
    speaker: string;
    text: string;
    timestamp: Date;
  }>;
  metrics?: {
    averageSentiment?: number;
    resolved?: boolean;
    escalated?: boolean;
    intentRecognized?: boolean;
  };
}

export interface Alert {
  id: string;
  type: string;
  severity: "high" | "medium" | "low" | "critical";
  message: string;
  timestamp: Date;
  status: "active" | "resolved" | "new" | "acknowledged";
  callId?: string;
}

export interface Batch {
  id: string;
  name: string;
  status: string;
  progress: number;
  total: number;
  completed: number;
  failed: number;
  startTime: Date;
  endTime?: Date;
}

export interface Review {
  id: string;
  rating: number;
  sentiment: string;
  status: string;
  content: string;
  author?: string;
  date?: Date;
  source?: string;
  response?: string;
  responseDate?: Date;
}

export interface Template {
  id: string;
  name: string;
  content: string;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 