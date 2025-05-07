/**
 * Audit logging system for authentication and authorization events
 */

export interface AuditLogEntry {
  id?: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  status: "success" | "failure" | "warning";
}

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "success" | "failure" | "warning";
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private storageKey = "captivite_audit_logs";

  constructor() {
    // Load logs from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedLogs = localStorage.getItem(this.storageKey);
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs);
          // Convert string timestamps back to Date objects
          this.logs = parsedLogs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
        }
      } catch (error) {
        console.error("Failed to load audit logs from storage:", error);
      }
    }
  }

  /**
   * Log an authentication or authorization event
   */
  async log(
    entry: Omit<AuditLogEntry, "id" | "timestamp" | "status"> & {
      status?: "success" | "failure" | "warning";
    },
  ): Promise<AuditLogEntry> {
    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      status: entry.status || "success",
      ...entry,
    };

    // Add browser info if available
    if (typeof window !== "undefined") {
      logEntry.userAgent = navigator.userAgent;
    }

    this.logs.unshift(logEntry); // Add to beginning of array for chronological order

    // Persist logs to localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        // Keep only the last 1000 logs to prevent storage issues
        const logsToStore = this.logs.slice(0, 1000);
        localStorage.setItem(this.storageKey, JSON.stringify(logsToStore));
      } catch (error) {
        console.error("Failed to store audit logs:", error);
      }
    }

    // In a real implementation, this would send the log to a server
    console.info("Audit log:", logEntry);

    return logEntry;
  }

  /**
   * Get all audit logs, optionally filtered
   */
  getLogs(filter?: AuditLogFilter): AuditLogEntry[] {
    if (!filter) return [...this.logs];

    return this.logs.filter((log) => {
      if (filter.userId && log.userId !== filter.userId) return false;
      if (filter.action && log.action !== filter.action) return false;
      if (filter.resource && log.resource !== filter.resource) return false;
      if (filter.status && log.status !== filter.status) return false;
      if (filter.startDate && log.timestamp < filter.startDate) return false;
      if (filter.endDate && log.timestamp > filter.endDate) return false;
      return true;
    });
  }

  /**
   * Get logs for a specific user
   */
  getUserLogs(userId: string): AuditLogEntry[] {
    return this.getLogs({ userId });
  }

  /**
   * Clear all logs (primarily for testing)
   */
  clearLogs(): void {
    this.logs = [];
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export const auditLogger = new AuditLogger();
