interface PerformanceMetrics {
  cpu: number;
  memory: number;
  latency: number;
  throughput: number;
  errorRate: number;
  timestamp: Date;
}

interface PerformanceAnalysis {
  current: PerformanceMetrics;
  averages: Omit<PerformanceMetrics, "timestamp">;
  trends: Record<keyof Omit<PerformanceMetrics, "timestamp">, "increasing" | "decreasing" | "stable">;
  recommendations: string[];
}

type TrendDirection = "increasing" | "decreasing" | "stable";

export const performanceOptimizer = {
  metrics: new Map<string, PerformanceMetrics[]>(),

  recordMetrics: async (
    serviceId: string,
    metrics: Omit<PerformanceMetrics, "timestamp">,
  ): Promise<PerformanceMetrics> => {
    const data: PerformanceMetrics = {
      ...metrics,
      timestamp: new Date(),
    };

    if (!performanceOptimizer.metrics.has(serviceId)) {
      performanceOptimizer.metrics.set(serviceId, []);
    }
    performanceOptimizer.metrics.get(serviceId)?.push(data);

    return data;
  },

  analyzePerformance: (serviceId: string): PerformanceAnalysis | null => {
    const metrics = performanceOptimizer.metrics.get(serviceId) || [];
    if (metrics.length === 0) return null;

    const recent = metrics.slice(-10);
    const averages = calculateAverages(recent);
    const trends = calculateTrends(recent);

    return {
      current: metrics[metrics.length - 1],
      averages,
      trends,
      recommendations: generateRecommendations(averages, trends),
    };
  },

  optimizeResources: async (serviceId: string): Promise<string[] | null> => {
    const analysis = performanceOptimizer.analyzePerformance(serviceId);
    if (!analysis) return null;

    const optimizations: string[] = [];

    if (analysis.averages.cpu > 80) {
      optimizations.push("Increase CPU allocation");
    }
    if (analysis.averages.memory > 80) {
      optimizations.push("Increase memory allocation");
    }
    if (analysis.averages.latency > 1000) {
      optimizations.push("Optimize response time");
    }

    return optimizations;
  },
};

// Helper functions
const calculateAverages = (metrics: PerformanceMetrics[]): Omit<PerformanceMetrics, "timestamp"> => {
  return {
    cpu: average(metrics.map((m) => m.cpu)),
    memory: average(metrics.map((m) => m.memory)),
    latency: average(metrics.map((m) => m.latency)),
    throughput: average(metrics.map((m) => m.throughput)),
    errorRate: average(metrics.map((m) => m.errorRate)),
  };
};

const calculateTrends = (
  metrics: PerformanceMetrics[],
): Record<keyof Omit<PerformanceMetrics, "timestamp">, TrendDirection> => {
  return {
    cpu: calculateTrend(metrics.map((m) => m.cpu)),
    memory: calculateTrend(metrics.map((m) => m.memory)),
    latency: calculateTrend(metrics.map((m) => m.latency)),
    throughput: calculateTrend(metrics.map((m) => m.throughput)),
    errorRate: calculateTrend(metrics.map((m) => m.errorRate)),
  };
};

const average = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

const calculateTrend = (values: number[]): TrendDirection => {
  if (values.length < 2) return "stable";
  const change = values[values.length - 1] - values[0];
  if (Math.abs(change) < 0.1) return "stable";
  return change > 0 ? "increasing" : "decreasing";
};

const generateRecommendations = (
  averages: Omit<PerformanceMetrics, "timestamp">,
  trends: Record<keyof Omit<PerformanceMetrics, "timestamp">, TrendDirection>,
): string[] => {
  const recommendations: string[] = [];

  if (averages.cpu > 80 && trends.cpu === "increasing") {
    recommendations.push("Critical: CPU utilization trending high");
  }
  if (averages.memory > 80 && trends.memory === "increasing") {
    recommendations.push("Critical: Memory usage trending high");
  }
  if (averages.errorRate > 0.05) {
    recommendations.push("Warning: High error rate detected");
  }

  return recommendations;
};
