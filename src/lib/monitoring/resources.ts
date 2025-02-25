interface ResourceMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
}

export const resourceMonitor = {
  metrics: new Map<string, ResourceMetrics[]>(),

  collectMetrics: async (): Promise<ResourceMetrics> => {
    // Collect actual metrics here
    return {
      cpu: {
        usage: Math.random() * 100,
        cores: 4,
      },
      memory: {
        total: 16000,
        used: Math.random() * 16000,
        free: Math.random() * 16000,
      },
      disk: {
        total: 500000,
        used: Math.random() * 500000,
        free: Math.random() * 500000,
      },
      network: {
        bytesIn: Math.random() * 1000000,
        bytesOut: Math.random() * 1000000,
      },
    };
  },

  storeMetrics: (metrics: ResourceMetrics) => {
    const date = new Date().toISOString().split("T")[0];
    if (!resourceMonitor.metrics.has(date)) {
      resourceMonitor.metrics.set(date, []);
    }
    resourceMonitor.metrics.get(date)?.push(metrics);
  },

  getUtilization: () => {
    const latest = Array.from(resourceMonitor.metrics.values())
      .flat()
      .slice(-1)[0];

    if (!latest) return null;

    return {
      cpu: latest.cpu.usage,
      memory: (latest.memory.used / latest.memory.total) * 100,
      disk: (latest.disk.used / latest.disk.total) * 100,
    };
  },
};
