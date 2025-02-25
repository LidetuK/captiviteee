interface ResourceMetrics {
  cpu: {
    total: number;
    used: number;
    available: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
  };
}

export const resourceManager = {
  resources: new Map<string, ResourceMetrics>(),

  allocateResources: async (
    serviceId: string,
    requirements: {
      cpu: number;
      memory: number;
      disk: number;
    },
  ) => {
    const available = resourceManager.getAvailableResources();

    if (
      requirements.cpu > available.cpu.available ||
      requirements.memory > available.memory.available ||
      requirements.disk > available.disk.available
    ) {
      throw new Error("Insufficient resources");
    }

    const allocation: ResourceMetrics = {
      cpu: {
        total: requirements.cpu,
        used: 0,
        available: requirements.cpu,
      },
      memory: {
        total: requirements.memory,
        used: 0,
        available: requirements.memory,
      },
      disk: {
        total: requirements.disk,
        used: 0,
        available: requirements.disk,
      },
    };

    resourceManager.resources.set(serviceId, allocation);
    return allocation;
  },

  updateUsage: (
    serviceId: string,
    usage: {
      cpu?: number;
      memory?: number;
      disk?: number;
    },
  ) => {
    const resources = resourceManager.resources.get(serviceId);
    if (!resources) return null;

    if (usage.cpu !== undefined) {
      resources.cpu.used = usage.cpu;
      resources.cpu.available = resources.cpu.total - usage.cpu;
    }

    if (usage.memory !== undefined) {
      resources.memory.used = usage.memory;
      resources.memory.available = resources.memory.total - usage.memory;
    }

    if (usage.disk !== undefined) {
      resources.disk.used = usage.disk;
      resources.disk.available = resources.disk.total - usage.disk;
    }

    return resources;
  },

  getAvailableResources: () => {
    const total = {
      cpu: { total: 100, used: 0, available: 100 },
      memory: { total: 1024, used: 0, available: 1024 },
      disk: { total: 10000, used: 0, available: 10000 },
    };

    resourceManager.resources.forEach((resources) => {
      total.cpu.used += resources.cpu.used;
      total.memory.used += resources.memory.used;
      total.disk.used += resources.disk.used;
    });

    total.cpu.available = total.cpu.total - total.cpu.used;
    total.memory.available = total.memory.total - total.memory.used;
    total.disk.available = total.disk.total - total.disk.used;

    return total;
  },

  optimizeResources: () => {
    const recommendations = [];
    const available = resourceManager.getAvailableResources();

    if (available.cpu.available < available.cpu.total * 0.2) {
      recommendations.push("Critical: Low CPU availability");
    }
    if (available.memory.available < available.memory.total * 0.2) {
      recommendations.push("Critical: Low memory availability");
    }
    if (available.disk.available < available.disk.total * 0.2) {
      recommendations.push("Warning: Low disk space");
    }

    return recommendations;
  },
};
