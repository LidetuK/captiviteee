/**
 * Batch Calling System for AI Phone Agents
 */

import { auditLogger } from "../../auth/audit";
import { phoneAgent, PhoneAgentConfig, CallSession } from "./phoneAgent";
import { callMonitor } from "./callMonitor";

export interface BatchCallConfig {
  id: string;
  name: string;
  description?: string;
  agentId: string;
  callerIds: string[];
  status: "pending" | "in_progress" | "completed" | "cancelled" | "failed";
  schedule?: {
    startTime?: Date;
    endTime?: Date;
    maxConcurrentCalls?: number;
    callSpacingSeconds?: number;
    retryCount?: number;
    retryDelayMinutes?: number;
  };
  customParameters?: Record<string, any>;
  tags?: string[];
  priority: "low" | "normal" | "high" | "urgent";
  monitorId?: string; // ID of the call monitor to use
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  completedAt?: Date;
}

export interface BatchCallProgress {
  batchId: string;
  totalCalls: number;
  completedCalls: number;
  successfulCalls: number;
  failedCalls: number;
  inProgressCalls: number;
  pendingCalls: number;
  averageDuration?: number; // in seconds
  estimatedTimeRemaining?: number; // in seconds
  startedAt?: Date;
  lastUpdatedAt: Date;
}

export interface BatchCallResult {
  batchId: string;
  callerId: string;
  callId?: string;
  status: "success" | "failed" | "cancelled" | "pending";
  duration?: number; // in seconds
  startTime?: Date;
  endTime?: Date;
  attempts: number;
  errorMessage?: string;
  metrics?: {
    averageSentiment: number;
    resolved: boolean;
    escalated: boolean;
  };
  notes?: string[];
}

class BatchCaller {
  private batchConfigs = new Map<string, BatchCallConfig>();
  private batchProgress = new Map<string, BatchCallProgress>();
  private batchResults = new Map<string, Map<string, BatchCallResult>>();
  private activeBatches = new Set<string>();
  private storageKey = "captivite_batch_calls";

  constructor() {
    // Load batch call data from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Load batch configs
          if (parsedData.batchConfigs) {
            Object.entries(parsedData.batchConfigs).forEach(([id, config]: [string, any]) => {
              // Convert string dates back to Date objects
              config.createdAt = new Date(config.createdAt);
              config.updatedAt = new Date(config.updatedAt);
              if (config.completedAt) {
                config.completedAt = new Date(config.completedAt);
              }
              if (config.schedule?.startTime) {
                config.schedule.startTime = new Date(config.schedule.startTime);
              }
              if (config.schedule?.endTime) {
                config.schedule.endTime = new Date(config.schedule.endTime);
              }
              this.batchConfigs.set(id, config as BatchCallConfig);
            });
          }
          
          // Load batch progress
          if (parsedData.batchProgress) {
            Object.entries(parsedData.batchProgress).forEach(([id, progress]: [string, any]) => {
              progress.lastUpdatedAt = new Date(progress.lastUpdatedAt);
              if (progress.startedAt) {
                progress.startedAt = new Date(progress.startedAt);
              }
              this.batchProgress.set(id, progress as BatchCallProgress);
            });
          }
          
          // Load batch results
          if (parsedData.batchResults) {
            Object.entries(parsedData.batchResults).forEach(([batchId, results]: [string, any]) => {
              const resultsMap = new Map<string, BatchCallResult>();
              Object.entries(results).forEach(([callerId, result]: [string, any]) => {
                if (result.startTime) {
                  result.startTime = new Date(result.startTime);
                }
                if (result.endTime) {
                  result.endTime = new Date(result.endTime);
                }
                resultsMap.set(callerId, result as BatchCallResult);
              });
              this.batchResults.set(batchId, resultsMap);
            });
          }
          
          // Load active batches
          if (parsedData.activeBatches) {
            parsedData.activeBatches.forEach((batchId: string) => {
              this.activeBatches.add(batchId);
            });
          }
        }
      } catch (error) {
        console.error("Failed to load batch call data from storage:", error);
      }
    }
    
    // Resume any in-progress batches
    this.resumeActiveBatches();
  }

  /**
   * Create a new batch call configuration
   */
  async createBatchCall(config: Omit<BatchCallConfig, "id" | "status" | "createdAt" | "updatedAt" | "completedAt">): Promise<BatchCallConfig> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();

    const newBatch: BatchCallConfig = {
      ...config,
      id: batchId,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };

    // Validate that the agent exists
    const agent = phoneAgent.getAgent(newBatch.agentId);
    if (!agent) {
      throw new Error(`Agent with ID ${newBatch.agentId} not found`);
    }

    // Initialize progress tracking
    const progress: BatchCallProgress = {
      batchId,
      totalCalls: newBatch.callerIds.length,
      completedCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      inProgressCalls: 0,
      pendingCalls: newBatch.callerIds.length,
      lastUpdatedAt: now
    };

    // Initialize results for each caller
    const results = new Map<string, BatchCallResult>();
    for (const callerId of newBatch.callerIds) {
      results.set(callerId, {
        batchId,
        callerId,
        status: "pending",
        attempts: 0,
      });
    }

    // Store the batch configuration, progress, and results
    this.batchConfigs.set(batchId, newBatch);
    this.batchProgress.set(batchId, progress);
    this.batchResults.set(batchId, results);
    this.persistData();

    await auditLogger.log({
      userId: newBatch.createdBy,
      action: "batch_call_created",
      resource: "batch_call",
      details: { 
        batchId, 
        batchName: newBatch.name,
        agentId: newBatch.agentId,
        callerCount: newBatch.callerIds.length
      },
      status: "success"
    });

    return newBatch;
  }

  /**
   * Get a batch call configuration by ID
   */
  getBatchCall(batchId: string): BatchCallConfig | undefined {
    return this.batchConfigs.get(batchId);
  }

  /**
   * Get all batch call configurations
   */
  getAllBatchCalls(): BatchCallConfig[] {
    return Array.from(this.batchConfigs.values());
  }

  /**
   * Get batch calls with filtering
   */
  getBatchCalls(filters: {
    status?: BatchCallConfig["status"];
    agentId?: string;
    createdBy?: string;
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
    priority?: BatchCallConfig["priority"];
  } = {}): BatchCallConfig[] {
    let filteredBatches = Array.from(this.batchConfigs.values());
    
    // Apply filters
    if (filters.status) {
      filteredBatches = filteredBatches.filter(batch => batch.status === filters.status);
    }
    
    if (filters.agentId) {
      filteredBatches = filteredBatches.filter(batch => batch.agentId === filters.agentId);
    }
    
    if (filters.createdBy) {
      filteredBatches = filteredBatches.filter(batch => batch.createdBy === filters.createdBy);
    }
    
    if (filters.startDate) {
      filteredBatches = filteredBatches.filter(batch => batch.createdAt >= filters.startDate!);
    }
    
    if (filters.endDate) {
      filteredBatches = filteredBatches.filter(batch => batch.createdAt <= filters.endDate!);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredBatches = filteredBatches.filter(batch => 
        batch.tags?.some(tag => filters.tags!.includes(tag)) ?? false
      );
    }
    
    if (filters.priority) {
      filteredBatches = filteredBatches.filter(batch => batch.priority === filters.priority);
    }
    
    return filteredBatches;
  }

  /**
   * Update a batch call configuration
   */
  async updateBatchCall(batchId: string, updates: Partial<Omit<BatchCallConfig, "id" | "createdAt" | "updatedAt" | "completedAt" | "createdBy">>): Promise<BatchCallConfig | undefined> {
    const batch = this.batchConfigs.get(batchId);
    if (!batch) return undefined;

    // Don't allow updates to in-progress or completed batches
    if (batch.status === "in_progress" || batch.status === "completed") {
      throw new Error(`Cannot update batch call with status ${batch.status}`);
    }

    const updatedBatch: BatchCallConfig = {
      ...batch,
      ...updates,
      id: batchId, // Ensure ID doesn't change
      createdAt: batch.createdAt, // Preserve creation date
      createdBy: batch.createdBy, // Preserve creator
      updatedAt: new Date() // Update the update date
    };

    // If callerIds changed, update the progress and results
    if (updates.callerIds && !this.arraysEqual(batch.callerIds, updates.callerIds)) {
      // Update progress
      const progress = this.batchProgress.get(batchId);
      if (progress) {
        progress.totalCalls = updatedBatch.callerIds.length;
        progress.pendingCalls = updatedBatch.callerIds.length - progress.completedCalls;
        progress.lastUpdatedAt = new Date();
        this.batchProgress.set(batchId, progress);
      }

      // Update results
      const results = this.batchResults.get(batchId) || new Map<string, BatchCallResult>();
      
      // Remove callers that are no longer in the list
      for (const callerId of results.keys()) {
        if (!updatedBatch.callerIds.includes(callerId)) {
          results.delete(callerId);
        }
      }
      
      // Add new callers
      for (const callerId of updatedBatch.callerIds) {
        if (!results.has(callerId)) {
          results.set(callerId, {
            batchId,
            callerId,
            status: "pending",
            attempts: 0,
          });
        }
      }
      
      this.batchResults.set(batchId, results);
    }

    this.batchConfigs.set(batchId, updatedBatch);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "batch_call_updated",
      resource: "batch_call",
      details: { batchId, batchName: updatedBatch.name },
      status: "success"
    });

    return updatedBatch;
  }

  /**
   * Delete a batch call configuration
   */
  async deleteBatchCall(batchId: string): Promise<boolean> {
    const batch = this.batchConfigs.get(batchId);
    if (!batch) return false;

    // Don't allow deletion of in-progress batches
    if (batch.status === "in_progress") {
      throw new Error("Cannot delete an in-progress batch call");
    }

    this.batchConfigs.delete(batchId);
    this.batchProgress.delete(batchId);
    this.batchResults.delete(batchId);
    this.activeBatches.delete(batchId);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "batch_call_deleted",
      resource: "batch_call",
      details: { batchId, batchName: batch.name },
      status: "success"
    });

    return true;
  }

  /**
   * Start a batch call
   */
  async startBatchCall(batchId: string): Promise<boolean> {
    const batch = this.batchConfigs.get(batchId);
    if (!batch) return false;

    // Only allow starting pending batches
    if (batch.status !== "pending") {
      throw new Error(`Cannot start batch call with status ${batch.status}`);
    }

    // Update batch status
    batch.status = "in_progress";
    batch.updatedAt = new Date();
    this.batchConfigs.set(batchId, batch);

    // Update progress
    const progress = this.batchProgress.get(batchId) || {
      batchId,
      totalCalls: batch.callerIds.length,
      completedCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      inProgressCalls: 0,
      pendingCalls: batch.callerIds.length,
      lastUpdatedAt: new Date()
    };
    
    progress.startedAt = new Date();
    progress.lastUpdatedAt = new Date();
    this.batchProgress.set(batchId, progress);

    // Add to active batches
    this.activeBatches.add(batchId);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "batch_call_started",
      resource: "batch_call",
      details: { batchId, batchName: batch.name },
      status: "success"
    });

    // Start processing the batch
    this.processBatch(batchId).catch(error => {
      console.error(`Error processing batch ${batchId}:`, error);
    });

    return true;
  }

  /**
   * Cancel a batch call
   */
  async cancelBatchCall(batchId: string): Promise<boolean> {
    const batch = this.batchConfigs.get(batchId);
    if (!batch) return false;

    // Only allow cancelling pending or in-progress batches
    if (batch.status !== "pending" && batch.status !== "in_progress") {
      throw new Error(`Cannot cancel batch call with status ${batch.status}`);
    }

    // Update batch status
    batch.status = "cancelled";
    batch.updatedAt = new Date();
    this.batchConfigs.set(batchId, batch);

    // Remove from active batches
    this.activeBatches.delete(batchId);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "batch_call_cancelled",
      resource: "batch_call",
      details: { batchId, batchName: batch.name },
      status: "success"
    });

    return true;
  }

  /**
   * Get the progress of a batch call
   */
  getBatchProgress(batchId: string): BatchCallProgress | undefined {
    return this.batchProgress.get(batchId);
  }

  /**
   * Get the results of a batch call
   */
  getBatchResults(batchId: string): BatchCallResult[] {
    const resultsMap = this.batchResults.get(batchId);
    if (!resultsMap) return [];
    
    return Array.from(resultsMap.values());
  }

  /**
   * Get a specific call result from a batch
   */
  getCallResult(batchId: string, callerId: string): BatchCallResult | undefined {
    const resultsMap = this.batchResults.get(batchId);
    if (!resultsMap) return undefined;
    
    return resultsMap.get(callerId);
  }

  /**
   * Process a batch call
   */
  private async processBatch(batchId: string): Promise<void> {
    const batch = this.batchConfigs.get(batchId);
    if (!batch || batch.status !== "in_progress") return;

    const progress = this.batchProgress.get(batchId);
    const resultsMap = this.batchResults.get(batchId);
    if (!progress || !resultsMap) return;

    try {
      // Get the agent
      const agent = phoneAgent.getAgent(batch.agentId);
      if (!agent) {
        throw new Error(`Agent with ID ${batch.agentId} not found`);
      }

      // Determine how many calls to make concurrently
      const maxConcurrent = batch.schedule?.maxConcurrentCalls || 1;
      const callSpacing = batch.schedule?.callSpacingSeconds || 0;

      // Get pending callers
      const pendingCallers = batch.callerIds.filter(callerId => {
        const result = resultsMap.get(callerId);
        return !result || result.status === "pending";
      });

      // Process calls in batches based on maxConcurrent
      for (let i = 0; i < pendingCallers.length; i += maxConcurrent) {
        // Check if batch was cancelled
        const currentBatch = this.batchConfigs.get(batchId);
        if (!currentBatch || currentBatch.status !== "in_progress") {
          break;
        }

        const currentCallers = pendingCallers.slice(i, i + maxConcurrent);
        const callPromises = currentCallers.map(callerId => this.processCall(batchId, callerId, agent));

        // Update progress
        progress.inProgressCalls = currentCallers.length;
        progress.pendingCalls = pendingCallers.length - (i + currentCallers.length);
        progress.lastUpdatedAt = new Date();
        this.batchProgress.set(batchId, progress);

        // Wait for all calls to complete
        await Promise.all(callPromises);

        // Add delay between batches if specified
        if (callSpacing && i + maxConcurrent < pendingCallers.length) {
          await new Promise(resolve => setTimeout(resolve, callSpacing * 1000));
        }
      }
    } catch (error) {
      console.error(`Error processing batch ${batchId}:`, error);
      throw error;
    }
  }

  /**
   * Resume any in-progress batches
   */
  private resumeActiveBatches(): void {
    for (const batchId of this.activeBatches) {
      const batch = this.batchConfigs.get(batchId);
      if (batch && batch.status === "in_progress") {
        this.processBatch(batchId).catch(error => {
          console.error(`Error resuming batch ${batchId}:`, error);
        });
      }
    }
  }

  /**
   * Persist batch call data to storage
   */
  private persistData(): void {
    if (typeof window !== "undefined") {
      try {
        const data = {
          batchConfigs: Object.fromEntries(this.batchConfigs),
          batchProgress: Object.fromEntries(this.batchProgress),
          batchResults: Object.fromEntries(
            Array.from(this.batchResults.entries()).map(([batchId, results]) => [
              batchId,
              Object.fromEntries(results)
            ])
          ),
          activeBatches: Array.from(this.activeBatches)
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to persist batch call data:", error);
      }
    }
  }

  /**
   * Compare two arrays for equality
   */
  private arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  /**
   * Process a single call in a batch
   */
  private async processCall(
    batchId: string,
    callerId: string,
    agent: PhoneAgentConfig
  ): Promise<void> {
    const batch = this.batchConfigs.get(batchId);
    const resultsMap = this.batchResults.get(batchId);
    if (!batch || !resultsMap) return;

    const result = resultsMap.get(callerId) || {
      batchId,
      callerId,
      status: "pending",
      attempts: 0
    };

    try {
      // Start the call
      const callSession = await phoneAgent.startCall(agent.id, callerId);
      if (!callSession) {
        throw new Error("Failed to start call");
      }

      result.callId = callSession.id;
      result.startTime = new Date();
      result.attempts++;
      result.status = "pending";
      resultsMap.set(callerId, result);

      // Wait for call to complete (polling)
      let completedSession: CallSession | undefined;
      while (!completedSession || completedSession.status === "active") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every second
        completedSession = phoneAgent.getCallSession(callSession.id);
      }
      
      if (!completedSession) {
        throw new Error("Call session was lost");
      }

      // Update result
      result.status = completedSession.status === "completed" ? "success" : "failed";
      result.endTime = completedSession.endTime;
      result.duration = completedSession.duration;
      result.metrics = {
        averageSentiment: completedSession.metrics.averageSentiment,
        resolved: completedSession.metrics.resolved,
        escalated: completedSession.metrics.escalated
      };
      result.errorMessage = completedSession.status === "dropped" ? "Call was dropped" : undefined;
      resultsMap.set(callerId, result);

      // Update progress
      const progress = this.batchProgress.get(batchId);
      if (progress) {
        progress.completedCalls++;
        progress.inProgressCalls--;
        if (result.status === "success") {
          progress.successfulCalls++;
        } else {
          progress.failedCalls++;
        }
        progress.lastUpdatedAt = new Date();
        this.batchProgress.set(batchId, progress);
      }

      // Check if batch is complete
      if (progress && progress.completedCalls === batch.callerIds.length) {
        batch.status = "completed";
        batch.completedAt = new Date();
        batch.updatedAt = new Date();
        this.batchConfigs.set(batchId, batch);
        this.activeBatches.delete(batchId);
      }

      this.persistData();
    } catch (error) {
      console.error(`Error processing call for ${callerId} in batch ${batchId}:`, error);
      result.status = "failed";
      result.errorMessage = error instanceof Error ? error.message : "Unknown error";
      resultsMap.set(callerId, result);
      this.persistData();
    }
  }
}

export const batchCaller = new BatchCaller();