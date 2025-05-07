/**
 * Emotion Detection System for Natural Language Processing
 */

import { auditLogger } from "../../auth/audit";

export interface EmotionAnalysis {
  primary: {
    emotion: Emotion;
    score: number; // 0 to 1
    confidence: number; // 0 to 1
  };
  secondary?: {
    emotion: Emotion;
    score: number; // 0 to 1
    confidence: number; // 0 to 1
  };
  overall: {
    valence: number; // -1 to 1 (negative to positive)
    arousal: number; // 0 to 1 (calm to excited)
    dominance: number; // 0 to 1 (submissive to dominant)
  };
  details: {
    emotion: Emotion;
    score: number; // 0 to 1
  }[];
}

export interface EmotionHistory {
  userId: string;
  sessionId: string;
  history: {
    timestamp: Date;
    text: string;
    analysis: EmotionAnalysis;
  }[];
  baseline?: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  lastUpdated: Date;
}

export interface EmotionShift {
  from: Emotion;
  to: Emotion;
  magnitude: number; // 0 to 1
  valenceChange: number; // -2 to 2
  arousalChange: number; // -1 to 1
  dominanceChange: number; // -1 to 1
}

export interface EmpatheticResponse {
  text: string;
  strategy: EmpatheticStrategy;
  targetEmotion?: Emotion;
  confidence: number;
}

export type Emotion =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "disgust"
  | "surprise"
  | "trust"
  | "anticipation"
  | "confusion"
  | "frustration"
  | "satisfaction"
  | "gratitude"
  | "curiosity"
  | "neutral";

export type EmpatheticStrategy =
  | "acknowledge"
  | "validate"
  | "mirror"
  | "reframe"
  | "distract"
  | "support"
  | "encourage"
  | "calm"
  | "neutral";

class EmotionDetector {
  private emotionHistories = new Map<string, EmotionHistory>();
  private storageKey = "captivite_emotion_histories";

  // Emotion lexicons - words associated with each emotion
  private emotionLexicons: Record<Emotion, string[]> = {
    joy: [
      "happy",
      "delighted",
      "pleased",
      "glad",
      "joyful",
      "excited",
      "thrilled",
      "wonderful",
      "fantastic",
      "great",
      "excellent",
      "amazing",
      "love",
      "enjoy",
      "celebrate",
      "cheerful",
      "content",
      "satisfied",
    ],
    sadness: [
      "sad",
      "unhappy",
      "depressed",
      "miserable",
      "heartbroken",
      "gloomy",
      "disappointed",
      "upset",
      "down",
      "blue",
      "melancholy",
      "grief",
      "sorrow",
      "regret",
      "despair",
      "hopeless",
      "lonely",
    ],
    anger: [
      "angry",
      "mad",
      "furious",
      "outraged",
      "annoyed",
      "irritated",
      "frustrated",
      "enraged",
      "hostile",
      "bitter",
      "hate",
      "resent",
      "indignant",
      "offended",
      "provoked",
      "infuriated",
    ],
    fear: [
      "afraid",
      "scared",
      "frightened",
      "terrified",
      "anxious",
      "worried",
      "nervous",
      "panicked",
      "alarmed",
      "concerned",
      "uneasy",
      "apprehensive",
      "dread",
      "horror",
      "panic",
      "terror",
    ],
    disgust: [
      "disgusted",
      "revolted",
      "repulsed",
      "sickened",
      "appalled",
      "horrified",
      "aversion",
      "distaste",
      "repugnance",
      "loathing",
      "abhorrence",
      "repelled",
      "nauseated",
    ],
    surprise: [
      "surprised",
      "amazed",
      "astonished",
      "shocked",
      "startled",
      "stunned",
      "bewildered",
      "dumbfounded",
      "flabbergasted",
      "speechless",
      "unexpected",
      "sudden",
      "wonder",
    ],
    trust: [
      "trust",
      "believe",
      "confident",
      "faith",
      "assured",
      "certain",
      "reliance",
      "dependence",
      "conviction",
      "credence",
      "rely",
      "count on",
      "trustworthy",
      "reliable",
    ],
    anticipation: [
      "anticipate",
      "expect",
      "await",
      "look forward",
      "hope",
      "eager",
      "excited",
      "suspense",
      "waiting",
      "foresee",
      "predict",
      "prospect",
      "upcoming",
    ],
    confusion: [
      "confused",
      "puzzled",
      "perplexed",
      "baffled",
      "uncertain",
      "unsure",
      "unclear",
      "ambiguous",
      "bewildered",
      "disoriented",
      "lost",
      "muddled",
      "mystified",
    ],
    frustration: [
      "frustrated",
      "thwarted",
      "defeated",
      "blocked",
      "hindered",
      "foiled",
      "obstructed",
      "impeded",
      "stymied",
      "exasperated",
      "vexed",
      "annoyed",
      "irritated",
    ],
    satisfaction: [
      "satisfied",
      "pleased",
      "content",
      "fulfilled",
      "gratified",
      "contented",
      "comfortable",
      "adequate",
      "sufficient",
      "enough",
      "acceptable",
      "pleased",
    ],
    gratitude: [
      "grateful",
      "thankful",
      "appreciative",
      "indebted",
      "obliged",
      "beholden",
      "recognition",
      "acknowledgment",
      "thanks",
      "appreciation",
      "gratefulness",
      "thank you",
    ],
    curiosity: [
      "curious",
      "interested",
      "inquisitive",
      "intrigued",
      "fascinated",
      "wonder",
      "questioning",
      "inquiring",
      "probing",
      "exploring",
      "investigating",
      "nosy",
    ],
    neutral: [
      "okay",
      "fine",
      "alright",
      "neutral",
      "indifferent",
      "impartial",
      "unbiased",
      "dispassionate",
      "detached",
      "uninvolved",
      "disinterested",
      "noncommittal",
    ],
  };

  // Emotion intensifiers - words that increase the intensity of emotions
  private intensifiers = [
    "very",
    "extremely",
    "incredibly",
    "really",
    "so",
    "absolutely",
    "completely",
    "totally",
    "utterly",
    "deeply",
    "profoundly",
    "immensely",
    "tremendously",
    "exceedingly",
  ];

  // Emotion diminishers - words that decrease the intensity of emotions
  private diminishers = [
    "somewhat",
    "slightly",
    "a bit",
    "a little",
    "kind of",
    "sort of",
    "rather",
    "fairly",
    "moderately",
    "mildly",
    "partially",
    "barely",
    "hardly",
    "scarcely",
  ];

  // Negations - words that negate emotions
  private negations = [
    "not",
    "no",
    "never",
    "none",
    "neither",
    "nor",
    "nothing",
    "nowhere",
    "nobody",
    "isn't",
    "aren't",
    "wasn't",
    "weren't",
    "don't",
    "doesn't",
    "didn't",
    "can't",
    "couldn't",
    "shouldn't",
    "wouldn't",
    "haven't",
    "hasn't",
    "hadn't",
  ];

  constructor() {
    // Load emotion histories from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedHistories = localStorage.getItem(this.storageKey);
        if (storedHistories) {
          const parsedHistories = JSON.parse(storedHistories);
          Object.entries(parsedHistories).forEach(
            ([sessionId, history]: [string, any]) => {
              // Convert string dates back to Date objects
              history.lastUpdated = new Date(history.lastUpdated);
              history.history = history.history.map((item: any) => ({
                ...item,
                timestamp: new Date(item.timestamp),
              }));
              this.emotionHistories.set(sessionId, history as EmotionHistory);
            },
          );
        }
      } catch (error) {
        console.error("Failed to load emotion histories from storage:", error);
      }
    }
  }

  /**
   * Analyze emotions in a text message
   */
  async analyzeEmotion(
    userId: string,
    sessionId: string,
    text: string,
  ): Promise<EmotionAnalysis> {
    // In a real implementation, this would use a proper emotion detection model
    // This is a simplified version for demonstration purposes

    const lowerText = text.toLowerCase();
    const words = lowerText.split(/\s+/);

    // Initialize emotion scores
    const emotionScores: Record<Emotion, number> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      disgust: 0,
      surprise: 0,
      trust: 0,
      anticipation: 0,
      confusion: 0,
      frustration: 0,
      satisfaction: 0,
      gratitude: 0,
      curiosity: 0,
      neutral: 0.1, // Small baseline for neutral
    };

    // Track negation context
    let negationActive = false;

    // Track intensification/diminishing factors
    let intensityFactor = 1.0;

    // Analyze each word
    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Check for negations
      if (this.negations.includes(word)) {
        negationActive = true;
        continue;
      }

      // Check for intensifiers
      if (this.intensifiers.includes(word)) {
        intensityFactor = 1.5;
        continue;
      }

      // Check for diminishers
      if (this.diminishers.includes(word)) {
        intensityFactor = 0.5;
        continue;
      }

      // Check each emotion lexicon
      for (const [emotion, lexicon] of Object.entries(this.emotionLexicons)) {
        if (lexicon.some((term) => word.includes(term))) {
          // Apply negation if active
          if (negationActive) {
            // When negating an emotion, we often imply its opposite
            // For example, "not happy" implies sadness
            switch (emotion) {
              case "joy":
                emotionScores.sadness += 0.7 * intensityFactor;
                break;
              case "sadness":
                emotionScores.joy += 0.5 * intensityFactor;
                break;
              case "anger":
                emotionScores.neutral += 0.5 * intensityFactor;
                break;
              case "fear":
                emotionScores.trust += 0.5 * intensityFactor;
                break;
              case "disgust":
                emotionScores.satisfaction += 0.5 * intensityFactor;
                break;
              case "surprise":
                emotionScores.anticipation += 0.5 * intensityFactor;
                break;
              case "trust":
                emotionScores.fear += 0.5 * intensityFactor;
                break;
              case "anticipation":
                emotionScores.surprise += 0.5 * intensityFactor;
                break;
              default:
                emotionScores.neutral += 0.5 * intensityFactor;
            }
          } else {
            // Add to the emotion score with intensity factor
            emotionScores[emotion as Emotion] += 1.0 * intensityFactor;
          }
        }
      }

      // Reset negation and intensity after processing a content word
      negationActive = false;
      intensityFactor = 1.0;
    }

    // Normalize scores
    const totalScore = Object.values(emotionScores).reduce(
      (sum, score) => sum + score,
      0,
    );
    if (totalScore > 0) {
      for (const emotion in emotionScores) {
        emotionScores[emotion as Emotion] /= totalScore;
      }
    }

    // Find primary and secondary emotions
    const sortedEmotions = Object.entries(emotionScores)
      .map(([emotion, score]) => ({ emotion: emotion as Emotion, score }))
      .sort((a, b) => b.score - a.score);

    const primary = {
      emotion: sortedEmotions[0].emotion,
      score: sortedEmotions[0].score,
      confidence: this.calculateConfidence(
        sortedEmotions[0].score,
        sortedEmotions[1].score,
      ),
    };

    const secondary =
      sortedEmotions[1].score > 0.2
        ? {
            emotion: sortedEmotions[1].emotion,
            score: sortedEmotions[1].score,
            confidence: this.calculateConfidence(
              sortedEmotions[1].score,
              sortedEmotions[2].score,
            ),
          }
        : undefined;

    // Calculate VAD (Valence, Arousal, Dominance) dimensions
    const valence = this.calculateValence(emotionScores);
    const arousal = this.calculateArousal(emotionScores);
    const dominance = this.calculateDominance(emotionScores);

    // Create the emotion analysis result
    const analysis: EmotionAnalysis = {
      primary,
      secondary,
      overall: {
        valence,
        arousal,
        dominance,
      },
      details: sortedEmotions,
    };

    // Update emotion history
    await this.updateEmotionHistory(userId, sessionId, text, analysis);

    // Log the analysis
    await auditLogger.log({
      userId,
      action: "emotion_analysis",
      resource: "ai",
      details: {
        sessionId,
        primaryEmotion: primary.emotion,
        primaryScore: primary.score,
        valence,
      },
      status: "success",
    });

    return analysis;
  }

  /**
   * Update emotion history with a new analysis
   */
  private async updateEmotionHistory(
    userId: string,
    sessionId: string,
    text: string,
    analysis: EmotionAnalysis,
  ): Promise<void> {
    // Get or create emotion history
    let history = this.emotionHistories.get(sessionId);
    if (!history) {
      history = {
        userId,
        sessionId,
        history: [],
        lastUpdated: new Date(),
      };
    }

    // Add new analysis to history
    history.history.push({
      timestamp: new Date(),
      text,
      analysis,
    });

    // Update baseline if needed
    if (!history.baseline || history.history.length === 5) {
      history.baseline = this.calculateBaseline(history.history);
    }

    // Update last updated timestamp
    history.lastUpdated = new Date();

    // Save updated history
    this.emotionHistories.set(sessionId, history);
    this.persistHistories();
  }

  /**
   * Calculate baseline emotional state from history
   */
  private calculateBaseline(history: { analysis: EmotionAnalysis }[]): {
    valence: number;
    arousal: number;
    dominance: number;
  } {
    if (history.length === 0) {
      return { valence: 0, arousal: 0.5, dominance: 0.5 };
    }

    // Calculate average VAD values
    const valenceSum = history.reduce(
      (sum, item) => sum + item.analysis.overall.valence,
      0,
    );
    const arousalSum = history.reduce(
      (sum, item) => sum + item.analysis.overall.arousal,
      0,
    );
    const dominanceSum = history.reduce(
      (sum, item) => sum + item.analysis.overall.dominance,
      0,
    );

    return {
      valence: valenceSum / history.length,
      arousal: arousalSum / history.length,
      dominance: dominanceSum / history.length,
    };
  }

  /**
   * Detect emotional shifts between messages
   */
  detectEmotionalShift(
    sessionId: string,
    recentMessageCount: number = 3,
  ): EmotionShift | null {
    const history = this.emotionHistories.get(sessionId);
    if (!history || history.history.length < 2) {
      return null;
    }

    // Get the most recent messages up to the specified count
    const recentHistory = history.history.slice(-recentMessageCount);
    if (recentHistory.length < 2) {
      return null;
    }

    // Get the most recent and previous emotion analyses
    const currentAnalysis = recentHistory[recentHistory.length - 1].analysis;
    const previousAnalysis = recentHistory[recentHistory.length - 2].analysis;

    // Check if the primary emotion has changed
    if (currentAnalysis.primary.emotion === previousAnalysis.primary.emotion) {
      return null; // No significant shift
    }

    // Calculate the magnitude of the shift
    const valenceChange =
      currentAnalysis.overall.valence - previousAnalysis.overall.valence;
    const arousalChange =
      currentAnalysis.overall.arousal - previousAnalysis.overall.arousal;
    const dominanceChange =
      currentAnalysis.overall.dominance - previousAnalysis.overall.dominance;

    // Calculate overall magnitude using Euclidean distance in VAD space
    const magnitude =
      Math.sqrt(
        Math.pow(valenceChange, 2) +
          Math.pow(arousalChange, 2) +
          Math.pow(dominanceChange, 2),
      ) / Math.sqrt(3); // Normalize to 0-1 range

    // Only report significant shifts
    if (magnitude < 0.2) {
      return null;
    }

    return {
      from: previousAnalysis.primary.emotion,
      to: currentAnalysis.primary.emotion,
      magnitude,
      valenceChange,
      arousalChange,
      dominanceChange,
    };
  }

  /**
   * Generate an empathetic response based on detected emotion
   */
  async generateEmpatheticResponse(
    sessionId: string,
    emotion: Emotion,
    intensity: number = 0.5,
  ): Promise<EmpatheticResponse> {
    // In a real implementation, this would use a proper NLG service or LLM
    // This is a simplified version for demonstration purposes

    // Determine the appropriate empathetic strategy based on the emotion
    let strategy: EmpatheticStrategy;
    let targetEmotion: Emotion | undefined;
    let confidence = 0.7;

    switch (emotion) {
      case "joy":
        strategy = "mirror";
        targetEmotion = "joy";
        confidence = 0.9;
        break;

      case "sadness":
        strategy = intensity > 0.7 ? "validate" : "support";
        targetEmotion = intensity > 0.7 ? "sadness" : "neutral";
        confidence = 0.8;
        break;

      case "anger":
        strategy = intensity > 0.7 ? "acknowledge" : "calm";
        targetEmotion = "neutral";
        confidence = 0.75;
        break;

      case "fear":
        strategy = "support";
        targetEmotion = "trust";
        confidence = 0.85;
        break;

      case "disgust":
        strategy = "acknowledge";
        targetEmotion = "neutral";
        confidence = 0.7;
        break;

      case "surprise":
        strategy = "mirror";
        targetEmotion = "surprise";
        confidence = 0.8;
        break;

      case "trust":
        strategy = "mirror";
        targetEmotion = "trust";
        confidence = 0.9;
        break;

      case "anticipation":
        strategy = "encourage";
        targetEmotion = "anticipation";
        confidence = 0.85;
        break;

      case "confusion":
        strategy = intensity > 0.7 ? "support" : "distract";
        targetEmotion = "neutral";
        confidence = 0.8;
        break;

      case "frustration":
        strategy = intensity > 0.7 ? "acknowledge" : "reframe";
        targetEmotion = "neutral";
        confidence = 0.75;
        break;

      case "satisfaction":
        strategy = "mirror";
        targetEmotion = "satisfaction";
        confidence = 0.9;
        break;

      case "gratitude":
        strategy = "mirror";
        targetEmotion = "gratitude";
        confidence = 0.95;
        break;

      case "curiosity":
        strategy = "encourage";
        targetEmotion = "curiosity";
        confidence = 0.85;
        break;

      case "neutral":
      default:
        strategy = "neutral";
        confidence = 0.7;
        break;
    }

    // Generate response text based on the strategy
    let text: string;

    switch (strategy) {
      case "acknowledge":
        text = this.generateAcknowledgementResponse(emotion, intensity);
        break;

      case "validate":
        text = this.generateValidationResponse(emotion, intensity);
        break;

      case "mirror":
        text = this.generateMirroringResponse(emotion, intensity);
        break;

      case "reframe":
        text = this.generateReframingResponse(emotion, intensity);
        break;

      case "distract":
        text = this.generateDistractionResponse(emotion, intensity);
        break;

      case "support":
        text = this.generateSupportResponse(emotion, intensity);
        break;

      case "encourage":
        text = this.generateEncouragementResponse(emotion, intensity);
        break;

      case "calm":
        text = this.generateCalmingResponse(emotion, intensity);
        break;

      case "neutral":
      default:
        text = this.generateNeutralResponse();
        break;
    }

    // Log the response generation
    await auditLogger.log({
      userId: this.emotionHistories.get(sessionId)?.userId || "unknown",
      action: "empathetic_response_generated",
      resource: "ai",
      details: {
        sessionId,
        emotion,
        strategy,
        targetEmotion,
        intensity,
      },
      status: "success",
    });

    return {
      text,
      strategy,
      targetEmotion,
      confidence,
    };
  }

  /**
   * Generate a response that acknowledges the user's emotion
   */
  private generateAcknowledgementResponse(
    emotion: Emotion,
    intensity: number,
  ): string {
    const responses: Record<Emotion, string[]> = {
      joy: [
        "I can see you're really happy about this!",
        "It's great to see you're so pleased!",
        "I'm glad to see you're feeling so positive!",
      ],
      sadness: [
        "I understand this is difficult for you.",
        "I can see you're feeling down about this.",
        "I recognize this is a sad situation for you.",
      ],
      anger: [
        "I can see this is frustrating for you.",
        "I understand you're upset about this situation.",
        "I recognize that this is making you angry.",
      ],
      fear: [
        "I understand this is concerning for you.",
        "I can see this situation is making you anxious.",
        "I recognize that you're worried about this.",
      ],
      disgust: [
        "I understand your discomfort with this.",
        "I can see this doesn't sit well with you.",
        "I recognize that you find this objectionable.",
      ],
      surprise: [
        "I can see this caught you off guard.",
        "I understand this is unexpected for you.",
        "I recognize that you didn't see this coming.",
      ],
      trust: [
        "I can see you have confidence in this.",
        "I understand you feel secure about this.",
        "I recognize your trust in this situation.",
      ],
      anticipation: [
        "I can see you're looking forward to this.",
        "I understand you're eager about what's coming.",
        "I recognize your anticipation for this.",
      ],
      confusion: [
        "I can see this is confusing for you.",
        "I understand you're trying to make sense of this.",
        "I recognize that this information is unclear to you.",
      ],
      frustration: [
        "I can see you're frustrated by this situation.",
        "I understand this is a challenging obstacle for you.",
        "I recognize that you're having difficulty with this.",
      ],
      satisfaction: [
        "I can see you're satisfied with the outcome.",
        "I understand this meets your expectations.",
        "I recognize that you're content with this.",
      ],
      gratitude: [
        "I can see you're appreciative of this.",
        "I understand you're thankful for this.",
        "I recognize your gratitude in this situation.",
      ],
      curiosity: [
        "I can see you're interested in learning more.",
        "I understand you're curious about this.",
        "I recognize your desire to explore this further.",
      ],
      neutral: [
        "I understand your perspective on this.",
        "I see your point of view.",
        "I recognize your thoughts on this matter.",
      ],
    };

    // Select a response based on the emotion
    const options = responses[emotion] || responses.neutral;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a response that validates the user's emotion
   */
  private generateValidationResponse(
    emotion: Emotion,
    intensity: number,
  ): string {
    const responses: Record<Emotion, string[]> = {
      joy: [
        "You have every reason to be happy about this!",
        "Your excitement is completely justified!",
        "It makes perfect sense that you're feeling so good about this!",
      ],
      sadness: [
        "It's completely understandable that you're feeling sad about this.",
        "Anyone would feel down in this situation.",
        "Your feelings of sadness are totally valid given what you're going through.",
      ],
      anger: [
        "You have every right to be upset about this.",
        "Your frustration is completely justified.",
        "It's perfectly reasonable to feel angry in this situation.",
      ],
      fear: [
        "It's completely natural to be concerned about this.",
        "Your anxiety about this situation is totally understandable.",
        "Many people would feel worried in your position.",
      ],
      disgust: [
        "Your reaction to this is completely valid.",
        "It makes sense that you find this objectionable.",
        "Many people would be uncomfortable with this situation.",
      ],
      surprise: [
        "It's completely normal to be shocked by this.",
        "Anyone would be surprised in this situation.",
        "Your reaction is perfectly understandable given the circumstances.",
      ],
      trust: [
        "Your confidence in this is well-founded.",
        "You have good reason to trust this process.",
        "Your faith in this situation is justified.",
      ],
      anticipation: [
        "You have every reason to look forward to this.",
        "Your excitement about what's coming is well-placed.",
        "It's natural to feel eager about these upcoming events.",
      ],
      confusion: [
        "This is definitely a complex situation that would confuse anyone.",
        "Your confusion is completely understandable given the complexity.",
        "It makes perfect sense that you're having trouble making sense of this.",
      ],
      frustration: [
        "Your frustration is completely justified.",
        "Anyone would be frustrated in this situation.",
        "It's perfectly reasonable to feel stuck given these obstacles.",
      ],
      satisfaction: [
        "You have every reason to be satisfied with this outcome.",
        "Your contentment is well-deserved.",
        "It makes sense that you're pleased with how things turned out.",
      ],
      gratitude: [
        "Your appreciation is well-placed.",
        "You have every reason to be thankful.",
        "Your gratitude is completely understandable.",
      ],
      curiosity: [
        "Your curiosity about this is completely natural.",
        "It makes perfect sense that you want to learn more.",
        "Your interest in exploring this further is well-founded.",
      ],
      neutral: [
        "Your perspective on this makes perfect sense.",
        "Your approach to this situation is reasonable.",
        "Your thoughts on this matter are valid.",
      ],
    };

    // Select a response based on the emotion
    const options = responses[emotion] || responses.neutral;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a response that mirrors the user's emotion
   */
  private generateMirroringResponse(
    emotion: Emotion,
    intensity: number,
  ): string {
    const responses: Record<Emotion, string[]> = {
      joy: [
        "That's fantastic news! I'm happy to hear that!",
        "How wonderful! I'm excited for you!",
        "That's great! I'm delighted things are going so well!",
      ],
      sadness: [
        "I'm sorry to hear that. It's a difficult situation.",
        "That's really tough. I feel for you.",
        "I'm sad to hear you're going through this.",
      ],
      anger: [
        "That's really frustrating! I can understand why you're upset.",
        "How infuriating! That would bother me too.",
        "That's not right! I can see why you're angry.",
      ],
      fear: [
        "That does sound concerning. I understand your worry.",
        "I'd be anxious about that too. It's a troubling situation.",
        "That's definitely something to be cautious about.",
      ],
      disgust: [
        "That does sound unpleasant. I understand your reaction.",
        "I can see why you'd find that objectionable.",
        "That doesn't sound right at all.",
      ],
      surprise: [
        "Wow! That's unexpected!",
        "Really? That's surprising!",
        "I didn't see that coming either!",
      ],
      trust: [
        "I believe in this too! It seems very reliable.",
        "I share your confidence in this approach.",
        "I also trust that this will work out well.",
      ],
      anticipation: [
        "I'm looking forward to seeing how this unfolds too!",
        "This is going to be exciting to watch develop!",
        "I'm eager to see what happens next as well!",
      ],
      confusion: [
        "I'm a bit puzzled by this too. Let's figure it out together.",
        "This is confusing to me as well. Let's try to make sense of it.",
        "I'm also trying to understand how this works.",
      ],
      frustration: [
        "This is frustrating! I can see why you're having trouble with it.",
        "It's annoying when things don't work as expected.",
        "I find these kinds of obstacles frustrating too.",
      ],
      satisfaction: [
        "I'm pleased with this outcome too!",
        "This is a satisfying result! I'm glad it worked out.",
        "I'm also happy with how this turned out.",
      ],
      gratitude: [
        "I appreciate your kind words! Thank you!",
        "I'm grateful for your feedback too!",
        "Thank you as well! I value our interaction.",
      ],
      curiosity: [
        "I'm curious about that too! Let's explore it further.",
        "That's an interesting question! I'd like to know more as well.",
        "I'm also wondering about the details of this.",
      ],
      neutral: [
        "I understand your perspective.",
        "I see what you mean.",
        "I follow your reasoning on this.",
      ],
    };

    // Select a response based on the emotion
    const options = responses[emotion] || responses.neutral;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a response that reframes the user's emotion
   */
  private generateReframingResponse(
    emotion: Emotion,
    intensity: number,
  ): string {
    const responses: Record<Emotion, string[]> = {
      joy: [
        "That's great! And it might lead to even more positive opportunities.",
        "Wonderful! This success could open doors you haven't even considered yet.",
        "Excellent! This positive outcome might be just the beginning.",
      ],
      sadness: [
        "This is difficult now, but it might reveal strengths you didn't know you had.",
        "I understand this is hard. Sometimes challenging times lead to unexpected growth.",
        "While this is tough, it might be teaching you valuable lessons for the future.",
      ],
      anger: [
        "Your frustration shows how much you care about getting this right.",
        "This anger can actually be productive energy if channeled into solutions.",
        "Your strong reaction highlights the importance of this issue, which is the first step to addressing it.",
      ],
      fear: [
        "Your concern shows good foresight. Let's use that awareness to prepare effectively.",
        "This anxiety is actually your mind helping you anticipate what needs attention.",
        "Your caution can be a strength if we use it to plan carefully.",
      ],
      disgust: [
        "Your strong reaction shows you have clear values about what's acceptable.",
        "This discomfort might be highlighting an important boundary that needs to be respected.",
        "Your reaction is helping clarify what standards matter to you.",
      ],
      surprise: [
        "Unexpected events often lead to the most interesting opportunities.",
        "This surprise might be opening up possibilities you hadn't considered before.",
        "Sometimes the most unexpected turns lead to the best outcomes.",
      ],
      trust: [
        "Your confidence is well-placed, and it might even have more benefits than you expect.",
        "This trust creates a strong foundation that can support even more than you're currently planning.",
        "Your faith in this process might yield additional positive outcomes.",
      ],
      anticipation: [
        "Your excitement is justified, and the reality might exceed your expectations.",
        "This anticipation is preparing you to make the most of what's coming.",
        "Looking forward to this gives you time to maximize the benefits when it arrives.",
      ],
      confusion: [
        "This confusion is actually the first step toward deeper understanding.",
        "Being puzzled means you're engaging with the complexity, which is necessary for mastery.",
        "Great insights often begin with exactly this kind of confusion.",
      ],
      frustration: [
        "Your frustration shows you're pushing boundaries, which is how progress happens.",
        "This challenge is actually strengthening your problem-solving abilities.",
        "The obstacles you're facing now will make future successes even more meaningful.",
      ],
      satisfaction: [
        "This success might be even more significant than it initially appears.",
        "Your satisfaction is well-deserved, and might indicate potential for even greater achievements.",
        "This positive outcome could be a stepping stone to even better things.",
      ],
      gratitude: [
        "Your appreciation might actually create more positive experiences through this mindset.",
        "This thankfulness reflects a perspective that tends to notice more good things.",
        "Your grateful attitude can transform even ordinary experiences into meaningful ones.",
      ],
      curiosity: [
        "Your questions might lead to discoveries beyond what you're initially seeking.",
        "This curiosity could open doors to entirely new areas of interest.",
        "The exploration you're beginning might yield unexpected and valuable insights.",
      ],
      neutral: [
        "Your balanced perspective allows you to see multiple aspects of this situation.",
        "This measured approach gives you flexibility to adapt as things develop.",
        "Your neutral stance provides a good foundation for objective decision-making.",
      ],
    };

    // Select a response based on the emotion
    const options = responses[emotion] || responses.neutral;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a response that distracts from the user's emotion
   */
  private generateDistractionResponse(
    emotion: Emotion,
    intensity: number,
  ): string {
    const responses = [
      "Let's take a different approach to this. Have you considered...?",
      "I wonder if it might help to focus on something else for a moment. For instance...",
      "Sometimes a change of perspective can help. What if we look at it this way?",
      "Let's set this aside briefly and consider an alternative approach.",
      "It might be refreshing to think about this from a completely different angle.",
    ];

    const index = Math.floor(Math.random() * responses.length);
    return responses[index];
  }

  /**
   * Generate a response that offers support for the user's emotion
   */
  private generateSupportResponse(emotion: Emotion, intensity: number): string {
    const responses: Record<Emotion, string[]> = {
      joy: [
        "I'm here to help you build on this positive momentum.",
        "How can I support you in making the most of this great situation?",
        "I'm ready to assist you in any way that keeps this positive experience going.",
      ],
      sadness: [
        "I'm here for you during this difficult time. How can I best support you right now?",
        "You don't have to go through this alone. I'm here to help however I can.",
        "I'm ready to support you through this. What would be most helpful?",
      ],
      anger: [
        "I'm here to help address what's bothering you. What would be most useful right now?",
        "Let's work through this frustration together. How can I best assist you?",
        "I'm ready to help resolve this issue. What support do you need?",
      ],
      fear: [
        "I'm here to help you navigate this concern. What would make you feel more secure?",
        "We can work through this worry together. How can I best support you?",
        "I'm ready to help address these concerns. What would be most reassuring?",
      ],
      disgust: [
        "I'm here to help address this uncomfortable situation. How can I assist?",
        "Let's work together to resolve this issue. What would be most helpful?",
        "I'm ready to help improve this situation. What support do you need?",
      ],
      surprise: [
        "I'm here to help you process this unexpected situation. What would be most useful?",
        "Let's work through this surprise together. How can I best assist you?",
        "I'm ready to help you adjust to this new information. What support do you need?",
      ],
      trust: [
        "I'm here to reinforce this confidence. How can I further support your trust in this?",
        "Let's build on this solid foundation. What additional assurance would be helpful?",
        "I'm ready to help strengthen this trust. What information would be valuable?",
      ],
      anticipation: [
        "I'm here to help you prepare for what's coming. What would be most useful?",
        "Let's make the most of this upcoming opportunity. How can I best assist you?",
        "I'm ready to help you plan for this. What support do you need?",
      ],
      confusion: [
        "I'm here to help clarify this situation. What specific aspects are most puzzling?",
        "Let's work through this confusion together. What questions can I help answer?",
        "I'm ready to help make sense of this. What information would be most helpful?",
      ],
      frustration: [
        "I'm here to help overcome these obstacles. What specific challenges should we address first?",
        "Let's work through these difficulties together. How can I best assist you?",
        "I'm ready to help find solutions. What support do you need to move forward?",
      ],
      satisfaction: [
        "I'm here to help build on this success. What would you like to focus on next?",
        "Let's make the most of this positive outcome. How can I best assist you going forward?",
        "I'm ready to help maintain this momentum. What additional support would be valuable?",
      ],
      gratitude: [
        "I'm here to continue providing valuable assistance. What else would be helpful?",
        "It's my pleasure to support you. How else can I be of service?",
        "I'm ready to help with whatever else you might need. What's next on your list?",
      ],
      curiosity: [
        "I'm here to help explore this further. What specific aspects interest you most?",
        "Let's investigate this together. What questions would you like to focus on?",
        "I'm ready to help discover more about this. What direction should we take?",
      ],
      neutral: [
        "I'm here to provide whatever assistance you need. What would be most helpful?",
        "Let me know how I can best support you with this.",
        "I'm ready to help in whatever way would be most useful to you.",
      ],
    };

    // Select a response based on the emotion
    const options = responses[emotion] || responses.neutral;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a response that encourages the user
   */
  private generateEncouragementResponse(
    emotion: Emotion,
    intensity: number,
  ): string {
    const responses: Record<Emotion, string[]> = {
      joy: [
        "That's the spirit! Keep embracing these positive moments!",
        "Wonderful! Your positive energy will carry you far!",
        "Fantastic! Hold onto this feeling as you move forward!",
      ],
      sadness: [
        "You're stronger than you realize. I believe you'll get through this.",
        "One step at a time. You have what it takes to overcome this challenge.",
        "Better days are ahead. You have the resilience to weather this storm.",
      ],
      anger: [
        "You have the power to address this effectively. I believe in your ability to resolve it.",
        "Channel that energy into positive action. You can turn this around.",
        "You're capable of finding a good solution to this frustrating situation.",
      ],
      fear: [
        "You have the courage to face this. I believe in your ability to handle it.",
        "You're more prepared than you might feel. Trust your capabilities.",
        "One step at a time. You have what it takes to navigate this challenge.",
      ],
      disgust: [
        "You have good judgment. Trust your instincts about what's right for you.",
        "You're capable of creating boundaries that work for you in this situation.",
        "Your values matter. You can navigate this in a way that aligns with them.",
      ],
      surprise: [
        "You adapt well to the unexpected. I'm confident you'll navigate this successfully.",
        "You have the flexibility to handle this new development effectively.",
        "Your ability to adjust to new information will serve you well here.",
      ],
      trust: [
        "Your confidence is well-placed. Continue building on this solid foundation.",
        "Keep nurturing this trust. It will serve you well going forward.",
        "Your good judgment is evident. Continue following this promising path.",
      ],
      anticipation: [
        "Keep looking forward! Your preparation will pay off.",
        "Your enthusiasm will help make this a success. Keep that energy going!",
        "Stay excited about the possibilities! Your positive outlook will help create good outcomes.",
      ],
      confusion: [
        "You're asking the right questions. Keep exploring and clarity will come.",
        "Your curiosity will lead to understanding. Keep working through this puzzle.",
        "You have the intelligence to figure this out. Take it one piece at a time.",
      ],
      frustration: [
        "Don't give up! You have the persistence to overcome these obstacles.",
        "You've faced challenges before and succeeded. You can do it again.",
        "Each attempt brings you closer to a solution. Keep going!",
      ],
      satisfaction: [
        "Well done! Continue building on this success!",
        "You've earned this achievement. Use it as a stepping stone to your next goal!",
        "Excellent work! Your efforts are paying off, and there's more good to come!",
      ],
      gratitude: [
        "Your appreciation creates more positivity. Keep nurturing that thankful spirit!",
        "That grateful perspective serves you well. Continue to recognize the good around you!",
        "Your thankfulness reflects your positive character. Keep embracing that quality!",
      ],
      curiosity: [
        "Keep exploring! Your questions will lead to valuable discoveries.",
        "Your inquisitive mind is a powerful asset. Continue following your curiosity!",
        "Great insights come from questions like yours. Keep investigating!",
      ],
      neutral: [
        "You're taking a thoughtful approach. Continue considering all angles.",
        "Your balanced perspective is valuable. Keep maintaining that objectivity.",
        "You're on a good path. Continue with this measured approach.",
      ],
    };

    // Select a response based on the emotion
    const options = responses[emotion] || responses.neutral;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a response that helps calm the user
   */
  private generateCalmingResponse(emotion: Emotion, intensity: number): string {
    const responses: Partial<Record<Emotion, string[]>> = {
      anger: [
        "Let's take a moment to consider this calmly. What's the core issue we need to address?",
        "I understand this is frustrating. Taking a step back might help us find the best solution.",
        "Let's break this down into manageable parts so we can address it effectively.",
      ],
      fear: [
        "Let's take a breath and consider this one step at a time.",
        "We can work through this methodically to address your concerns.",
        "Let's focus on what we know for certain and proceed carefully from there.",
      ],
      frustration: [
        "Let's pause and approach this from a fresh angle.",
        "Sometimes stepping back briefly helps us see new solutions.",
        "Let's break this down into smaller steps that we can tackle one by one.",
      ],
      confusion: [
        "Let's slow down and clarify things one point at a time.",
        "We can work through this methodically until it makes sense.",
        "Let's establish what we know for sure and build understanding from there.",
      ],
      surprise: [
        "Let's take a moment to process this new information.",
        "It's okay to take time to adjust to unexpected developments.",
        "Let's consider what this means before deciding how to proceed.",
      ],
      disgust: [
        "Let's take a step back and consider this objectively.",
        "We can approach this in a way that respects your boundaries.",
        "Let's focus on finding a comfortable resolution to this situation.",
      ],
    };

    // For emotions not specifically listed, use general calming responses
    const generalResponses = [
      "Let's take a moment to consider this carefully.",
      "A measured approach will help us find the best way forward.",
      "Let's think about this step by step to find the optimal solution.",
    ];

    // Select a response based on the emotion
    const options = responses[emotion] || generalResponses;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  }

  /**
   * Generate a neutral response
   */
  private generateNeutralResponse(): string {
    const responses = [
      "I understand. How would you like to proceed?",
      "Thank you for sharing that. What would be most helpful now?",
      "I see. What would you like to focus on next?",
      "Got it. How can I assist you with this?",
      "I appreciate your input. What else would you like to discuss?",
    ];

    const index = Math.floor(Math.random() * responses.length);
    return responses[index];
  }

  /**
   * Calculate confidence score based on the difference between top emotions
   */
  private calculateConfidence(topScore: number, secondScore: number): number {
    // The bigger the gap between top and second emotion, the higher the confidence
    const gap = topScore - secondScore;
    return Math.min(0.5 + gap * 2, 0.95); // Scale to 0.5-0.95 range
  }

  /**
   * Calculate valence (positive/negative) dimension from emotion scores
   */
  private calculateValence(emotionScores: Record<Emotion, number>): number {
    // Positive emotions contribute to positive valence
    const positiveContribution =
      emotionScores.joy * 1.0 +
      emotionScores.trust * 0.8 +
      emotionScores.anticipation * 0.6 +
      emotionScores.surprise * 0.2 +
      emotionScores.satisfaction * 1.0 +
      emotionScores.gratitude * 0.9;

    // Negative emotions contribute to negative valence
    const negativeContribution =
      emotionScores.sadness * 1.0 +
      emotionScores.anger * 0.9 +
      emotionScores.fear * 0.8 +
      emotionScores.disgust * 0.7 +
      emotionScores.frustration * 0.8 +
      emotionScores.confusion * 0.3;

    // Calculate net valence (-1 to 1)
    const totalContribution = positiveContribution + negativeContribution;
    if (totalContribution === 0) return 0;

    return (positiveContribution - negativeContribution) / totalContribution;
  }

  /**
   * Calculate arousal (calm/excited) dimension from emotion scores
   */
  private calculateArousal(emotionScores: Record<Emotion, number>): number {
    // High arousal emotions
    const highArousal =
      emotionScores.joy * 0.8 +
      emotionScores.anger * 1.0 +
      emotionScores.fear * 0.9 +
      emotionScores.surprise * 1.0 +
      emotionScores.anticipation * 0.7 +
      emotionScores.frustration * 0.8;

    // Low arousal emotions
    const lowArousal =
      emotionScores.sadness * 0.3 +
      emotionScores.trust * 0.4 +
      emotionScores.disgust * 0.5 +
      emotionScores.satisfaction * 0.4 +
      emotionScores.neutral * 0.1;

    // Calculate net arousal (0 to 1)
    const totalContribution = highArousal + lowArousal;
    if (totalContribution === 0) return 0.5;

    return highArousal / totalContribution;
  }

  /**
   * Calculate dominance (submissive/dominant) dimension from emotion scores
   */
  private calculateDominance(emotionScores: Record<Emotion, number>): number {
    // High dominance emotions
    const highDominance =
      emotionScores.joy * 0.7 +
      emotionScores.anger * 0.8 +
      emotionScores.trust * 0.6 +
      emotionScores.anticipation * 0.6 +
      emotionScores.satisfaction * 0.7 +
      emotionScores.gratitude * 0.5;

    // Low dominance emotions
    const lowDominance =
      emotionScores.sadness * 0.8 +
      emotionScores.fear * 1.0 +
      emotionScores.disgust * 0.6 +
      emotionScores.surprise * 0.5 +
      emotionScores.confusion * 0.7 +
      emotionScores.frustration * 0.5;

    // Calculate net dominance (0 to 1)
    const totalContribution = highDominance + lowDominance;
    if (totalContribution === 0) return 0.5;

    return highDominance / totalContribution;
  }

  /**
   * Persist emotion histories to localStorage
   */
  private persistHistories(): void {
    if (typeof window !== "undefined") {
      try {
        const historiesObj = Object.fromEntries(
          this.emotionHistories.entries(),
        );
        localStorage.setItem(this.storageKey, JSON.stringify(historiesObj));
      } catch (error) {
        console.error("Failed to store emotion histories:", error);
      }
    }
  }

  /**
   * Clean up old emotion histories to prevent memory leaks
   */
  cleanupOldHistories(maxAgeHours: number = 24): void {
    const now = new Date();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

    for (const [sessionId, history] of this.emotionHistories.entries()) {
      const age = now.getTime() - history.lastUpdated.getTime();
      if (age > maxAgeMs) {
        this.emotionHistories.delete(sessionId);
      }
    }

    this.persistHistories();
  }
}

export const emotionDetector = new EmotionDetector();
