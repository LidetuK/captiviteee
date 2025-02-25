interface APIMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
}

export const apiMetrics = {
  metrics: new Map<string, APIMetrics[]>(),

  track: (metric: Omit<APIMetrics, "timestamp">) => {
    const newMetric = {
      ...metric,
      timestamp: new Date(),
    };

    const key = `${metric.method}:${metric.endpoint}`;
    if (!apiMetrics.metrics.has(key)) {
      apiMetrics.metrics.set(key, []);
    }
    apiMetrics.metrics.get(key)?.push(newMetric);

    return newMetric;
  },

  getMetrics: (endpoint?: string, timeRange?: { start: Date; end: Date }) => {
    const allMetrics = Array.from(apiMetrics.metrics.values()).flat();

    return allMetrics.filter((metric) => {
      const matchesEndpoint = !endpoint || metric.endpoint === endpoint;
      const inTimeRange =
        !timeRange ||
        (metric.timestamp >= timeRange.start &&
          metric.timestamp <= timeRange.end);
      return matchesEndpoint && inTimeRange;
    });
  },

  getAverageResponseTime: (endpoint: string) => {
    const metrics = apiMetrics.metrics.get(endpoint) || [];
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, m) => sum + m.responseTime, 0);
    return total / metrics.length;
  },

  getErrorRate: (endpoint: string) => {
    const metrics = apiMetrics.metrics.get(endpoint) || [];
    if (metrics.length === 0) return 0;

    const errors = metrics.filter((m) => m.statusCode >= 400).length;
    return errors / metrics.length;
  },
};
