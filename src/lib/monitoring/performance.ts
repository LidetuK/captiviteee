interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  successRate: number;
  concurrentUsers: number;
  timestamp: Date;
}

export const performanceMonitor = {
  metrics: new Map<string, PerformanceMetrics[]>(),
  benchmarks: new Map<string, Record<string, number>>(),

  trackMetrics: async (
    serviceId: string,
    metrics: Omit<PerformanceMetrics, "timestamp">,
  ) => {
    const data: PerformanceMetrics = {
      ...metrics,
      timestamp: new Date(),
    };

    if (!performanceMonitor.metrics.has(serviceId)) {
      performanceMonitor.metrics.set(serviceId, []);
    }
    performanceMonitor.metrics.get(serviceId)?.push(data);

    return data;
  },

  setBenchmark: (serviceId: string, metrics: Record<string, number>) => {
    performanceMonitor.benchmarks.set(serviceId, metrics);
  },

  compareWithBenchmark: (serviceId: string) => {
    const metrics = performanceMonitor.metrics.get(serviceId) || [];
    const benchmark = performanceMonitor.benchmarks.get(serviceId);

    if (!benchmark || metrics.length === 0) return null;

    const current = metrics[metrics.length - 1];
    const comparison = {};

    Object.entries(benchmark).forEach(([key, target]) => {
      comparison[key] = {
        current: current[key],
        target,
        difference: ((current[key] - target) / target) * 100,
        status: current[key] >= target ? "meeting" : "below",
      };
    });

    return comparison;
  },

  generateReport: (serviceId: string) => {
    const metrics = performanceMonitor.metrics.get(serviceId) || [];
    const benchmark = performanceMonitor.benchmarks.get(serviceId);

    return {
      current: metrics[metrics.length - 1],
      averages: calculateAverages(metrics),
      trends: calculateTrends(metrics),
      benchmarkComparison: benchmark
        ? performanceMonitor.compareWithBenchmark(serviceId)
        : null,
      recommendations: generateRecommendations(metrics, benchmark),
    };
  },
};

// Helper functions
const calculateAverages = (metrics: PerformanceMetrics[]) => {
  return {
    responseTime: average(metrics.map((m) => m.responseTime)),
    throughput: average(metrics.map((m) => m.throughput)),
    errorRate: average(metrics.map((m) => m.errorRate)),
    successRate: average(metrics.map((m) => m.successRate)),
  };
};

const calculateTrends = (metrics: PerformanceMetrics[]) => {
  // Calculate performance trends
  return {
    responseTime: calculateTrend(metrics.map((m) => m.responseTime)),
    throughput: calculateTrend(metrics.map((m) => m.throughput)),
    errorRate: calculateTrend(metrics.map((m) => m.errorRate)),
    successRate: calculateTrend(metrics.map((m) => m.successRate)),
  };
};

const calculateTrend = (
  values: number[],
): "improving" | "stable" | "declining" => {
  if (values.length < 2) return "stable";
  const change = values[values.length - 1] - values[0];
  if (Math.abs(change) < 0.1) return "stable";
  return change > 0 ? "improving" : "declining";
};

const average = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

const generateRecommendations = (
  metrics: PerformanceMetrics[],
  benchmark?: Record<string, number>,
) => {
  const recommendations = [];
  const latest = metrics[metrics.length - 1];

  if (latest.errorRate > 0.05) {
    recommendations.push("Investigate and address high error rates");
  }
  if (latest.responseTime > (benchmark?.responseTime || 1000)) {
    recommendations.push("Optimize response time performance");
  }
  if (latest.successRate < 0.95) {
    recommendations.push("Improve success rate through error handling");
  }

  return recommendations;
};
