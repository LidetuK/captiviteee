/**
 * AI Phone Call Agent System
 */

import { auditLogger } from "../../auth/audit";
import { contextAwareNLP } from "../nlp/contextAwareNLP";
import { emotionDetector } from "../nlp/emotionDetection";
import { languageManager } from "../multilingual/languageManager";

export interface PhoneAgentConfig {
  id: string;
  name: string;
  description?: string;
  voice: VoiceConfig;
  personality: {
    tone: "professional" | "friendly" | "casual" | "formal" | "empathetic";
    pace: "slow" | "medium" | "fast";
    vocabulary: "simple" | "standard" | "advanced";
    customTraits?: Record<string, any>;
  };
  compliance: {
    recordingDisclosure: boolean;
    dataPrivacyStatements: string[];
    requiredDisclosures: string[];
    prohibitedPhrases: string[];
    sensitiveTopics: string[];
  };
  filtering: {
    inputFilters: FilterRule[];
    outputFilters: FilterRule[];
    realTimeFiltering: boolean;
    sensitivityLevel: number; // 0-1 scale
  };
  capabilities: {
    languages: string[];
    canTransferToHuman: boolean;
    canSendSMS: boolean;
    canSendEmail: boolean;
    canScheduleCallback: boolean;
    canProcessPayments: boolean;
    customCapabilities?: string[];
  };
  metrics: {
    trackCallDuration: boolean;
    trackSentiment: boolean;
    trackResolution: boolean;
    trackTransferRate: boolean;
    customMetrics?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceConfig {
  gender: "male" | "female" | "neutral";
  accent?: string;
  pitch: number; // 0-2 scale, 1 is neutral
  rate: number; // 0-2 scale, 1 is neutral
  voiceId?: string; // For specific voice selection
}

export interface FilterRule {
  type: "keyword" | "regex" | "semantic" | "sentiment";
  pattern: string;
  action: "block" | "flag" | "replace" | "log";
  replacement?: string;
  severity: "low" | "medium" | "high" | "critical";
  description?: string;
}

export interface CallSession {
  id: string;
  agentId: string;
  callerId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  status: "active" | "completed" | "transferred" | "dropped";
  transcript: CallTranscriptEntry[];
  metrics: {
    averageSentiment: number;
    escalated: boolean;
    resolved: boolean;
    intentRecognized: boolean;
    customMetrics?: Record<string, any>;
  };
  notes?: string[];
  tags?: string[];
}

export interface CallTranscriptEntry {
  timestamp: Date;
  speaker: "agent" | "caller";
  text: string;
  sentiment?: number; // -1 to 1
  intent?: string;
  entities?: { type: string; value: string }[];
  flagged?: boolean;
  flagReason?: string;
}

class PhoneAgent {
  private agents = new Map<string, PhoneAgentConfig>();
  private activeCalls = new Map<string, CallSession>();
  private storageKey = "captivite_phone_agents";

  constructor() {
    // Load agents from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedAgents = localStorage.getItem(this.storageKey);
        if (storedAgents) {
          const parsedAgents = JSON.parse(storedAgents);
          Object.entries(parsedAgents).forEach(([id, agent]: [string, any]) => {
            // Convert string dates back to Date objects
            agent.createdAt = new Date(agent.createdAt);
            agent.updatedAt = new Date(agent.updatedAt);
            this.agents.set(id, agent as PhoneAgentConfig);
          });
        }
      } catch (error) {
        console.error("Failed to load phone agents from storage:", error);
      }
    }
  }

  /**
   * Create a new phone agent
   */
  async createAgent(
    config: Omit<PhoneAgentConfig, "createdAt" | "updatedAt">,
  ): Promise<PhoneAgentConfig> {
    const now = new Date();
    const newAgent: PhoneAgentConfig = {
      ...config,
      createdAt: now,
      updatedAt: now,
    };

    this.agents.set(newAgent.id, newAgent);
    this.persistAgents();

    await auditLogger.log({
      userId: "system",
      action: "phone_agent_created",
      resource: "phone_agent",
      details: { agentId: newAgent.id, agentName: newAgent.name },
      status: "success",
    });

    return newAgent;
  }

  /**
   * Get a phone agent by ID
   */
  getAgent(agentId: string): PhoneAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all phone agents
   */
  getAllAgents(): PhoneAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Update a phone agent
   */
  async updateAgent(
    agentId: string,
    updates: Partial<Omit<PhoneAgentConfig, "id" | "createdAt" | "updatedAt">>,
  ): Promise<PhoneAgentConfig | undefined> {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;

    const updatedAgent: PhoneAgentConfig = {
      ...agent,
      ...updates,
      id: agentId, // Ensure ID doesn't change
      createdAt: agent.createdAt, // Preserve creation date
      updatedAt: new Date(), // Update the update date
    };

    this.agents.set(agentId, updatedAgent);
    this.persistAgents();

    await auditLogger.log({
      userId: "system",
      action: "phone_agent_updated",
      resource: "phone_agent",
      details: { agentId, agentName: updatedAgent.name },
      status: "success",
    });

    return updatedAgent;
  }

  /**
   * Delete a phone agent
   */
  async deleteAgent(agentId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    this.agents.delete(agentId);
    this.persistAgents();

    await auditLogger.log({
      userId: "system",
      action: "phone_agent_deleted",
      resource: "phone_agent",
      details: { agentId, agentName: agent.name },
      status: "success",
    });

    return true;
  }

  /**
   * Start a new call session
   */
  async startCall(
    agentId: string,
    callerId: string,
  ): Promise<CallSession | undefined> {
    const agent = this.agents.get(agentId);
    if (!agent) return undefined;

    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();

    const callSession: CallSession = {
      id: callId,
      agentId,
      callerId,
      startTime: now,
      status: "active",
      transcript: [],
      metrics: {
        averageSentiment: 0,
        escalated: false,
        resolved: false,
        intentRecognized: false,
      },
    };

    // Add initial greeting from agent with required disclosures
    const greeting = this.generateGreeting(agent);
    callSession.transcript.push({
      timestamp: now,
      speaker: "agent",
      text: greeting,
    });

    this.activeCalls.set(callId, callSession);

    await auditLogger.log({
      userId: callerId,
      action: "phone_call_started",
      resource: "phone_call",
      details: { callId, agentId, agentName: agent.name },
      status: "success",
    });

    return callSession;
  }

  /**
   * Process caller input during a call
   */
  async processCallerInput(
    callId: string,
    input: string,
  ): Promise<string | undefined> {
    const callSession = this.activeCalls.get(callId);
    if (!callSession || callSession.status !== "active") return undefined;

    const agent = this.agents.get(callSession.agentId);
    if (!agent) return undefined;

    const now = new Date();

    // Apply input filters
    const filteredInput = this.applyInputFilters(
      input,
      agent.filtering.inputFilters,
    );

    // Check if input was completely blocked
    if (!filteredInput.text) {
      return "I'm sorry, but I cannot process that input. Could you please rephrase?";
    }

    // Process the input with NLP
    const nlpResponse = await contextAwareNLP.processMessage(
      callSession.callerId,
      callId,
      filteredInput.text,
    );

    // Add caller's input to transcript
    callSession.transcript.push({
      timestamp: now,
      speaker: "caller",
      text: input, // Store original input for audit purposes
      sentiment: nlpResponse.sentiment?.score,
      intent: nlpResponse.intent?.name,
      entities: nlpResponse.entities?.map((e) => ({
        type: e.type,
        value: String(e.value),
      })),
      flagged: filteredInput.flagged,
      flagReason: filteredInput.flagReason,
    });

    // Update call metrics
    this.updateCallMetrics(callSession);

    // Generate agent response
    const rawResponse = nlpResponse.text;

    // Apply output filters
    const filteredOutput = this.applyOutputFilters(
      rawResponse,
      agent.filtering.outputFilters,
    );

    // Add agent's response to transcript
    callSession.transcript.push({
      timestamp: new Date(),
      speaker: "agent",
      text: filteredOutput.text,
      flagged: filteredOutput.flagged,
      flagReason: filteredOutput.flagReason,
    });

    // Update the active call
    this.activeCalls.set(callId, callSession);

    return filteredOutput.text;
  }

  /**
   * End a call session
   */
  async endCall(
    callId: string,
    reason: "completed" | "transferred" | "dropped" = "completed",
  ): Promise<CallSession | undefined> {
    const callSession = this.activeCalls.get(callId);
    if (!callSession) return undefined;

    const now = new Date();
    callSession.endTime = now;
    callSession.status = reason;
    callSession.duration = Math.round(
      (now.getTime() - callSession.startTime.getTime()) / 1000,
    );

    // Final update to call metrics
    this.updateCallMetrics(callSession);

    // Remove from active calls
    this.activeCalls.delete(callId);

    await auditLogger.log({
      userId: callSession.callerId,
      action: "phone_call_ended",
      resource: "phone_call",
      details: {
        callId,
        agentId: callSession.agentId,
        duration: callSession.duration,
        status: reason,
        metrics: callSession.metrics,
      },
      status: "success",
    });

    return callSession;
  }

  /**
   * Get an active call session
   */
  getCallSession(callId: string): CallSession | undefined {
    return this.activeCalls.get(callId);
  }

  /**
   * Get all active call sessions
   */
  getAllActiveCalls(): CallSession[] {
    return Array.from(this.activeCalls.values());
  }

  /**
   * Generate an initial greeting based on agent configuration
   */
  private generateGreeting(agent: PhoneAgentConfig): string {
    let greeting = `Hello, this is ${agent.name}. `;

    // Add recording disclosure if required
    if (agent.compliance.recordingDisclosure) {
      greeting +=
        "This call may be recorded for quality and training purposes. ";
    }

    // Add required disclosures
    if (agent.compliance.requiredDisclosures.length > 0) {
      greeting += agent.compliance.requiredDisclosures.join(" ");
    }

    // Add a friendly opening based on personality
    switch (agent.personality.tone) {
      case "professional":
        greeting += " How may I assist you today?";
        break;
      case "friendly":
        greeting += " I'm here to help you today. What can I do for you?";
        break;
      case "casual":
        greeting += " What's up? How can I help?";
        break;
      case "formal":
        greeting += " I would be pleased to assist you with your inquiry.";
        break;
      case "empathetic":
        greeting +=
          " I'm here to listen and help with whatever you need today.";
        break;
    }

    return greeting;
  }

  /**
   * Apply input filters to caller's input
   */
  private applyInputFilters(
    input: string,
    filters: FilterRule[],
  ): { text: string; flagged: boolean; flagReason?: string } {
    let result = input;
    let flagged = false;
    let flagReason = "";

    for (const filter of filters) {
      switch (filter.type) {
        case "keyword":
          if (result.toLowerCase().includes(filter.pattern.toLowerCase())) {
            switch (filter.action) {
              case "block":
                return {
                  text: "",
                  flagged: true,
                  flagReason: filter.description || "Blocked by keyword filter",
                };
              case "flag":
                flagged = true;
                flagReason = filter.description || "Flagged by keyword filter";
                break;
              case "replace":
                const regex = new RegExp(filter.pattern, "gi");
                result = result.replace(
                  regex,
                  filter.replacement || "[redacted]",
                );
                break;
              case "log":
                // Just log, no action on the text
                break;
            }
          }
          break;

        case "regex":
          try {
            const regex = new RegExp(filter.pattern, "gi");
            if (regex.test(result)) {
              switch (filter.action) {
                case "block":
                  return {
                    text: "",
                    flagged: true,
                    flagReason: filter.description || "Blocked by regex filter",
                  };
                case "flag":
                  flagged = true;
                  flagReason = filter.description || "Flagged by regex filter";
                  break;
                case "replace":
                  result = result.replace(
                    regex,
                    filter.replacement || "[redacted]",
                  );
                  break;
                case "log":
                  // Just log, no action on the text
                  break;
              }
            }
          } catch (error) {
            console.error("Invalid regex in filter:", filter.pattern, error);
          }
          break;

        // Other filter types would be implemented here
        // Semantic and sentiment filtering would require more complex analysis
      }
    }

    return {
      text: result,
      flagged,
      flagReason: flagged ? flagReason : undefined,
    };
  }

  /**
   * Apply output filters to agent's response
   */
  private applyOutputFilters(
    output: string,
    filters: FilterRule[],
  ): { text: string; flagged: boolean; flagReason?: string } {
    // Similar to input filtering but for agent responses
    // This helps ensure the agent doesn't say anything inappropriate
    return this.applyInputFilters(output, filters); // Reuse the same logic for now
  }

  /**
   * Update metrics for a call session
   */
  private updateCallMetrics(callSession: CallSession): void {
    // Calculate average sentiment
    const sentimentValues = callSession.transcript
      .filter(
        (entry) => entry.speaker === "caller" && entry.sentiment !== undefined,
      )
      .map((entry) => entry.sentiment as number);

    if (sentimentValues.length > 0) {
      callSession.metrics.averageSentiment =
        sentimentValues.reduce((sum, val) => sum + val, 0) /
        sentimentValues.length;
    }

    // Check if any intent was recognized
    callSession.metrics.intentRecognized = callSession.transcript.some(
      (entry) => entry.speaker === "caller" && entry.intent !== undefined,
    );

    // Check if call was escalated (transferred)
    callSession.metrics.escalated = callSession.status === "transferred";

    // Determine if call was resolved (simple heuristic - could be more sophisticated)
    const lastCallerEntry = [...callSession.transcript]
      .reverse()
      .find((entry) => entry.speaker === "caller");

    if (lastCallerEntry?.sentiment && lastCallerEntry.sentiment > 0.3) {
      callSession.metrics.resolved = true;
    }
  }

  /**
   * Persist agents to localStorage
   */
  private persistAgents(): void {
    if (typeof window !== "undefined") {
      try {
        const agentsObj = Object.fromEntries(this.agents.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(agentsObj));
      } catch (error) {
        console.error("Failed to store phone agents:", error);
      }
    }
  }
}

export const phoneAgent = new PhoneAgent();
