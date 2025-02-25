interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  resource: string;
  data: any;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  retryCount: number;
}

export const syncManager = {
  operations: new Map<string, SyncOperation[]>(),
  maxRetries: 3,

  queueOperation: async (
    operation: Omit<
      SyncOperation,
      "id" | "timestamp" | "status" | "retryCount"
    >,
  ) => {
    const newOperation: SyncOperation = {
      id: crypto.randomUUID(),
      ...operation,
      timestamp: new Date(),
      status: "pending",
      retryCount: 0,
    };

    const queue = syncManager.operations.get(operation.resource) || [];
    queue.push(newOperation);
    syncManager.operations.set(operation.resource, queue);

    return newOperation;
  },

  processQueue: async (resource: string) => {
    const queue = syncManager.operations.get(resource) || [];
    const results = [];

    for (const operation of queue) {
      try {
        // Process operation
        operation.status = "completed";
        results.push(operation);
      } catch (error) {
        operation.retryCount++;
        if (operation.retryCount >= syncManager.maxRetries) {
          operation.status = "failed";
        }
        results.push(operation);
      }
    }

    // Remove completed operations
    syncManager.operations.set(
      resource,
      queue.filter((op) => op.status === "pending"),
    );

    return results;
  },

  getStatus: (resource: string) => {
    const queue = syncManager.operations.get(resource) || [];
    return {
      pending: queue.filter((op) => op.status === "pending").length,
      completed: queue.filter((op) => op.status === "completed").length,
      failed: queue.filter((op) => op.status === "failed").length,
    };
  },
};
