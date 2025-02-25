interface HealthMetrics {
  cpu: number;
  memory: number;
  latency: number;
  errorRate: number;
  uptime: number;
}

interface ServiceStatus {
  service: string;
  status: "healthy" | "degraded" | "down";
  metrics: HealthMetrics;
  lastCheck: Date;
}

export const healthMonitor = {
  services: new Map<string, ServiceStatus>(),

  checkHealth: async (service: string): Promise<ServiceStatus> => {
    const metrics = await healthMonitor.collectMetrics(service);
    const status = healthMonitor.evaluateHealth(metrics);

    const serviceStatus = {
      service,
      status,
      metrics,
      lastCheck: new Date(),
    };

    healthMonitor.services.set(service, serviceStatus);
    return serviceStatus;
  },

  collectMetrics: async (service: string): Promise<HealthMetrics> => {
    // Collect real metrics here
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      latency: Math.random() * 1000,
      errorRate: Math.random() * 5,
      uptime: 99.9,
    };
  },

  evaluateHealth: (metrics: HealthMetrics): "healthy" | "degraded" | "down" => {
    if (metrics.errorRate > 5 || metrics.latency > 1000) return "down";
    if (metrics.cpu > 80 || metrics.memory > 80) return "degraded";
    return "healthy";
  },

  getSystemStatus: () => {
    const statuses = Array.from(healthMonitor.services.values());
    return {
      overall: statuses.every((s) => s.status === "healthy")
        ? "healthy"
        : "degraded",
      services: statuses,
    };
  },
};
