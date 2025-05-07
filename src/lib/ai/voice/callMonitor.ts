/**
 * Call Monitoring System for AI Phone Agents
 */

import { auditLogger } from "../../auth/audit";
import { CallSession } from "./phoneAgent";

export interface CallMonitorConfig {
  id: string;
  name: string;
  description?: string;
  alertThresholds: {
    negativeSentiment: number; // -1 to 0, threshold for negative sentiment alerts
    callDuration: number; // in seconds, threshold for long call alerts
    silenceDuration: number; // in seconds, threshold for silence alerts
    escalationKeywords: string[]; // keywords that might indicate need for escalation
    customThresholds?: Record<string, any>;
  };
  metrics: {
    realTimeMetrics: boolean;
    trackAgentPerformance: boolean;
    trackCallerSatisfaction: boolean;
    trackResolutionRate: boolean;
    trackEscalationRate: boolean;
    customMetrics?: string[];
  };
  notifications: {
    alertChannels: ("email" | "sms" | "dashboard" | "webhook")[];
    alertRecipients?: string[];
    webhookUrl?: string;
    alertFrequency: "immediate" | "batched" | "summary";
    batchIntervalMinutes?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CallAlert {
  id: string;
  callId: string;
  agentId: string;
  callerId: string;
  type:
    | "negative_sentiment"
    | "long_duration"
    | "silence_detected"
    | "escalation_needed"
    | "compliance_issue"
    | "custom";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  message: string;
  details?: Record<string, any>;
  status: "new" | "acknowledged" | "resolved" | "ignored";
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface CallMetrics {
  id: string;
  agentId: string;
  period: "hourly" | "daily" | "weekly" | "monthly";
  startTime: Date;
  endTime: Date;
  metrics: {
    totalCalls: number;
    totalDuration: number; // in seconds
    averageDuration: number; // in seconds
    averageSentiment: number; // -1 to 1
    resolutionRate: number; // 0 to 1
    escalationRate: number; // 0 to 1
    firstCallResolution: number; // 0 to 1
    customMetrics?: Record<string, any>;
  };
  agentPerformance?: {
    responseTime: number; // average in seconds
    sentimentImprovement: number; // average improvement in sentiment during calls
    complianceScore: number; // 0 to 1
    qualityScore: number; // 0 to 1
  };
}

class CallMonitor {
  private monitors = new Map<string, CallMonitorConfig>();
  private activeAlerts = new Map<string, CallAlert>();
  private callMetrics = new Map<string, CallMetrics>();
  private storageKey = "captivite_call_monitors";

  constructor() {
    // Load monitors from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedMonitors = localStorage.getItem(this.storageKey);
        if (storedMonitors) {
          const parsedMonitors = JSON.parse(storedMonitors);
          Object.entries(parsedMonitors).forEach(
            ([id, monitor]: [string, any]) => {
              // Convert string dates back to Date objects
              monitor.createdAt = new Date(monitor.createdAt);
              monitor.updatedAt = new Date(monitor.updatedAt);
              this.monitors.set(id, monitor as CallMonitorConfig);
            },
          );
        }
      } catch (error) {
        console.error("Failed to load call monitors from storage:", error);
      }
    }
  }

  /**
   * Create a new call monitor
   */
  async createMonitor(
    config: Omit<CallMonitorConfig, "createdAt" | "updatedAt">,
  ): Promise<CallMonitorConfig> {
    const now = new Date();
    const newMonitor: CallMonitorConfig = {
      ...config,
      createdAt: now,
      updatedAt: now,
    };

    this.monitors.set(newMonitor.id, newMonitor);
    this.persistMonitors();

    await auditLogger.log({
      userId: "system",
      action: "call_monitor_created",
      resource: "call_monitor",
      details: { monitorId: newMonitor.id, monitorName: newMonitor.name },
      status: "success",
    });

    return newMonitor;
  }

  /**
   * Get a call monitor by ID
   */
  getMonitor(monitorId: string): CallMonitorConfig | undefined {
    return this.monitors.get(monitorId);
  }

  /**
   * Get all call monitors
   */
  getAllMonitors(): CallMonitorConfig[] {
    return Array.from(this.monitors.values());
  }

  /**
   * Update a call monitor
   */
  async updateMonitor(
    monitorId: string,
    updates: Partial<Omit<CallMonitorConfig, "id" | "createdAt" | "updatedAt">>,
  ): Promise<CallMonitorConfig | undefined> {
    const monitor = this.monitors.get(monitorId);
    if (!monitor) return undefined;

    const updatedMonitor: CallMonitorConfig = {
      ...monitor,
      ...updates,
      id: monitorId, // Ensure ID doesn't change
      createdAt: monitor.createdAt, // Preserve creation date
      updatedAt: new Date(), // Update the update date
    };

    this.monitors.set(monitorId, updatedMonitor);
    this.persistMonitors();

    await auditLogger.log({
      userId: "system",
      action: "call_monitor_updated",
      resource: "call_monitor",
      details: { monitorId, monitorName: updatedMonitor.name },
      status: "success",
    });

    return updatedMonitor;
  }

  /**
   * Delete a call monitor
   */
  async deleteMonitor(monitorId: string): Promise<boolean> {
    const monitor = this.monitors.get(monitorId);
    if (!monitor) return false;

    this.monitors.delete(monitorId);
    this.persistMonitors();

    await auditLogger.log({
      userId: "system",
      action: "call_monitor_deleted",
      resource: "call_monitor",
      details: { monitorId, monitorName: monitor.name },
      status: "success",
    });

    return true;
  }

  /**
   * Monitor a call session and generate alerts if thresholds are exceeded
   */
  async monitorCall(
    callSession: CallSession,
    monitorId: string,
  ): Promise<CallAlert[]> {
    const monitor = this.monitors.get(monitorId);
    if (!monitor) return [];

    const alerts: CallAlert[] = [];

    // Check for negative sentiment
    if (
      callSession.metrics.averageSentiment <
      monitor.alertThresholds.negativeSentiment
    ) {
      const alert = this.createAlert({
        callId: callSession.id,
        agentId: callSession.agentId,
        callerId: callSession.callerId,
        type: "negative_sentiment",
        severity: "medium",
        message: "Negative sentiment detected in call",
        details: { sentiment: callSession.metrics.averageSentiment },
      });
      alerts.push(alert);
    }

    // Check for long call duration
    if (
      callSession.duration &&
      callSession.duration > monitor.alertThresholds.callDuration
    ) {
      const alert = this.createAlert({
        callId: callSession.id,
        agentId: callSession.agentId,
        callerId: callSession.callerId,
        type: "long_duration",
        severity: "low",
        message: "Call duration exceeds threshold",
        details: {
          duration: callSession.duration,
          threshold: monitor.alertThresholds.callDuration,
        },
      });
      alerts.push(alert);
    }

    // Check for escalation keywords in transcript
    const escalationKeywords = monitor.alertThresholds.escalationKeywords;
    if (escalationKeywords.length > 0) {
      const callerMessages = callSession.transcript
        .filter((entry) => entry.speaker === "caller")
        .map((entry) => entry.text.toLowerCase());

      const foundKeywords = escalationKeywords.filter((keyword) =>
        callerMessages.some((message) =>
          message.includes(keyword.toLowerCase()),
        ),
      );

      if (foundKeywords.length > 0) {
        const alert = this.createAlert({
          callId: callSession.id,
          agentId: callSession.agentId,
          callerId: callSession.callerId,
          type: "escalation_needed",
          severity: "high",
          message: "Escalation keywords detected in call",
          details: { keywords: foundKeywords },
        });
        alerts.push(alert);
      }
    }

    // Send alerts based on notification preferences
    if (alerts.length > 0) {
      await this.sendAlerts(alerts, monitor);
    }

    return alerts;
  }

  /**
   * Get all active alerts
   */
  getActiveAlerts(): CallAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Get alerts for a specific call
   */
  getCallAlerts(callId: string): CallAlert[] {
    return Array.from(this.activeAlerts.values()).filter(
      (alert) => alert.callId === callId,
    );
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(
    alertId: string,
    userId: string,
  ): Promise<CallAlert | undefined> {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return undefined;

    alert.status = "acknowledged";
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();

    this.activeAlerts.set(alertId, alert);

    await auditLogger.log({
      userId,
      action: "call_alert_acknowledged",
      resource: "call_alert",
      details: { alertId, alertType: alert.type, callId: alert.callId },
      status: "success",
    });

    return alert;
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(
    alertId: string,
    userId: string,
  ): Promise<CallAlert | undefined> {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return undefined;

    alert.status = "resolved";
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();

    // Remove from active alerts
    this.activeAlerts.delete(alertId);

    await auditLogger.log({
      userId,
      action: "call_alert_resolved",
      resource: "call_alert",
      details: { alertId, alertType: alert.type, callId: alert.callId },
      status: "success",
    });

    return alert;
  }

  /**
   * Generate call metrics for a specific period
   */
  async generateMetrics(
    agentId: string,
    period: "hourly" | "daily" | "weekly" | "monthly",
    startTime: Date,
    endTime: Date,
  ): Promise<CallMetrics> {
    // In a real implementation, this would query a database of call records
    // This is a simplified version for demonstration purposes

    const metricId = `${agentId}_${period}_${startTime.toISOString()}_${endTime.toISOString()}`;

    // Generate sample metrics
    const metrics: CallMetrics = {
      id: metricId,
      agentId,
      period,
      startTime,
      endTime,
      metrics: {
        totalCalls: Math.floor(Math.random() * 100) + 50,
        totalDuration: Math.floor(Math.random() * 50000) + 10000,
        averageDuration: Math.floor(Math.random() * 300) + 120,
        averageSentiment: Math.random() * 1.6 - 0.8, // -0.8 to 0.8
        resolutionRate: Math.random() * 0.3 + 0.6, // 0.6 to 0.9
        escalationRate: Math.random() * 0.2, // 0 to 0.2
        firstCallResolution: Math.random() * 0.4 + 0.5, // 0.5 to 0.9
      },
      agentPerformance: {
        responseTime: Math.random() * 3 + 1, // 1 to 4 seconds
        sentimentImprovement: Math.random() * 0.5, // 0 to 0.5
        complianceScore: Math.random() * 0.2 + 0.8, // 0.8 to 1.0
        qualityScore: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      },
    };

    // Store the metrics
    this.callMetrics.set(metricId, metrics);

    await auditLogger.log({
      userId: "system",
      action: "call_metrics_generated",
      resource: "call_metrics",
      details: { agentId, period, startTime, endTime },
      status: "success",
    });

    return metrics;
  }

  /**
   * Get call metrics by ID
   */
  getMetrics(metricId: string): CallMetrics | undefined {
    return this.callMetrics.get(metricId);
  }

  /**
   * Get all call metrics for an agent
   */
  getAgentMetrics(agentId: string): CallMetrics[] {
    return Array.from(this.callMetrics.values()).filter(
      (metrics) => metrics.agentId === agentId,
    );
  }

  /**
   * Create a new call alert
   */
  private createAlert(params: {
    callId: string;
    agentId: string;
    callerId: string;
    type: CallAlert["type"];
    severity: CallAlert["severity"];
    message: string;
    details?: Record<string, any>;
  }): CallAlert {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();

    const alert: CallAlert = {
      id: alertId,
      callId: params.callId,
      agentId: params.agentId,
      callerId: params.callerId,
      type: params.type,
      severity: params.severity,
      timestamp: now,
      message: params.message,
      details: params.details,
      status: "new",
    };

    this.activeAlerts.set(alertId, alert);

    return alert;
  }

  /**
   * Send alerts based on monitor configuration
   */
  private async sendAlerts(
    alerts: CallAlert[],
    monitor: CallMonitorConfig,
  ): Promise<void> {
    // In a real implementation, this would send emails, SMS, or webhook calls
    // This is a simplified version for demonstration purposes

    if (monitor.notifications.alertFrequency === "immediate") {
      for (const alert of alerts) {
        console.log(
          `[ALERT] ${alert.severity.toUpperCase()} - ${alert.message}`,
          alert,
        );

        // Log the alert
        await auditLogger.log({
          userId: "system",
          action: "call_alert_generated",
          resource: "call_alert",
          details: {
            alertId: alert.id,
            alertType: alert.type,
            severity: alert.severity,
            callId: alert.callId,
            message: alert.message,
          },
          status: "success",
        });
      }
    } else {
      // For batched or summary alerts, we would queue them for later sending
      console.log(
        `[BATCHED ALERTS] ${alerts.length} alerts queued for later delivery`,
      );
    }
  }

  /**
   * Persist monitors to localStorage
   */
  private persistMonitors(): void {
    if (typeof window !== "undefined") {
      try {
        const monitorsObj = Object.fromEntries(this.monitors.entries());
        localStorage.setItem(this.storageKey, JSON.stringify(monitorsObj));
      } catch (error) {
        console.error("Failed to store call monitors:", error);
      }
    }
  }
}

export const callMonitor = new CallMonitor();
