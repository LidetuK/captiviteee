interface Context {
  sessionId: string;
  userId?: string;
  currentIntent?: string;
  entities?: Record<string, any>;
  lastInteraction?: Date;
  conversationHistory: Array<{
    role: "user" | "system";
    content: string;
    timestamp: Date;
  }>;
  metadata?: Record<string, any>;
}

export const contextManager = {
  contexts: new Map<string, Context>(),

  createContext: (sessionId: string, userId?: string): Context => {
    const context: Context = {
      sessionId,
      userId,
      conversationHistory: [],
      lastInteraction: new Date(),
    };
    contextManager.contexts.set(sessionId, context);
    return context;
  },

  getContext: (sessionId: string): Context | undefined => {
    return contextManager.contexts.get(sessionId);
  },

  updateContext: (sessionId: string, updates: Partial<Context>): void => {
    const context = contextManager.contexts.get(sessionId);
    if (context) {
      Object.assign(context, {
        ...updates,
        lastInteraction: new Date(),
      });
      contextManager.contexts.set(sessionId, context);
    }
  },

  addToHistory: (
    sessionId: string,
    role: "user" | "system",
    content: string,
  ): void => {
    const context = contextManager.contexts.get(sessionId);
    if (context) {
      context.conversationHistory.push({
        role,
        content,
        timestamp: new Date(),
      });
      context.lastInteraction = new Date();
      contextManager.contexts.set(sessionId, context);
    }
  },

  clearContext: (sessionId: string): void => {
    contextManager.contexts.delete(sessionId);
  },

  // Clean up old contexts (e.g., run periodically)
  cleanup: (maxAge: number = 1800000): void => {
    // Default 30 minutes
    const now = new Date();
    for (const [sessionId, context] of contextManager.contexts.entries()) {
      if (
        context.lastInteraction &&
        now.getTime() - context.lastInteraction.getTime() > maxAge
      ) {
        contextManager.contexts.delete(sessionId);
      }
    }
  },
};
