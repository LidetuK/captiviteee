interface MetricData {
  timestamp: Date;
  modelId: string;
  version: string;
  metrics: Record<string, number>;
}

export const modelMonitoring = {
  metrics: new Map<string, MetricData[]>(),

  recordMetrics: async (
    modelId: string,
    version: string,
    metrics: Record<string, number>,
  ) => {
    const data: MetricData = {
      timestamp: new Date(),
      modelId,
      version,
      metrics,
    };

    if (!modelMonitoring.metrics.has(modelId)) {
      modelMonitoring.metrics.set(modelId, []);
    }

    modelMonitoring.metrics.get(modelId)?.push(data);
    return data;
  },

  getMetrics: (modelId: string, timeRange?: { start: Date; end: Date }) => {
    const metrics = modelMonitoring.metrics.get(modelId) || [];

    if (timeRange) {
      return metrics.filter(
        (m) => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end,
      );
    }

    return metrics;
  },

  calculateStats: (metrics: MetricData[]) => {
    const stats: Record<string, { min: number; max: number; avg: number }> = {};

    metrics.forEach((data) => {
      Object.entries(data.metrics).forEach(([key, value]) => {
        if (!stats[key]) {
          stats[key] = { min: value, max: value, avg: value };
        } else {
          stats[key].min = Math.min(stats[key].min, value);
          stats[key].max = Math.max(stats[key].max, value);
          stats[key].avg = (stats[key].avg + value) / 2;
        }
      });
    });

    return stats;
  },

  detectAnomalies: (metrics: MetricData[]) => {
    const stats = modelMonitoring.calculateStats(metrics);
    const anomalies = [];

    metrics.forEach((data) => {
      Object.entries(data.metrics).forEach(([key, value]) => {
        const stat = stats[key];
        const threshold = (stat.max - stat.min) * 0.2;

        if (Math.abs(value - stat.avg) > threshold) {
          anomalies.push({
            timestamp: data.timestamp,
            metric: key,
            value,
            expected: stat.avg,
            deviation: Math.abs(value - stat.avg),
          });
        }
      });
    });

    return anomalies;
  },
};
