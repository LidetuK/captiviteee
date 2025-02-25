interface Experiment {
  id: string;
  name: string;
  variants: {
    id: string;
    name: string;
    weight: number;
  }[];
  metrics: string[];
  startDate: Date;
  endDate?: Date;
}

interface ExperimentResult {
  variantId: string;
  metric: string;
  value: number;
  sampleSize: number;
}

export const abTesting = {
  experiments: new Map<string, Experiment>(),
  results: new Map<string, ExperimentResult[]>(),

  createExperiment: (experiment: Omit<Experiment, "id">) => {
    const id = crypto.randomUUID();
    const newExperiment = { id, ...experiment };
    abTesting.experiments.set(id, newExperiment);
    return newExperiment;
  },

  assignVariant: (experimentId: string, userId: string) => {
    const experiment = abTesting.experiments.get(experimentId);
    if (!experiment) return null;

    // Deterministic assignment based on user ID
    const hash = Array.from(userId).reduce(
      (h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0,
      0,
    );
    const normalizedHash = Math.abs(hash) / Math.pow(2, 32);

    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (normalizedHash <= cumulativeWeight) {
        return variant;
      }
    }

    return experiment.variants[0];
  },

  trackMetric: (
    experimentId: string,
    variantId: string,
    metric: string,
    value: number,
  ) => {
    const results = abTesting.results.get(experimentId) || [];
    results.push({ variantId, metric, value, sampleSize: 1 });
    abTesting.results.set(experimentId, results);
  },

  analyzeResults: (experimentId: string) => {
    const experiment = abTesting.experiments.get(experimentId);
    const results = abTesting.results.get(experimentId) || [];
    if (!experiment) return null;

    const analysis = experiment.metrics.map((metric) => {
      const metricResults = results.filter((r) => r.metric === metric);
      const variantResults = experiment.variants.map((variant) => {
        const variantMetrics = metricResults.filter(
          (r) => r.variantId === variant.id,
        );
        const average =
          variantMetrics.reduce((sum, r) => sum + r.value, 0) /
          variantMetrics.length;
        return { variant, average, sampleSize: variantMetrics.length };
      });

      return { metric, variantResults };
    });

    return analysis;
  },
};
