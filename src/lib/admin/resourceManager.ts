interface ResourceAllocation {
  id: string;
  type: "cpu" | "memory" | "storage" | "network";
  allocated: number;
  used: number;
  limit: number;
  metadata?: Record<string, any>;
}

export const resourceManager = {
  allocations: new Map<string, ResourceAllocation>(),

  allocateResource: async (
    type: ResourceAllocation["type"],
    amount: number,
  ) => {
    const allocation: ResourceAllocation = {
      id: crypto.randomUUID(),
      type,
      allocated: amount,
      used: 0,
      limit: amount,
    };

    resourceManager.allocations.set(allocation.id, allocation);
    return allocation;
  },

  updateAllocation: async (
    id: string,
    updates: Partial<ResourceAllocation>,
  ) => {
    const allocation = resourceManager.allocations.get(id);
    if (!allocation) throw new Error("Allocation not found");

    const updatedAllocation = { ...allocation, ...updates };
    resourceManager.allocations.set(id, updatedAllocation);
    return updatedAllocation;
  },

  deallocateResource: async (id: string) => {
    return resourceManager.allocations.delete(id);
  },

  getResourceUsage: () => {
    const usage = {
      cpu: { total: 0, used: 0 },
      memory: { total: 0, used: 0 },
      storage: { total: 0, used: 0 },
      network: { total: 0, used: 0 },
    };

    resourceManager.allocations.forEach((allocation) => {
      usage[allocation.type].total += allocation.allocated;
      usage[allocation.type].used += allocation.used;
    });

    return usage;
  },

  optimizeResources: async () => {
    const usage = resourceManager.getResourceUsage();
    const recommendations = [];

    Object.entries(usage).forEach(([type, metrics]) => {
      const utilizationRate = metrics.used / metrics.total;
      if (utilizationRate > 0.8) {
        recommendations.push(`Scale up ${type} resources`);
      } else if (utilizationRate < 0.2) {
        recommendations.push(`Consider reducing ${type} allocation`);
      }
    });

    return recommendations;
  },
};
