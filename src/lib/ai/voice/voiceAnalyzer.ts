/**
 * Voice Analysis System for AI Phone Agents
 */

import { auditLogger } from "../../auth/audit";
import { CallSession, CallTranscriptEntry } from "./phoneAgent";

export interface VoiceAnalysisConfig {
  id: string;
  name: string;
  description?: string;
  features: {
    toneAnalysis: boolean;
    speechRate: boolean;
    voiceQuality: boolean;
    accentDetection: boolean;
    emotionDetection: boolean;
    stressDetection: boolean;
    hesitationDetection: boolean;
    customFeatures?: string[];
  };
  thresholds: {
    minSpeechRate: number; // words per minute
    maxSpeechRate: number; // words per minute
    minPitch: number; // Hz
    maxPitch: number; // Hz
    emotionConfidenceThreshold: number; // 0-1 scale
    customThresholds?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceAnalysisResult {
  id: string;
  callId: string;
  agentId: string;
  callerId: string;
  timestamp: Date;
  duration: number; // in seconds
  overallQuality: number; // 0-1 scale
  segments: VoiceSegmentAnalysis[];
  metrics: {
    averageSpeechRate: number; // words per minute
    averagePitch: number; // Hz
    pitchVariation: number; // standard deviation
    emotionDistribution: Record<string, number>; // emotion to percentage
    hesitationCount: number;
    silencePercentage: number; // 0-1 scale
    interruptionCount: number;
    customMetrics?: Record<string, any>;
  };
  issues: {
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
    timestamp: number; // seconds into the call
    duration?: number; // in seconds
    recommendation?: string;
  }[];
  recommendations: string[];
}

export interface VoiceSegmentAnalysis {
  startTime: number; // seconds into the call
  endTime: number; // seconds into the call
  speaker: "agent" | "caller";
  text: string;
  speechRate: number; // words per minute
  pitch: {
    average: number; // Hz
    min: number; // Hz
    max: number; // Hz
    variation: number; // standard deviation
  };
  volume: {
    average: number; // 0-1 scale
    min: number; // 0-1 scale
    max: number; // 0-1 scale
    variation: number; // standard deviation
  };
  emotions: {
    primary: string;
    secondary?: string;
    confidence: number; // 0-1 scale
    intensity: number; // 0-1 scale
  };
  stress: {
    detected: boolean;
    level: number; // 0-1 scale
    confidence: number; // 0-1 scale
  };
  hesitations: {
    count: number;
    timestamps: number[]; // seconds into the segment
    duration: number; // total duration in seconds
  };
  quality: number; // 0-1 scale
  issues?: string[];
}

class VoiceAnalyzer {
  private configs = new Map<string, VoiceAnalysisConfig>();
  private results = new Map<string, VoiceAnalysisResult>();
  private storageKey = "captivite_voice_analysis";

  constructor() {
    // Load voice analysis data from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // Load configs
          if (parsedData.configs) {
            Object.entries(parsedData.configs).forEach(
              ([id, config]: [string, any]) => {
                // Convert string dates back to Date objects
                config.createdAt = new Date(config.createdAt);
                config.updatedAt = new Date(config.updatedAt);
                this.configs.set(id, config as VoiceAnalysisConfig);
              },
            );
          }

          // Load results
          if (parsedData.results) {
            Object.entries(parsedData.results).forEach(
              ([id, result]: [string, any]) => {
                result.timestamp = new Date(result.timestamp);
                this.results.set(id, result as VoiceAnalysisResult);
              },
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load voice analysis data from storage:",
          error,
        );
      }
    }
  }

  /**
   * Create a new voice analysis configuration
   */
  async createConfig(
    config: Omit<VoiceAnalysisConfig, "createdAt" | "updatedAt">,
  ): Promise<VoiceAnalysisConfig> {
    const now = new Date();
    const newConfig: VoiceAnalysisConfig = {
      ...config,
      createdAt: now,
      updatedAt: now,
    };

    this.configs.set(newConfig.id, newConfig);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "voice_analysis_config_created",
      resource: "voice_analysis",
      details: { configId: newConfig.id, configName: newConfig.name },
      status: "success",
    });

    return newConfig;
  }

  /**
   * Get a voice analysis configuration by ID
   */
  getConfig(configId: string): VoiceAnalysisConfig | undefined {
    return this.configs.get(configId);
  }

  /**
   * Get all voice analysis configurations
   */
  getAllConfigs(): VoiceAnalysisConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Update a voice analysis configuration
   */
  async updateConfig(
    configId: string,
    updates: Partial<
      Omit<VoiceAnalysisConfig, "id" | "createdAt" | "updatedAt">
    >,
  ): Promise<VoiceAnalysisConfig | undefined> {
    const config = this.configs.get(configId);
    if (!config) return undefined;

    const updatedConfig: VoiceAnalysisConfig = {
      ...config,
      ...updates,
      id: configId, // Ensure ID doesn't change
      createdAt: config.createdAt, // Preserve creation date
      updatedAt: new Date(), // Update the update date
    };

    this.configs.set(configId, updatedConfig);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "voice_analysis_config_updated",
      resource: "voice_analysis",
      details: { configId, configName: updatedConfig.name },
      status: "success",
    });

    return updatedConfig;
  }

  /**
   * Delete a voice analysis configuration
   */
  async deleteConfig(configId: string): Promise<boolean> {
    const config = this.configs.get(configId);
    if (!config) return false;

    this.configs.delete(configId);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "voice_analysis_config_deleted",
      resource: "voice_analysis",
      details: { configId, configName: config.name },
      status: "success",
    });

    return true;
  }

  /**
   * Analyze a call session
   */
  async analyzeCall(
    callSession: CallSession,
    configId: string,
  ): Promise<VoiceAnalysisResult> {
    const config = this.configs.get(configId);
    if (!config) {
      throw new Error(
        `Voice analysis configuration with ID ${configId} not found`,
      );
    }

    // Generate a unique ID for the analysis result
    const resultId = `voice_analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Analyze the call segments
    const segments = this.analyzeCallSegments(callSession, config);

    // Calculate overall metrics
    const metrics = this.calculateOverallMetrics(
      segments,
      callSession.duration || 0,
    );

    // Identify issues
    const issues = this.identifyIssues(segments, config);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      issues,
      metrics,
      config,
    );

    // Calculate overall quality score
    const overallQuality = this.calculateOverallQuality(
      segments,
      issues,
      metrics,
    );

    // Create the analysis result
    const result: VoiceAnalysisResult = {
      id: resultId,
      callId: callSession.id,
      agentId: callSession.agentId,
      callerId: callSession.callerId,
      timestamp: new Date(),
      duration: callSession.duration || 0,
      overallQuality,
      segments,
      metrics,
      issues,
      recommendations,
    };

    // Store the result
    this.results.set(resultId, result);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "voice_analysis_completed",
      resource: "voice_analysis",
      details: {
        resultId,
        callId: callSession.id,
        overallQuality,
        issueCount: issues.length,
      },
      status: "success",
    });

    return result;
  }

  /**
   * Get a voice analysis result by ID
   */
  getAnalysisResult(resultId: string): VoiceAnalysisResult | undefined {
    return this.results.get(resultId);
  }

  /**
   * Get all voice analysis results
   */
  getAllAnalysisResults(): VoiceAnalysisResult[] {
    return Array.from(this.results.values());
  }

  /**
   * Get voice analysis results for a specific call
   */
  getCallAnalysisResults(callId: string): VoiceAnalysisResult[] {
    return Array.from(this.results.values()).filter(
      (result) => result.callId === callId,
    );
  }

  /**
   * Analyze call segments
   */
  private analyzeCallSegments(
    callSession: CallSession,
    config: VoiceAnalysisConfig,
  ): VoiceSegmentAnalysis[] {
    // In a real implementation, this would analyze actual audio data
    // This is a simplified version for demonstration purposes

    const segments: VoiceSegmentAnalysis[] = [];
    let currentTime = 0;

    for (const entry of callSession.transcript) {
      // Simulate segment duration based on text length (very simplified)
      const wordCount = entry.text.split(/\s+/).length;
      const segmentDuration = Math.max(1, wordCount * 0.5); // Rough estimate: 0.5 seconds per word

      // Simulate speech rate
      const speechRate = Math.floor(
        Math.random() *
          (config.thresholds.maxSpeechRate - config.thresholds.minSpeechRate) +
          config.thresholds.minSpeechRate,
      );

      // Simulate pitch
      const avgPitch = Math.floor(
        Math.random() *
          (config.thresholds.maxPitch - config.thresholds.minPitch) +
          config.thresholds.minPitch,
      );
      const pitchVariation = Math.random() * 20;

      // Simulate volume
      const avgVolume = 0.5 + Math.random() * 0.3;
      const volumeVariation = Math.random() * 0.2;

      // Simulate emotions
      const emotions = this.simulateEmotions(entry, config);

      // Simulate stress
      const stress = {
        detected: Math.random() > 0.7,
        level: Math.random(),
        confidence: 0.5 + Math.random() * 0.5,
      };

      // Simulate hesitations
      const hesitationCount = Math.floor(Math.random() * 3);
      const hesitationTimestamps = Array.from(
        { length: hesitationCount },
        () => Math.random() * segmentDuration,
      );
      const hesitationDuration = hesitationCount * 0.5; // 0.5 seconds per hesitation

      // Calculate segment quality
      const quality = 0.5 + Math.random() * 0.5;

      // Create segment analysis
      const segment: VoiceSegmentAnalysis = {
        startTime: currentTime,
        endTime: currentTime + segmentDuration,
        speaker: entry.speaker,
        text: entry.text,
        speechRate,
        pitch: {
          average: avgPitch,
          min: avgPitch - pitchVariation,
          max: avgPitch + pitchVariation,
          variation: pitchVariation,
        },
        volume: {
          average: avgVolume,
          min: Math.max(0, avgVolume - volumeVariation),
          max: Math.min(1, avgVolume + volumeVariation),
          variation: volumeVariation,
        },
        emotions,
        stress,
        hesitations: {
          count: hesitationCount,
          timestamps: hesitationTimestamps,
          duration: hesitationDuration,
        },
        quality,
      };

      segments.push(segment);
      currentTime += segmentDuration;
    }

    return segments;
  }

  /**
   * Simulate emotion detection for a transcript entry
   */
  private simulateEmotions(
    entry: CallTranscriptEntry,
    config: VoiceAnalysisConfig,
  ): VoiceSegmentAnalysis["emotions"] {
    // Use sentiment from transcript if available
    if (entry.sentiment !== undefined) {
      // Map sentiment score to emotion
      let primaryEmotion: string;
      if (entry.sentiment > 0.3) {
        primaryEmotion = Math.random() > 0.5 ? "happy" : "satisfied";
      } else if (entry.sentiment < -0.3) {
        primaryEmotion = Math.random() > 0.5 ? "angry" : "frustrated";
      } else {
        primaryEmotion = Math.random() > 0.5 ? "neutral" : "calm";
      }

      // Generate secondary emotion
      const secondaryOptions = {
        happy: ["excited", "pleased", "content"],
        satisfied: ["content", "pleased", "calm"],
        angry: ["frustrated", "annoyed", "impatient"],
        frustrated: ["annoyed", "impatient", "concerned"],
        neutral: ["calm", "attentive", "interested"],
        calm: ["neutral", "attentive", "interested"],
      };

      const secondaryEmotion =
        secondaryOptions[primaryEmotion as keyof typeof secondaryOptions][
          Math.floor(Math.random() * 3)
        ];

      return {
        primary: primaryEmotion,
        secondary: secondaryEmotion,
        confidence: 0.7 + Math.random() * 0.3,
        intensity: Math.abs(entry.sentiment) * 2, // Scale -0.5 to 0.5 to 0-1
      };
    }

    // If no sentiment available, generate random emotions
    const emotions = [
      "happy",
      "sad",
      "angry",
      "frustrated",
      "neutral",
      "calm",
      "excited",
      "concerned",
    ];
    const primaryEmotion =
      emotions[Math.floor(Math.random() * emotions.length)];

    // Filter out primary emotion for secondary
    const secondaryEmotions = emotions.filter((e) => e !== primaryEmotion);
    const secondaryEmotion =
      secondaryEmotions[Math.floor(Math.random() * secondaryEmotions.length)];

    return {
      primary: primaryEmotion,
      secondary: Math.random() > 0.3 ? secondaryEmotion : undefined,
      confidence: 0.5 + Math.random() * 0.5,
      intensity: Math.random(),
    };
  }

  /**
   * Calculate overall metrics from segments
   */
  private calculateOverallMetrics(
    segments: VoiceSegmentAnalysis[],
    callDuration: number,
  ): VoiceAnalysisResult["metrics"] {
    // Calculate average speech rate
    const speechRates = segments.map((s) => s.speechRate);
    const averageSpeechRate =
      speechRates.reduce((sum, rate) => sum + rate, 0) / segments.length;

    // Calculate average pitch
    const pitches = segments.map((s) => s.pitch.average);
    const averagePitch =
      pitches.reduce((sum, pitch) => sum + pitch, 0) / segments.length;

    // Calculate pitch variation (standard deviation)
    const pitchVariation = Math.sqrt(
      pitches.reduce(
        (sum, pitch) => sum + Math.pow(pitch - averagePitch, 2),
        0,
      ) / segments.length,
    );

    // Calculate emotion distribution
    const emotionCounts: Record<string, number> = {};
    segments.forEach((segment) => {
      const emotion = segment.emotions.primary;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const emotionDistribution: Record<string, number> = {};
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      emotionDistribution[emotion] = count / segments.length;
    });

    // Count hesitations
    const hesitationCount = segments.reduce(
      (sum, segment) => sum + segment.hesitations.count,
      0,
    );

    // Calculate silence percentage (simplified)
    const totalHesitationDuration = segments.reduce(
      (sum, segment) => sum + segment.hesitations.duration,
      0,
    );
    const silencePercentage = totalHesitationDuration / callDuration;

    // Count interruptions (simplified - detect overlapping segments)
    const interruptionCount = 0; // In a real implementation, this would detect overlapping speech

    return {
      averageSpeechRate,
      averagePitch,
      pitchVariation,
      emotionDistribution,
      hesitationCount,
      silencePercentage,
      interruptionCount,
    };
  }

  /**
   * Identify issues in the call
   */
  private identifyIssues(
    segments: VoiceSegmentAnalysis[],
    config: VoiceAnalysisConfig,
  ): VoiceAnalysisResult["issues"] {
    const issues: VoiceAnalysisResult["issues"] = [];

    // Check speech rate issues
    segments.forEach((segment) => {
      if (segment.speechRate < config.thresholds.minSpeechRate) {
        issues.push({
          type: "low_speech_rate",
          description: `Speech rate too slow (${Math.round(segment.speechRate)} WPM)`,
          severity: "medium",
          timestamp: segment.startTime,
          duration: segment.endTime - segment.startTime,
          recommendation: "Increase speaking pace for better engagement",
        });
      } else if (segment.speechRate > config.thresholds.maxSpeechRate) {
        issues.push({
          type: "high_speech_rate",
          description: `Speech rate too fast (${Math.round(segment.speechRate)} WPM)`,
          severity: "medium",
          timestamp: segment.startTime,
          duration: segment.endTime - segment.startTime,
          recommendation: "Slow down speech for better clarity",
        });
      }
    });

    // Check for stress indicators
    segments.forEach((segment) => {
      if (
        segment.stress.detected &&
        segment.stress.level > 0.7 &&
        segment.stress.confidence > 0.6
      ) {
        issues.push({
          type: "high_stress",
          description: "High stress level detected in voice",
          severity: "high",
          timestamp: segment.startTime,
          duration: segment.endTime - segment.startTime,
          recommendation: "Use calming techniques and reassuring language",
        });
      }
    });

    // Check for excessive hesitations
    segments.forEach((segment) => {
      if (segment.hesitations.count > 2 && segment.speaker === "agent") {
        issues.push({
          type: "excessive_hesitation",
          description: `${segment.hesitations.count} hesitations detected in short segment`,
          severity: "low",
          timestamp: segment.startTime,
          duration: segment.endTime - segment.startTime,
          recommendation: "Improve preparation and confidence in responses",
        });
      }
    });

    // Check for negative emotions from caller
    segments.forEach((segment) => {
      if (
        segment.speaker === "caller" &&
        ["angry", "frustrated", "annoyed", "impatient"].includes(
          segment.emotions.primary,
        ) &&
        segment.emotions.confidence >
          config.thresholds.emotionConfidenceThreshold
      ) {
        issues.push({
          type: "negative_caller_emotion",
          description: `Caller expressing ${segment.emotions.primary} emotion`,
          severity: "high",
          timestamp: segment.startTime,
          duration: segment.endTime - segment.startTime,
          recommendation:
            "Use empathetic responses and address concerns directly",
        });
      }
    });

    // Check for monotone speech (low pitch variation)
    segments.forEach((segment) => {
      if (segment.speaker === "agent" && segment.pitch.variation < 10) {
        issues.push({
          type: "monotone_speech",
          description: "Low vocal variety detected (monotone speech)",
          severity: "low",
          timestamp: segment.startTime,
          duration: segment.endTime - segment.startTime,
          recommendation:
            "Increase vocal variety and emphasis for better engagement",
        });
      }
    });

    return issues;
  }

  /**
   * Generate recommendations based on issues and metrics
   */
  private generateRecommendations(
    issues: VoiceAnalysisResult["issues"],
    metrics: VoiceAnalysisResult["metrics"],
    config: VoiceAnalysisConfig,
  ): string[] {
    const recommendations = new Set<string>();

    // Add recommendations from issues
    issues.forEach((issue) => {
      if (issue.recommendation) {
        recommendations.add(issue.recommendation);
      }
    });

    // Add general recommendations based on metrics
    if (metrics.averageSpeechRate < config.thresholds.minSpeechRate * 1.1) {
      recommendations.add(
        "Overall speech rate is slow. Consider increasing pace for better engagement.",
      );
    } else if (
      metrics.averageSpeechRate >
      config.thresholds.maxSpeechRate * 0.9
    ) {
      recommendations.add(
        "Overall speech rate is fast. Consider slowing down for better clarity.",
      );
    }

    if (metrics.pitchVariation < 15) {
      recommendations.add(
        "Increase vocal variety to make speech more engaging and expressive.",
      );
    }

    if (metrics.hesitationCount > 10) {
      recommendations.add(
        "Reduce hesitations and filler words for more confident communication.",
      );
    }

    if (
      metrics.emotionDistribution["angry"] > 0.2 ||
      metrics.emotionDistribution["frustrated"] > 0.2
    ) {
      recommendations.add(
        "High levels of negative emotions detected. Focus on de-escalation techniques and empathetic responses.",
      );
    }

    // Add general best practices if few specific recommendations
    if (recommendations.size < 3) {
      recommendations.add(
        "Maintain a balanced pace and clear articulation throughout calls.",
      );
      recommendations.add(
        "Use active listening techniques to improve caller satisfaction.",
      );
      recommendations.add(
        "Incorporate personalized elements to build rapport with callers.",
      );
    }

    return Array.from(recommendations);
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallQuality(
    segments: VoiceSegmentAnalysis[],
    issues: VoiceAnalysisResult["issues"],
    metrics: VoiceAnalysisResult["metrics"],
  ): number {
    // Start with base score
    let score = 0.7;

    // Adjust based on segment quality (agent segments only)
    const agentSegments = segments.filter((s) => s.speaker === "agent");
    if (agentSegments.length > 0) {
      const avgAgentQuality =
        agentSegments.reduce((sum, s) => sum + s.quality, 0) /
        agentSegments.length;
      score += (avgAgentQuality - 0.5) * 0.3; // Adjust by up to ±0.15
    }

    // Penalize for issues
    const issuePenalties = {
      low: 0.02,
      medium: 0.05,
      high: 0.1,
    };

    issues.forEach((issue) => {
      score -= issuePenalties[issue.severity];
    });

    // Adjust based on emotion distribution
    const positiveEmotions = [
      "happy",
      "satisfied",
      "calm",
      "excited",
      "pleased",
      "content",
    ];
    const negativeEmotions = [
      "angry",
      "frustrated",
      "annoyed",
      "impatient",
      "concerned",
      "sad",
    ];

    let positivePercentage = 0;
    let negativePercentage = 0;

    Object.entries(metrics.emotionDistribution).forEach(
      ([emotion, percentage]) => {
        if (positiveEmotions.includes(emotion)) {
          positivePercentage += percentage;
        } else if (negativeEmotions.includes(emotion)) {
          negativePercentage += percentage;
        }
      },
    );

    score += (positivePercentage - negativePercentage) * 0.2; // Adjust by up to ±0.2

    // Ensure score is within 0-1 range
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Persist data to localStorage
   */
  private persistData(): void {
    if (typeof window !== "undefined") {
      try {
        const data = {
          configs: Object.fromEntries(this.configs.entries()),
          results: Object.fromEntries(this.results.entries()),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to store voice analysis data:", error);
      }
    }
  }
}

export const voiceAnalyzer = new VoiceAnalyzer();
