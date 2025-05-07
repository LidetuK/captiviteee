/**
 * Call Auditing System for AI Phone Agents
 */

import { auditLogger } from "../../auth/audit";
import { CallSession } from "./phoneAgent";

export interface CallAuditConfig {
  id: string;
  name: string;
  description?: string;
  schedule: {
    frequency: "daily" | "weekly" | "monthly" | "quarterly";
    sampleSize: number | string; // Number or percentage (e.g., "10%")
    randomSelection: boolean;
    includeEscalated: boolean;
    includeLongDuration: boolean;
    includeNegativeSentiment: boolean;
    customCriteria?: Record<string, any>;
  };
  compliance: {
    requiredDisclosures: string[];
    prohibitedPhrases: string[];
    sensitiveDataPatterns: string[];
    regulatoryFrameworks: string[];
    customChecks?: Record<string, any>;
  };
  quality: {
    sentimentThreshold: number;
    resolutionRequired: boolean;
    maxAllowedDuration?: number;
    requiredPhrases?: string[];
    customMetrics?: Record<string, any>;
  };
  reporting: {
    generateSummary: boolean;
    includeTranscripts: boolean;
    includeMetrics: boolean;
    includeRecommendations: boolean;
    distributionList?: string[];
    customReportSections?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CallAudit {
  id: string;
  configId: string;
  startTime: Date;
  endTime: Date;
  status: "in_progress" | "completed" | "failed";
  callsAudited: number;
  callsSelected: number;
  results: CallAuditResult[];
  summary?: CallAuditSummary;
  createdBy: string;
}

export interface CallAuditResult {
  callId: string;
  agentId: string;
  callerId: string;
  timestamp: Date;
  duration: number;
  compliance: {
    score: number; // 0-1 scale
    requiredDisclosuresPresent: boolean;
    prohibitedPhrasesPresent: boolean;
    sensitiveDataDetected: boolean;
    issues: {
      type: string;
      description: string;
      severity: "low" | "medium" | "high" | "critical";
      location: string; // e.g., "2:15" timestamp in call
    }[];
  };
  quality: {
    score: number; // 0-1 scale
    sentimentScore: number; // -1 to 1
    resolved: boolean;
    durationWithinLimits: boolean;
    requiredPhrasesPresent: boolean;
    issues: {
      type: string;
      description: string;
      severity: "low" | "medium" | "high";
      recommendation: string;
    }[];
  };
  transcript?: CallSession["transcript"];
  recommendations: string[];
}

export interface CallAuditSummary {
  overallComplianceScore: number; // 0-1 scale
  overallQualityScore: number; // 0-1 scale
  topIssues: {
    type: string;
    count: number;
    examples: string[];
    recommendations: string[];
  }[];
  trends: {
    complianceTrend: "improving" | "stable" | "declining";
    qualityTrend: "improving" | "stable" | "declining";
    sentimentTrend: "improving" | "stable" | "declining";
  };
  recommendations: string[];
  metrics: {
    averageCallDuration: number;
    averageSentiment: number;
    resolutionRate: number;
    escalationRate: number;
    complianceRate: number;
  };
}

class CallAuditor {
  private auditConfigs = new Map<string, CallAuditConfig>();
  private audits = new Map<string, CallAudit>();
  private storageKey = "captivite_call_audits";

  constructor() {
    // Load audit configs from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedConfigs = localStorage.getItem(this.storageKey);
        if (storedConfigs) {
          const parsedConfigs = JSON.parse(storedConfigs);
          Object.entries(parsedConfigs).forEach(
            ([id, config]: [string, any]) => {
              // Convert string dates back to Date objects
              config.createdAt = new Date(config.createdAt);
              config.updatedAt = new Date(config.updatedAt);
              this.auditConfigs.set(id, config as CallAuditConfig);
            },
          );
        }
      } catch (error) {
        console.error("Failed to load call audit configs from storage:", error);
      }
    }
  }

  /**
   * Create a new call audit configuration
   */
  async createAuditConfig(
    config: Omit<CallAuditConfig, "createdAt" | "updatedAt">,
  ): Promise<CallAuditConfig> {
    const now = new Date();
    const newConfig: CallAuditConfig = {
      ...config,
      createdAt: now,
      updatedAt: now,
    };

    this.auditConfigs.set(newConfig.id, newConfig);
    this.persistConfigs();

    await auditLogger.log({
      userId: "system",
      action: "call_audit_config_created",
      resource: "call_audit",
      details: { configId: newConfig.id, configName: newConfig.name },
      status: "success",
    });

    return newConfig;
  }

  /**
   * Get an audit configuration by ID
   */
  getAuditConfig(configId: string): CallAuditConfig | undefined {
    return this.auditConfigs.get(configId);
  }

  /**
   * Get all audit configurations
   */
  getAllAuditConfigs(): CallAuditConfig[] {
    return Array.from(this.auditConfigs.values());
  }

  /**
   * Update an audit configuration
   */
  async updateAuditConfig(
    configId: string,
    updates: Partial<Omit<CallAuditConfig, "id" | "createdAt" | "updatedAt">>,
  ): Promise<CallAuditConfig | undefined> {
    const config = this.auditConfigs.get(configId);
    if (!config) return undefined;

    const updatedConfig: CallAuditConfig = {
      ...config,
      ...updates,
      id: configId, // Ensure ID doesn't change
      createdAt: config.createdAt, // Preserve creation date
      updatedAt: new Date(), // Update the update date
    };

    this.auditConfigs.set(configId, updatedConfig);
    this.persistConfigs();

    await auditLogger.log({
      userId: "system",
      action: "call_audit_config_updated",
      resource: "call_audit",
      details: { configId, configName: updatedConfig.name },
      status: "success",
    });

    return updatedConfig;
  }

  /**
   * Delete an audit configuration
   */
  async deleteAuditConfig(configId: string): Promise<boolean> {
    const config = this.auditConfigs.get(configId);
    if (!config) return false;

    this.auditConfigs.delete(configId);
    this.persistConfigs();

    await auditLogger.log({
      userId: "system",
      action: "call_audit_config_deleted",
      resource: "call_audit",
      details: { configId, configName: config.name },
      status: "success",
    });

    return true;
  }

  /**
   * Start a new audit based on a configuration
   */
  async startAudit(
    configId: string,
    userId: string,
    calls: CallSession[],
  ): Promise<CallAudit | undefined> {
    const config = this.auditConfigs.get(configId);
    if (!config) return undefined;

    const now = new Date();
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Select calls to audit based on configuration criteria
    const selectedCalls = this.selectCallsForAudit(calls, config);

    const audit: CallAudit = {
      id: auditId,
      configId,
      startTime: now,
      endTime: now, // Will be updated when audit completes
      status: "in_progress",
      callsAudited: 0,
      callsSelected: selectedCalls.length,
      results: [],
      createdBy: userId,
    };

    this.audits.set(auditId, audit);

    await auditLogger.log({
      userId,
      action: "call_audit_started",
      resource: "call_audit",
      details: { auditId, configId, callsSelected: selectedCalls.length },
      status: "success",
    });

    // Process the selected calls asynchronously
    this.processAudit(auditId, selectedCalls, config).catch((error) => {
      console.error(`Error processing audit ${auditId}:`, error);
    });

    return audit;
  }

  /**
   * Get an audit by ID
   */
  getAudit(auditId: string): CallAudit | undefined {
    return this.audits.get(auditId);
  }

  /**
   * Get all audits
   */
  getAllAudits(): CallAudit[] {
    return Array.from(this.audits.values());
  }

  /**
   * Get audits for a specific configuration
   */
  getAuditsForConfig(configId: string): CallAudit[] {
    return Array.from(this.audits.values()).filter(
      (audit) => audit.configId === configId,
    );
  }

  /**
   * Select calls for audit based on configuration criteria
   */
  private selectCallsForAudit(
    calls: CallSession[],
    config: CallAuditConfig,
  ): CallSession[] {
    // Filter calls based on criteria
    let filteredCalls = [...calls];

    // Include only completed calls
    filteredCalls = filteredCalls.filter((call) => call.status === "completed");

    // Apply specific filters based on configuration
    if (config.schedule.includeEscalated) {
      // Ensure escalated calls are included
      const escalatedCalls = filteredCalls.filter(
        (call) => call.status === "transferred",
      );
      const nonEscalatedCalls = filteredCalls.filter(
        (call) => call.status !== "transferred",
      );

      // Determine sample size for non-escalated calls
      let sampleSize: number;
      if (
        typeof config.schedule.sampleSize === "string" &&
        config.schedule.sampleSize.endsWith("%")
      ) {
        const percentage = parseInt(config.schedule.sampleSize) / 100;
        sampleSize = Math.ceil(nonEscalatedCalls.length * percentage);
      } else {
        sampleSize =
          typeof config.schedule.sampleSize === "number"
            ? config.schedule.sampleSize
            : Math.min(10, nonEscalatedCalls.length);
      }

      // Select random sample of non-escalated calls
      const selectedNonEscalated = this.getRandomSample(
        nonEscalatedCalls,
        sampleSize,
      );

      // Combine with all escalated calls
      return [...escalatedCalls, ...selectedNonEscalated];
    }

    if (config.schedule.includeLongDuration) {
      // Sort by duration and include longest calls
      filteredCalls.sort((a, b) => (b.duration || 0) - (a.duration || 0));
      const longCalls = filteredCalls.slice(
        0,
        Math.ceil(filteredCalls.length * 0.2),
      ); // Top 20%
      const otherCalls = filteredCalls.slice(
        Math.ceil(filteredCalls.length * 0.2),
      );

      // Determine sample size for other calls
      let sampleSize: number;
      if (
        typeof config.schedule.sampleSize === "string" &&
        config.schedule.sampleSize.endsWith("%")
      ) {
        const percentage = parseInt(config.schedule.sampleSize) / 100;
        sampleSize = Math.ceil(otherCalls.length * percentage);
      } else {
        sampleSize =
          typeof config.schedule.sampleSize === "number"
            ? config.schedule.sampleSize
            : Math.min(10, otherCalls.length);
      }

      // Select random sample of other calls
      const selectedOtherCalls = this.getRandomSample(otherCalls, sampleSize);

      // Combine with all long calls
      return [...longCalls, ...selectedOtherCalls];
    }

    if (config.schedule.includeNegativeSentiment) {
      // Sort by sentiment (ascending, so negative first)
      filteredCalls.sort(
        (a, b) => a.metrics.averageSentiment - b.metrics.averageSentiment,
      );
      const negativeCalls = filteredCalls.filter(
        (call) => call.metrics.averageSentiment < 0,
      );
      const otherCalls = filteredCalls.filter(
        (call) => call.metrics.averageSentiment >= 0,
      );

      // Determine sample size for other calls
      let sampleSize: number;
      if (
        typeof config.schedule.sampleSize === "string" &&
        config.schedule.sampleSize.endsWith("%")
      ) {
        const percentage = parseInt(config.schedule.sampleSize) / 100;
        sampleSize = Math.ceil(otherCalls.length * percentage);
      } else {
        sampleSize =
          typeof config.schedule.sampleSize === "number"
            ? config.schedule.sampleSize
            : Math.min(10, otherCalls.length);
      }

      // Select random sample of other calls
      const selectedOtherCalls = this.getRandomSample(otherCalls, sampleSize);

      // Combine with all negative sentiment calls
      return [...negativeCalls, ...selectedOtherCalls];
    }

    // Default selection based on sample size
    let sampleSize: number;
    if (
      typeof config.schedule.sampleSize === "string" &&
      config.schedule.sampleSize.endsWith("%")
    ) {
      const percentage = parseInt(config.schedule.sampleSize) / 100;
      sampleSize = Math.ceil(filteredCalls.length * percentage);
    } else {
      sampleSize =
        typeof config.schedule.sampleSize === "number"
          ? config.schedule.sampleSize
          : Math.min(10, filteredCalls.length);
    }

    return this.getRandomSample(filteredCalls, sampleSize);
  }

  /**
   * Get a random sample of calls
   */
  private getRandomSample<T>(items: T[], sampleSize: number): T[] {
    if (sampleSize >= items.length) return items;

    const result = [...items];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.slice(0, sampleSize);
  }

  /**
   * Process an audit asynchronously
   */
  private async processAudit(
    auditId: string,
    calls: CallSession[],
    config: CallAuditConfig,
  ): Promise<void> {
    const audit = this.audits.get(auditId);
    if (!audit) return;

    try {
      // Process each call
      const results: CallAuditResult[] = [];

      for (const call of calls) {
        const result = await this.auditCall(call, config);
        results.push(result);

        // Update audit progress
        audit.callsAudited++;
        this.audits.set(auditId, audit);
      }

      // Generate summary
      if (config.reporting.generateSummary) {
        const summary = this.generateAuditSummary(results, config);
        audit.summary = summary;
      }

      // Mark audit as completed
      audit.status = "completed";
      audit.endTime = new Date();
      audit.results = results;

      this.audits.set(auditId, audit);

      await auditLogger.log({
        userId: audit.createdBy,
        action: "call_audit_completed",
        resource: "call_audit",
        details: {
          auditId,
          configId: config.id,
          callsAudited: audit.callsAudited,
          overallComplianceScore: audit.summary?.overallComplianceScore,
          overallQualityScore: audit.summary?.overallQualityScore,
        },
        status: "success",
      });
    } catch (error) {
      // Mark audit as failed
      audit.status = "failed";
      audit.endTime = new Date();
      this.audits.set(auditId, audit);

      await auditLogger.log({
        userId: audit.createdBy,
        action: "call_audit_failed",
        resource: "call_audit",
        details: { 
          auditId, 
          configId: config.id, 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        },
        status: "failure",
      });

      throw error;
    }
  }

  /**
   * Audit a single call
   */
  private async auditCall(
    call: CallSession,
    config: CallAuditConfig,
  ): Promise<CallAuditResult> {
    // In a real implementation, this would perform detailed analysis of the call
    // This is a simplified version for demonstration purposes

    // Check compliance
    const complianceIssues: CallAuditResult["compliance"]["issues"] = [];
    let requiredDisclosuresPresent = true;
    let prohibitedPhrasesPresent = false;
    let sensitiveDataDetected = false;

    // Check for required disclosures
    for (const disclosure of config.compliance.requiredDisclosures) {
      const agentMessages = call.transcript
        .filter((entry) => entry.speaker === "agent")
        .map((entry) => entry.text.toLowerCase());

      const disclosurePresent = agentMessages.some((message) =>
        message.includes(disclosure.toLowerCase()),
      );

      if (!disclosurePresent) {
        requiredDisclosuresPresent = false;
        complianceIssues.push({
          type: "missing_disclosure",
          description: `Required disclosure not present: "${disclosure}"`,
          severity: "high",
          location: "entire call",
        });
      }
    }

    // Check for prohibited phrases
    for (const phrase of config.compliance.prohibitedPhrases) {
      const allMessages = call.transcript.map((entry) =>
        entry.text.toLowerCase(),
      );

      const phrasePresent = allMessages.some((message) =>
        message.includes(phrase.toLowerCase()),
      );

      if (phrasePresent) {
        prohibitedPhrasesPresent = true;

        // Find the specific location
        const entryWithPhrase = call.transcript.find((entry) =>
          entry.text.toLowerCase().includes(phrase.toLowerCase()),
        );

        const location = entryWithPhrase
          ? `${Math.floor((entryWithPhrase.timestamp.getTime() - call.startTime.getTime()) / 1000)}s`
          : "unknown";

        complianceIssues.push({
          type: "prohibited_phrase",
          description: `Prohibited phrase detected: "${phrase}"`,
          severity: "critical",
          location,
        });
      }
    }

    // Check for sensitive data patterns
    for (const pattern of config.compliance.sensitiveDataPatterns) {
      try {
        const regex = new RegExp(pattern, "i");

        for (const entry of call.transcript) {
          if (regex.test(entry.text)) {
            sensitiveDataDetected = true;

            const location = `${Math.floor((entry.timestamp.getTime() - call.startTime.getTime()) / 1000)}s`;

            complianceIssues.push({
              type: "sensitive_data",
              description: `Sensitive data pattern detected: "${pattern}"`,
              severity: "critical",
              location,
            });

            break; // Only report once per pattern
          }
        }
      } catch (error) {
        console.error(`Invalid regex pattern: ${pattern}`, error);
      }
    }

    // Calculate compliance score
    const complianceScore = this.calculateComplianceScore(
      requiredDisclosuresPresent,
      prohibitedPhrasesPresent,
      sensitiveDataDetected,
      complianceIssues.length,
    );

    // Check quality
    const qualityIssues: CallAuditResult["quality"]["issues"] = [];
    const sentimentScore = call.metrics.averageSentiment;
    const resolved = call.metrics.resolved;

    // Check if sentiment is below threshold
    if (sentimentScore < config.quality.sentimentThreshold) {
      qualityIssues.push({
        type: "low_sentiment",
        description: `Call sentiment (${sentimentScore.toFixed(2)}) below threshold (${config.quality.sentimentThreshold})`,
        severity: "medium",
        recommendation:
          "Review agent responses for empathy and solution-oriented language",
      });
    }

    // Check if call was resolved
    if (config.quality.resolutionRequired && !resolved) {
      qualityIssues.push({
        type: "unresolved_call",
        description: "Call ended without resolution",
        severity: "high",
        recommendation:
          "Review call flow and agent responses for missed opportunities to resolve the issue",
      });
    }

    // Check call duration
    const durationWithinLimits = config.quality.maxAllowedDuration
      ? (call.duration || 0) <= config.quality.maxAllowedDuration
      : true;

    if (!durationWithinLimits) {
      qualityIssues.push({
        type: "excessive_duration",
        description: `Call duration (${call.duration}s) exceeds maximum allowed (${config.quality.maxAllowedDuration}s)`,
        severity: "medium",
        recommendation:
          "Review call for efficiency opportunities and unnecessary delays",
      });
    }

    // Check for required phrases
    let requiredPhrasesPresent = true;
    if (
      config.quality.requiredPhrases &&
      config.quality.requiredPhrases.length > 0
    ) {
      const agentMessages = call.transcript
        .filter((entry) => entry.speaker === "agent")
        .map((entry) => entry.text.toLowerCase());

      for (const phrase of config.quality.requiredPhrases) {
        const phrasePresent = agentMessages.some((message) =>
          message.includes(phrase.toLowerCase()),
        );

        if (!phrasePresent) {
          requiredPhrasesPresent = false;
          qualityIssues.push({
            type: "missing_phrase",
            description: `Required quality phrase not present: "${phrase}"`,
            severity: "low",
            recommendation: `Ensure agents include "${phrase}" in their responses`,
          });
        }
      }
    }

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(
      sentimentScore,
      resolved,
      durationWithinLimits,
      requiredPhrasesPresent,
      qualityIssues.length,
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      complianceIssues,
      qualityIssues,
      call,
    );

    // Create the audit result
    const result: CallAuditResult = {
      callId: call.id,
      agentId: call.agentId,
      callerId: call.callerId,
      timestamp: call.startTime,
      duration: call.duration || 0,
      compliance: {
        score: complianceScore,
        requiredDisclosuresPresent,
        prohibitedPhrasesPresent,
        sensitiveDataDetected,
        issues: complianceIssues,
      },
      quality: {
        score: qualityScore,
        sentimentScore,
        resolved,
        durationWithinLimits,
        requiredPhrasesPresent,
        issues: qualityIssues,
      },
      recommendations,
      transcript: config.reporting.includeTranscripts
        ? call.transcript
        : undefined,
    };

    return result;
  }

  /**
   * Calculate compliance score based on issues
   */
  private calculateComplianceScore(
    requiredDisclosuresPresent: boolean,
    prohibitedPhrasesPresent: boolean,
    sensitiveDataDetected: boolean,
    issueCount: number,
  ): number {
    let score = 1.0; // Start with perfect score

    // Major deductions for serious issues
    if (!requiredDisclosuresPresent) score -= 0.3;
    if (prohibitedPhrasesPresent) score -= 0.4;
    if (sensitiveDataDetected) score -= 0.5;

    // Additional deduction based on issue count
    score -= Math.min(0.5, issueCount * 0.1);

    return Math.max(0, score);
  }

  /**
   * Calculate quality score based on issues
   */
  private calculateQualityScore(
    sentimentScore: number,
    resolved: boolean,
    durationWithinLimits: boolean,
    requiredPhrasesPresent: boolean,
    issueCount: number,
  ): number {
    let score = 0.7; // Start with baseline score

    // Adjust based on sentiment (convert -1 to 1 scale to 0 to 0.3 contribution)
    score += (sentimentScore + 1) * 0.15;

    // Adjust based on resolution
    if (resolved) score += 0.1;

    // Adjust based on duration
    if (durationWithinLimits) score += 0.05;

    // Adjust based on required phrases
    if (requiredPhrasesPresent) score += 0.05;

    // Deduct for issues
    score -= Math.min(0.3, issueCount * 0.05);

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Generate recommendations based on issues
   */
  private generateRecommendations(
    complianceIssues: CallAuditResult["compliance"]["issues"],
    qualityIssues: CallAuditResult["quality"]["issues"],
    call: CallSession,
  ): string[] {
    const recommendations: string[] = [];

    // Add recommendations from quality issues
    qualityIssues.forEach((issue) => {
      if (
        issue.recommendation &&
        !recommendations.includes(issue.recommendation)
      ) {
        recommendations.push(issue.recommendation);
      }
    });

    // Add recommendations for compliance issues
    if (complianceIssues.some((issue) => issue.type === "missing_disclosure")) {
      recommendations.push(
        "Ensure all required disclosures are provided at the beginning of the call",
      );
    }

    if (complianceIssues.some((issue) => issue.type === "prohibited_phrase")) {
      recommendations.push(
        "Review prohibited phrases with agents and implement additional training",
      );
    }

    if (complianceIssues.some((issue) => issue.type === "sensitive_data")) {
      recommendations.push(
        "Implement stronger data protection measures and agent training on handling sensitive information",
      );
    }

    // Add general recommendations based on call metrics
    if (call.metrics.averageSentiment < 0) {
      recommendations.push(
        "Focus on improving customer sentiment through more empathetic responses",
      );
    }

    if (!call.metrics.resolved) {
      recommendations.push(
        "Improve first-call resolution rate by enhancing agent training on problem-solving",
      );
    }

    return recommendations;
  }

  /**
   * Generate a summary for an audit
   */
  private generateAuditSummary(
    results: CallAuditResult[],
    config: CallAuditConfig,
  ): CallAuditSummary {
    // Calculate overall scores
    const overallComplianceScore =
      results.reduce((sum, result) => sum + result.compliance.score, 0) /
      results.length;
    const overallQualityScore =
      results.reduce((sum, result) => sum + result.quality.score, 0) /
      results.length;

    // Collect all issues
    const allComplianceIssues = results.flatMap(
      (result) => result.compliance.issues,
    );
    const allQualityIssues = results.flatMap((result) => result.quality.issues);

    // Count issues by type
    const issueCountsByType = new Map<
      string,
      { count: number; examples: string[]; recommendations: Set<string> }
    >();

    // Process compliance issues
    allComplianceIssues.forEach((issue) => {
      const entry = issueCountsByType.get(issue.type) || {
        count: 0,
        examples: [],
        recommendations: new Set<string>(),
      };
      entry.count++;
      if (entry.examples.length < 3) {
        entry.examples.push(issue.description);
      }
      issueCountsByType.set(issue.type, entry);
    });

    // Process quality issues
    allQualityIssues.forEach((issue) => {
      const entry = issueCountsByType.get(issue.type) || {
        count: 0,
        examples: [],
        recommendations: new Set<string>(),
      };
      entry.count++;
      if (entry.examples.length < 3) {
        entry.examples.push(issue.description);
      }
      if (issue.recommendation) {
        entry.recommendations.add(issue.recommendation);
      }
      issueCountsByType.set(issue.type, entry);
    });

    // Sort issues by count and convert to array
    const topIssues = Array.from(issueCountsByType.entries())
      .map(([type, data]) => ({
        type,
        count: data.count,
        examples: data.examples,
        recommendations: Array.from(data.recommendations),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 issues

    // Calculate metrics
    const averageCallDuration =
      results.reduce((sum, result) => sum + result.duration, 0) /
      results.length;
    const averageSentiment =
      results.reduce((sum, result) => sum + result.quality.sentimentScore, 0) /
      results.length;
    const resolutionRate =
      results.filter((result) => result.quality.resolved).length /
      results.length;
    const escalationRate = 0; // Not tracked in this simplified version
    const complianceRate =
      results.filter((result) => result.compliance.score > 0.8).length /
      results.length;

    // Determine trends (simplified - in a real implementation this would compare to previous audits)
    const trends = {
      complianceTrend: "stable" as const,
      qualityTrend: "stable" as const,
      sentimentTrend: "stable" as const,
    };

    // Collect all recommendations
    const allRecommendations = new Set<string>();
    results.forEach((result) => {
      result.recommendations.forEach((rec) => allRecommendations.add(rec));
    });

    return {
      overallComplianceScore,
      overallQualityScore,
      topIssues,
      trends,
      recommendations: Array.from(allRecommendations),
      metrics: {
        averageCallDuration,
        averageSentiment,
        resolutionRate,
        escalationRate,
        complianceRate,
      },
    };
  }

  /**
   * Persist audit configurations to localStorage
   */
  private persistConfigs(): void {
    if (typeof window !== "undefined") {
      try {
        const configsObj = Object.fromEntries(this.auditConfigs.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(configsObj));
      } catch (error) {
        console.error("Failed to store call audit configs:", error);
      }
    }
  }
}

export const callAuditor = new CallAuditor();
