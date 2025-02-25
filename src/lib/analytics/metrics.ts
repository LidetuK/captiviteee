interface MetricDefinition {
  id: string;
  name: string;
  calculation: (data: any) => number;
  format?: (value: number) => string;
}

export const metricTracker = {
  metrics: new Map<string, MetricDefinition>(),
  values: new Map<string, number[]>(),

  defineMetric: (metric: MetricDefinition) => {
    metricTracker.metrics.set(metric.id, metric);
    return metric;
  },

  trackMetric: (metricId: string, value: number) => {
    if (!metricTracker.values.has(metricId)) {
      metricTracker.values.set(metricId, []);
    }
    metricTracker.values.get(metricId)?.push(value);
  },

  calculateMetric: (metricId: string, data?: any) => {
    const metric = metricTracker.metrics.get(metricId);
    if (!metric) return null;

    if (data) {
      return metric.calculation(data);
    }

    const values = metricTracker.values.get(metricId) || [];
    return values.length > 0 ? values[values.length - 1] : null;
  },

  getMetricHistory: (
    metricId: string,
    timeRange?: { start: Date; end: Date },
  ) => {
    return metricTracker.values.get(metricId) || [];
  },

  formatMetric: (metricId: string, value: number) => {
    const metric = metricTracker.metrics.get(metricId);
    if (!metric || !metric.format) return value.toString();
    return metric.format(value);
  },
};

// Define common metrics
metricTracker.defineMetric({
  id: "conversion_rate",
  name: "Conversion Rate",
  calculation: (data: { conversions: number; visitors: number }) =>
    (data.conversions / data.visitors) * 100,
  format: (value: number) => `${value.toFixed(2)}%`,
});

metricTracker.defineMetric({
  id: "roi",
  name: "ROI",
  calculation: (data: { revenue: number; cost: number }) =>
    ((data.revenue - data.cost) / data.cost) * 100,
  format: (value: number) => `${value.toFixed(2)}%`,
});
