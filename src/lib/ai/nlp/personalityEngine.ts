/**
 * AI Personality Engine for Natural Language Processing
 */

export interface Personality {
  id: string;
  name: string;
  description: string;
  traits: PersonalityTraits;
  communicationStyle: CommunicationStyle;
  expertise: string[];
  interests: string[];
  vocabulary: VocabularyProfile;
  responsePatterns: ResponsePattern[];
  adaptability: number; // 0-1 scale, how much the personality adapts to user
}

export interface PersonalityTraits {
  // Big Five personality traits (0-1 scale)
  openness: number; // curiosity, creativity, openness to new experiences
  conscientiousness: number; // organization, thoroughness, reliability
  extraversion: number; // sociability, assertiveness, energy
  agreeableness: number; // cooperation, compassion, warmth
  neuroticism: number; // sensitivity, anxiety, emotional reactivity
  
  // Additional traits
  humor: number; // sense of humor, 0-1 scale
  formality: number; // formal vs casual, 0-1 scale
  patience: number; // patience level, 0-1 scale
  empathy: number; // empathy level, 0-1 scale
  confidence: number; // confidence level, 0-1 scale
}

export interface CommunicationStyle {
  verbosity: number; // 0-1 scale, how verbose responses are
  directness: number; // 0-1 scale, how direct vs indirect
  complexity: number; // 0-1 scale, simple vs complex language
  politeness: number; // 0-1 scale, how polite
  enthusiasm: number; // 0-1 scale, how enthusiastic
  questionFrequency: number; // 0-1 scale, how often asks questions
  personalPronounUsage: number; // 0-1 scale, how often uses "I", "me", etc.
  metaphorUsage: number; // 0-1 scale, how often uses metaphors/analogies
  emotionalExpressiveness: number; // 0-1 scale, how emotionally expressive
}

export interface VocabularyProfile {
  formalWords: string[];
  casualWords: string[];
  technicalTerms: string[];
  idioms: string[];
  fillerPhrases: string[];
  transitionPhrases: string[];
  emphasisPhrases: string[];
}

export interface ResponsePattern {
  type: string; // e.g., "greeting", "explanation", "apology", etc.
  templates: string[];
  conditions?: {
    userSentiment?: "positive" | "negative" | "neutral";
    userExpertise?: "novice" | "intermediate" | "expert";
    topicCategory?: string;
    contextualTriggers?: string[];
  };
}

export interface PersonalityContext {
  userId: string;
  sessionId: string;
  activePersonality: Personality;
  userProfile: {
    expertise: Record<string, number>; // Topic to expertise level (0-1)
    interests: Record<string, number>; // Topic to interest level (0-1)
    communicationPreferences: Partial<CommunicationStyle>;
    sentimentHistory: Array<{ timestamp: Date; sentiment: number }>; // -1 to 1
    lastInteraction: Date;
  };
  adaptations: {
    verbosityAdjustment: number; // -1 to 1
    complexityAdjustment: number; // -1 to 1
    formalityAdjustment: number; // -1 to 1
    enthusiasmAdjustment: number; // -1 to 1
    humorAdjustment: number; // -1 to 1
  };
  lastUpdated: Date;
}

class PersonalityEngine {
  private personalities = new Map<string, Personality>();
  private contexts = new Map<string, PersonalityContext>();
  private storageKey = "captivite_personality_contexts";
  
  constructor() {
    // Initialize with default personalities
    this.initializeDefaultPersonalities();
    
    // Load personality contexts from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedContexts = localStorage.getItem(this.storageKey);
        if (storedContexts) {
          const parsedContexts = JSON.parse(storedContexts);
          Object.entries(parsedContexts).forEach(([sessionId, context]: [string, any]) => {
            // Convert string dates back to Date objects
            context.lastUpdated = new Date(context.lastUpdated);
            context.userProfile.lastInteraction = new Date(context.userProfile.lastInteraction);
            context.userProfile.sentimentHistory = context.userProfile.sentimentHistory.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp)
            }));
            this.contexts.set(sessionId, context as PersonalityContext);
          });
        }
      } catch (error) {
        console.error("Failed to load personality contexts from storage:", error);
      }
    }
  }

  /**
   * Initialize default AI personalities
   */
  private initializeDefaultPersonalities(): void {
    // Professional Assistant Personality
    const professionalAssistant: Personality = {
      id: "professional",
      name: "Professional Assistant",
      description: "A formal, efficient, and knowledgeable assistant focused on providing accurate and helpful information in a professional manner.",
      traits: {
        openness: 0.7,
        conscientiousness: 0.9,
        extraversion: 0.5,
        agreeableness: 0.8,
        neuroticism: 0.2,
        humor: 0.3,
        formality: 0.8,
        patience: 0.9,
        empathy: 0.7,
        confidence: 0.8
      },
      communicationStyle: {
        verbosity: 0.6,
        directness: 0.8,
        complexity: 0.7,
        politeness: 0.9,
        enthusiasm: 0.5,
        questionFrequency: 0.4,
        personalPronounUsage: 0.3,
        metaphorUsage: 0.4,
        emotionalExpressiveness: 0.3
      },
      expertise: ["business", "technology", "productivity", "research", "data analysis"],
      interests: ["efficiency", "organization", "problem-solving", "professional development"],
      vocabulary: {
        formalWords: ["utilize", "implement", "facilitate", "optimize", "leverage", "strategize"],
        casualWords: ["use", "do", "help", "improve", "work"],
        technicalTerms: ["analytics", "methodology", "framework", "infrastructure", "protocol"],
        idioms: ["best practices", "moving forward", "touch base", "circle back", "deep dive"],
        fillerPhrases: ["In addition", "Furthermore", "Moreover", "Additionally"],
        transitionPhrases: ["With respect to", "Regarding", "Concerning", "In terms of"],
        emphasisPhrases: ["It's important to note", "Significantly", "Particularly", "Especially"]
      },
      responsePatterns: [
        {
          type: "greeting",
          templates: [
            "Hello, how may I assist you today?",
            "Good day. How can I help you?",
            "Welcome. What can I help you with today?"
          ]
        },
        {
          type: "explanation",
          templates: [
            "Let me explain this clearly. {explanation}",
            "Here's a detailed explanation: {explanation}",
            "To clarify this matter: {explanation}"
          ]
        },
        {
          type: "apology",
          templates: [
            "I apologize for the inconvenience. {resolution}",
            "I'm sorry for any confusion. {resolution}",
            "Please accept my apologies. {resolution}"
          ]
        }
      ],
      adaptability: 0.6
    };
    
    // Friendly Guide Personality
    const friendlyGuide: Personality = {
      id: "friendly-guide",
      name: "Friendly Guide",
      description: "A warm and helpful guide who makes complex topics approachable",
      traits: {
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.6,
        agreeableness: 0.9,
        neuroticism: 0.2,
        humor: 0.5,
        formality: 0.3,
        patience: 0.8,
        empathy: 0.9,
        confidence: 0.7
      },
      communicationStyle: {
        verbosity: 0.6,
        directness: 0.7,
        complexity: 0.4,
        politeness: 0.8,
        enthusiasm: 0.7,
        questionFrequency: 0.5,
        personalPronounUsage: 0.6,
        metaphorUsage: 0.5,
        emotionalExpressiveness: 0.7
      },
      expertise: ["general knowledge", "problem solving", "communication"],
      interests: ["helping others", "learning", "technology"],
      vocabulary: {
        formalWords: ["assist", "guide", "support"],
        casualWords: ["hey", "cool", "awesome"],
        technicalTerms: ["feature", "function", "system"],
        idioms: ["on the same page", "in a nutshell", "at your fingertips"],
        fillerPhrases: ["you know", "I mean", "basically"],
        transitionPhrases: ["by the way", "speaking of", "in addition"],
        emphasisPhrases: ["definitely", "absolutely", "certainly"]
      },
      responsePatterns: [
        {
          type: "greeting",
          templates: [
            "Hi there! How can I help you today?",
            "Hello! What can I do for you?",
            "Hey! I'm here to help. What's on your mind?"
          ]
        },
        {
          type: "explanation",
          templates: [
            "Let me break this down for you...",
            "Here's how it works...",
            "I'll explain this step by step..."
          ]
        }
      ],
      adaptability: 0.7
    };
  }
}
