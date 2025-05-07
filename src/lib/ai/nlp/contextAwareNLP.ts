/**
 * Context-Aware Natural Language Processing System
 */

import { auditLogger } from "../../auth/audit";

export interface ConversationContext {
  userId: string;
  sessionId: string;
  history: {
    role: "user" | "system" | "assistant";
    content: string;
    timestamp: Date;
    entities?: Entity[];
    intent?: Intent;
    sentiment?: SentimentAnalysis;
  }[];
  entities: Record<string, Entity>;
  preferences: Record<string, any>;
  lastActivity: Date;
}

export interface Entity {
  id: string;
  type: string;
  value: any;
  confidence: number;
  source: string; // Where this entity was extracted from
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Intent {
  name: string;
  confidence: number;
  entities: Entity[];
  parameters?: Record<string, any>;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1 (negative to positive)
  magnitude: number; // 0 to infinity (strength of sentiment)
  categories: {
    category: string;
    score: number;
  }[];
}

export interface PredictedAction {
  type: string;
  confidence: number;
  parameters?: Record<string, any>;
  reasoning?: string;
}

export interface NLPResponse {
  text: string;
  intent?: Intent;
  entities?: Entity[];
  sentiment?: SentimentAnalysis;
  predictedActions?: PredictedAction[];
  context: ConversationContext;
}

class ContextAwareNLP {
  private contexts = new Map<string, ConversationContext>();
  private storageKey = "captivite_nlp_contexts";

  constructor() {
    // Load contexts from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedContexts = localStorage.getItem(this.storageKey);
        if (storedContexts) {
          const parsedContexts = JSON.parse(storedContexts);
          Object.entries(parsedContexts).forEach(
            ([sessionId, context]: [string, any]) => {
              // Convert string dates back to Date objects
              context.lastActivity = new Date(context.lastActivity);
              context.history = context.history.map((item: any) => ({
                ...item,
                timestamp: new Date(item.timestamp),
              }));
              Object.values(context.entities).forEach((entity: any) => {
                entity.timestamp = new Date(entity.timestamp);
              });
              this.contexts.set(sessionId, context as ConversationContext);
            },
          );
        }
      } catch (error) {
        console.error("Failed to load NLP contexts from storage:", error);
      }
    }
  }

  /**
   * Process a user message with context awareness
   */
  async processMessage(
    userId: string,
    sessionId: string,
    message: string,
  ): Promise<NLPResponse> {
    // Get or create conversation context
    let context = this.getContext(userId, sessionId);
    if (!context) {
      context = this.createContext(userId, sessionId);
    }

    // Update last activity
    context.lastActivity = new Date();

    // Extract intent
    const intent = await this.detectIntent(message, context);

    // Extract entities
    const entities = await this.extractEntities(message, context, intent);

    // Analyze sentiment
    const sentiment = await this.analyzeSentiment(message, context);

    // Add message to history
    context.history.push({
      role: "user",
      content: message,
      timestamp: new Date(),
      entities,
      intent,
      sentiment,
    });

    // Update context with new entities
    entities.forEach((entity) => {
      context.entities[entity.id] = entity;
    });

    // Predict next actions
    const predictedActions = await this.predictNextActions(context);

    // Generate response
    const response = await this.generateResponse(
      context,
      intent,
      entities,
      predictedActions,
    );

    // Add response to history
    context.history.push({
      role: "assistant",
      content: response,
      timestamp: new Date(),
    });

    // Persist updated context
    this.persistContext(sessionId, context);

    // Log the interaction
    await auditLogger.log({
      userId,
      action: "nlp_process",
      resource: "ai",
      details: {
        sessionId,
        intent: intent?.name,
        entityCount: entities.length,
      },
      status: "success",
    });

    return {
      text: response,
      intent,
      entities,
      sentiment,
      predictedActions,
      context,
    };
  }

  /**
   * Get a conversation context
   */
  getContext(
    userId: string,
    sessionId: string,
  ): ConversationContext | undefined {
    return this.contexts.get(sessionId);
  }

  /**
   * Create a new conversation context
   */
  createContext(userId: string, sessionId: string): ConversationContext {
    const context: ConversationContext = {
      userId,
      sessionId,
      history: [],
      entities: {},
      preferences: {},
      lastActivity: new Date(),
    };

    this.contexts.set(sessionId, context);
    return context;
  }

  /**
   * Detect intent from a message with context awareness
   */
  private async detectIntent(
    message: string,
    context: ConversationContext,
  ): Promise<Intent> {
    // In a real implementation, this would use a proper NLP service
    // This is a simplified version for demonstration purposes

    // Simple keyword-based intent detection
    const intents: Record<string, { keywords: string[]; entities: string[] }> =
      {
        greeting: {
          keywords: ["hello", "hi", "hey", "greetings"],
          entities: [],
        },
        farewell: {
          keywords: ["goodbye", "bye", "see you", "later"],
          entities: [],
        },
        help: {
          keywords: ["help", "assist", "support", "how do I"],
          entities: [],
        },
        book_appointment: {
          keywords: ["book", "schedule", "appointment", "meeting", "reserve"],
          entities: ["date", "time", "service"],
        },
        check_status: {
          keywords: ["status", "where is", "track", "progress"],
          entities: ["order_id", "appointment_id"],
        },
      };

    // Check for intent matches
    const lowerMessage = message.toLowerCase();
    let bestMatch: {
      name: string;
      confidence: number;
      entities: Entity[];
    } | null = null;

    for (const [intentName, intentData] of Object.entries(intents)) {
      // Calculate match based on keywords
      let matchCount = 0;
      for (const keyword of intentData.keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        const confidence = matchCount / intentData.keywords.length;

        // If this is the best match so far, update bestMatch
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            name: intentName,
            confidence,
            entities: [],
          };
        }
      }
    }

    // If no intent matched, use a default intent
    if (!bestMatch) {
      bestMatch = {
        name: "unknown",
        confidence: 0.3,
        entities: [],
      };
    }

    // Consider conversation context to refine intent
    if (context.history.length > 0) {
      const lastIntent = context.history[context.history.length - 1].intent;

      // If the last intent was a question and current intent is unknown,
      // this might be an answer to the question
      if (
        lastIntent &&
        lastIntent.name.includes("question") &&
        bestMatch.name === "unknown"
      ) {
        bestMatch.name = "answer";
        bestMatch.confidence = 0.6;
      }

      // If the last message was from the assistant asking for specific information
      // and the user's message is short, it's likely providing that information
      const lastMessage = context.history[context.history.length - 1];
      if (
        lastMessage.role === "assistant" &&
        message.split(" ").length <= 5 &&
        bestMatch.name === "unknown"
      ) {
        bestMatch.name = "provide_information";
        bestMatch.confidence = 0.7;
      }
    }

    return bestMatch as Intent;
  }

  /**
   * Extract entities from a message with context awareness
   */
  private async extractEntities(
    message: string,
    context: ConversationContext,
    intent?: Intent,
  ): Promise<Entity[]> {
    // In a real implementation, this would use a proper NLP service
    // This is a simplified version for demonstration purposes

    const entities: Entity[] = [];
    const now = new Date();

    // Simple regex-based entity extraction

    // Date entities
    const dateRegex =
      /\b(today|tomorrow|yesterday|next week|next month|\d{1,2}[/\-]\d{1,2}(?:[/\-]\d{2,4})?)\b/gi;
    let dateMatch;
    while ((dateMatch = dateRegex.exec(message)) !== null) {
      entities.push({
        id: `date_${entities.length}`,
        type: "date",
        value: dateMatch[1],
        confidence: 0.8,
        source: "regex",
        timestamp: now,
      });
    }

    // Time entities
    const timeRegex =
      /\b(\d{1,2}(?::\d{2})?(?: ?[ap]\.?m\.?)?|noon|midnight|morning|afternoon|evening)\b/gi;
    let timeMatch;
    while ((timeMatch = timeRegex.exec(message)) !== null) {
      entities.push({
        id: `time_${entities.length}`,
        type: "time",
        value: timeMatch[1],
        confidence: 0.8,
        source: "regex",
        timestamp: now,
      });
    }

    // Number entities
    const numberRegex = /\b(\d+(?:\.\d+)?)\b/g;
    let numberMatch;
    while ((numberMatch = numberRegex.exec(message)) !== null) {
      entities.push({
        id: `number_${entities.length}`,
        type: "number",
        value: parseFloat(numberMatch[1]),
        confidence: 0.9,
        source: "regex",
        timestamp: now,
      });
    }

    // Email entities
    const emailRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g;
    let emailMatch;
    while ((emailMatch = emailRegex.exec(message)) !== null) {
      entities.push({
        id: `email_${entities.length}`,
        type: "email",
        value: emailMatch[1],
        confidence: 0.95,
        source: "regex",
        timestamp: now,
      });
    }

    // Consider conversation context to refine entities
    if (context.history.length > 0) {
      // If a previous message asked for a specific entity type and none was found,
      // the entire message might be that entity
      const lastMessage = context.history[context.history.length - 1];
      if (
        lastMessage.role === "assistant" &&
        (lastMessage.content.includes("What time") ||
          lastMessage.content.includes("what time")) &&
        !entities.some((e) => e.type === "time")
      ) {
        entities.push({
          id: `time_${entities.length}`,
          type: "time",
          value: message.trim(),
          confidence: 0.6,
          source: "context",
          timestamp: now,
        });
      }

      // If a previous message asked for a date and none was found,
      // the entire message might be a date
      if (
        lastMessage.role === "assistant" &&
        (lastMessage.content.includes("What date") ||
          lastMessage.content.includes("what date")) &&
        !entities.some((e) => e.type === "date")
      ) {
        entities.push({
          id: `date_${entities.length}`,
          type: "date",
          value: message.trim(),
          confidence: 0.6,
          source: "context",
          timestamp: now,
        });
      }
    }

    return entities;
  }

  /**
   * Analyze sentiment of a message with context awareness
   */
  private async analyzeSentiment(
    message: string,
    context: ConversationContext,
  ): Promise<SentimentAnalysis> {
    // In a real implementation, this would use a proper sentiment analysis service
    // This is a simplified version for demonstration purposes

    // Simple keyword-based sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "happy",
      "pleased",
      "satisfied",
      "love",
      "like",
      "thanks",
      "thank you",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "disappointed",
      "unhappy",
      "hate",
      "dislike",
      "poor",
      "worst",
      "not working",
      "problem",
      "issue",
      "error",
    ];

    const lowerMessage = message.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    // Count positive and negative words
    for (const word of positiveWords) {
      if (lowerMessage.includes(word)) {
        positiveCount++;
      }
    }

    for (const word of negativeWords) {
      if (lowerMessage.includes(word)) {
        negativeCount++;
      }
    }

    // Calculate sentiment score (-1 to 1)
    const totalWords = message.split(/\s+/).length;
    const positiveScore = positiveCount / positiveWords.length;
    const negativeScore = negativeCount / negativeWords.length;

    let score = 0;
    if (positiveCount > 0 || negativeCount > 0) {
      score = (positiveScore - negativeScore) / (positiveScore + negativeScore);
    }

    // Calculate magnitude (strength of sentiment)
    const magnitude = (positiveCount + negativeCount) / totalWords;

    // Determine sentiment categories
    const categories: Array<{ category: string; score: number }> = [];
    if (positiveCount > 0) {
      categories.push({
        category: "positive",
        score: positiveScore,
      });
    }
    if (negativeCount > 0) {
      categories.push({
        category: "negative",
        score: negativeScore,
      });
    }

    // Consider conversation context to refine sentiment
    if (context.history.length > 0) {
      // If previous messages had strong sentiment, it might carry over
      const recentHistory = context.history.slice(-3);
      let historicalSentiment = 0;
      let count = 0;

      for (const item of recentHistory) {
        if (item.sentiment) {
          historicalSentiment += item.sentiment.score;
          count++;
        }
      }

      if (count > 0) {
        const averageHistoricalSentiment = historicalSentiment / count;
        // Blend current sentiment with historical sentiment (70% current, 30% historical)
        score = score * 0.7 + averageHistoricalSentiment * 0.3;
      }
    }

    return {
      score,
      magnitude,
      categories,
    };
  }

  /**
   * Predict next actions based on conversation context
   */
  private async predictNextActions(
    context: ConversationContext,
  ): Promise<PredictedAction[]> {
    // In a real implementation, this would use a proper ML model
    // This is a simplified version for demonstration purposes

    const actions: PredictedAction[] = [];

    // If no history, suggest greeting
    if (context.history.length === 0) {
      actions.push({
        type: "greeting",
        confidence: 0.9,
        parameters: {
          style: "friendly",
        },
      });
      return actions;
    }

    // Get the last user message
    const lastUserMessageIndex = context.history
      .map((h) => h.role)
      .lastIndexOf("user");
    if (lastUserMessageIndex === -1) return actions;

    const lastUserMessage = context.history[lastUserMessageIndex];
    const lastUserIntent = lastUserMessage.intent;

    // Predict actions based on intent
    if (lastUserIntent) {
      switch (lastUserIntent.name) {
        case "greeting":
          actions.push({
            type: "respond_greeting",
            confidence: 0.9,
            parameters: {
              include_help_offer: true,
            },
          });
          break;

        case "farewell":
          actions.push({
            type: "respond_farewell",
            confidence: 0.9,
            parameters: {
              include_satisfaction_question: true,
            },
          });
          break;

        case "help":
          actions.push({
            type: "provide_help_menu",
            confidence: 0.8,
            parameters: {
              categories: ["general", "booking", "account"],
            },
          });
          break;

        case "book_appointment":
          // Check if we have all required entities
          const hasDate = lastUserMessage.entities?.some(
            (e) => e.type === "date",
          );
          const hasTime = lastUserMessage.entities?.some(
            (e) => e.type === "time",
          );

          if (!hasDate) {
            actions.push({
              type: "request_date",
              confidence: 0.9,
              parameters: {
                suggest_options: true,
              },
            });
          } else if (!hasTime) {
            actions.push({
              type: "request_time",
              confidence: 0.9,
              parameters: {
                suggest_available_slots: true,
              },
            });
          } else {
            actions.push({
              type: "confirm_appointment",
              confidence: 0.9,
              parameters: {
                include_details: true,
              },
            });
          }
          break;

        case "check_status":
          const hasOrderId = lastUserMessage.entities?.some(
            (e) => e.type === "order_id",
          );
          const hasAppointmentId = lastUserMessage.entities?.some(
            (e) => e.type === "appointment_id",
          );

          if (!hasOrderId && !hasAppointmentId) {
            actions.push({
              type: "request_identifier",
              confidence: 0.9,
              parameters: {
                identifier_types: ["order_id", "appointment_id", "email"],
              },
            });
          } else {
            actions.push({
              type: "provide_status",
              confidence: 0.9,
              parameters: {
                include_details: true,
              },
            });
          }
          break;

        default:
          // Default action if intent is unknown
          actions.push({
            type: "clarify_intent",
            confidence: 0.7,
            parameters: {
              suggest_common_intents: true,
            },
          });
      }
    }

    // Add follow-up actions based on sentiment
    if (lastUserMessage.sentiment) {
      if (lastUserMessage.sentiment.score < -0.3) {
        // Negative sentiment
        actions.push({
          type: "address_negative_sentiment",
          confidence: 0.8,
          parameters: {
            offer_assistance: true,
            escalation_option: true,
          },
        });
      } else if (lastUserMessage.sentiment.score > 0.5) {
        // Very positive sentiment
        actions.push({
          type: "acknowledge_positive_sentiment",
          confidence: 0.7,
          parameters: {
            express_gratitude: true,
          },
        });
      }
    }

    return actions;
  }

  /**
   * Generate a response based on context, intent, entities, and predicted actions
   */
  private async generateResponse(
    context: ConversationContext,
    intent?: Intent,
    entities?: Entity[],
    predictedActions?: PredictedAction[],
  ): Promise<string> {
    // In a real implementation, this would use a proper NLG service or LLM
    // This is a simplified version for demonstration purposes

    if (!predictedActions || predictedActions.length === 0) {
      return "I'm not sure how to respond to that. Can you please rephrase?";
    }

    // Get the highest confidence action
    const primaryAction = predictedActions.reduce((prev, current) =>
      prev.confidence > current.confidence ? prev : current,
    );

    // Generate response based on the primary action
    switch (primaryAction.type) {
      case "respond_greeting":
        return "Hello! How can I assist you today?";

      case "respond_farewell":
        return "Goodbye! Thank you for chatting with us. Is there anything else you'd like help with before you go?";

      case "provide_help_menu":
        return "I can help you with the following:\n- Booking appointments\n- Checking status\n- Account management\nWhat would you like assistance with?";

      case "request_date":
        return "What date would you like to book your appointment for?";

      case "request_time":
        return "What time would you prefer for your appointment?";

      case "confirm_appointment":
        // Extract date and time from entities
        const dateEntity = entities?.find((e) => e.type === "date");
        const timeEntity = entities?.find((e) => e.type === "time");

        return `Great! I've booked your appointment for ${dateEntity?.value} at ${timeEntity?.value}. Is there anything else you need?`;

      case "request_identifier":
        return "To check your status, I'll need your order number or appointment ID. Could you please provide that?";

      case "provide_status":
        // In a real implementation, this would look up the actual status
        return "Your appointment is confirmed and scheduled. You'll receive a reminder 24 hours before.";

      case "clarify_intent":
        return "I'm not sure I understand what you're looking for. Would you like to book an appointment, check a status, or get help with something else?";

      case "address_negative_sentiment":
        return "I'm sorry to hear you're having a frustrating experience. I'd like to help resolve this for you. Would you like me to connect you with a human agent?";

      case "acknowledge_positive_sentiment":
        return "Thank you for your kind words! I'm glad I could be of assistance.";

      default:
        return "I understand. How else can I assist you today?";
    }
  }

  /**
   * Persist conversation context to localStorage
   */
  private persistContext(
    sessionId: string,
    context: ConversationContext,
  ): void {
    this.contexts.set(sessionId, context);

    if (typeof window !== "undefined") {
      try {
        const contextsObj = Object.fromEntries(this.contexts.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(contextsObj));
      } catch (error) {
        console.error("Failed to store NLP contexts:", error);
      }
    }
  }

  /**
   * Clean up old contexts to prevent memory leaks
   */
  cleanupOldContexts(maxAgeHours: number = 24): void {
    const now = new Date();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

    for (const [sessionId, context] of this.contexts.entries()) {
      const age = now.getTime() - context.lastActivity.getTime();
      if (age > maxAgeMs) {
        this.contexts.delete(sessionId);
      }
    }

    this.persistContext("", {} as ConversationContext); // Trigger storage update
  }
}

export const contextAwareNLP = new ContextAwareNLP();
