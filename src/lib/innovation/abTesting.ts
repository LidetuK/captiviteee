interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: {
    id: string;
    name: string;
    weight: number;
    config: Record<string, any>;
  }[];
  metrics: string[];
  startDate: Date;
  endDate?: Date;
  status: "draft" | "running" | "completed" | "stopped";
  results?: Record<string, any>;
}

export const abTestManager = {
  experiments: new Map<string, Experiment>(),
  userAssignments: new Map<string, Record<string, string>>(),

  createExperiment: (experiment: Omit<Experiment, "id" | "status">) => {
    const newExperiment: Experiment = {
      id: crypto.randomUUID(),
      ...experiment,
      status: "draft",
    };

    abTestManager.experiments.set(newExperiment.id, newExperiment);
    return newExperiment;
  },

  startExperiment: (experimentId: string) => {
    const experiment = abTestManager.experiments.get(experimentId);
    if (!experiment) throw new Error("Experiment not found");

    experiment.status = "running";
    experiment.startDate = new Date();
    return experiment;
  },

  assignVariant: (experimentId: string, userId: string) => {
    const experiment = abTestManager.experiments.get(experimentId);
    if (!experiment) return null;

    // Check if user already has an assignment
    const userAssignments = abTestManager.userAssignments.get(userId) || {};
    if (userAssignments[experimentId]) {
      return experiment.variants.find(
        (v) => v.id === userAssignments[experimentId],
      );
    }

    // Assign variant based on weights
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        userAssignments[experimentId] = variant.id;
        abTestManager.userAssignments.set(userId, userAssignments);
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
    const experiment = abTestManager.experiments.get(experimentId);
    if (!experiment) return;

    if (!experiment.results) {
      experiment.results = {};
    }

    if (!experiment.results[metric]) {
      experiment.results[metric] = {};
    }

    if (!experiment.results[metric][variantId]) {
      experiment.results[metric][variantId] = [];
    }

    experiment.results[metric][variantId].push(value);
  },

  analyzeResults: (experimentId: string) => {
    const experiment = abTestManager.experiments.get(experimentId);
    if (!experiment || !experiment.results) return null;

    const analysis = {};

    for (const metric of experiment.metrics) {
      const metricResults = experiment.results[metric] || {};
      analysis[metric] = {};

      for (const variant of experiment.variants) {
        const values = metricResults[variant.id] || [];
        if (values.length === 0) continue;

        analysis[metric][variant.id] = {
          mean: calculateMean(values),
          confidenceInterval: calculateConfidenceInterval(values),
          sampleSize: values.length,
        };
      }
    }

    return analysis;
  },

  stopExperiment: (experimentId: string) => {
    const experiment = abTestManager.experiments.get(experimentId);
    if (!experiment) return;

    experiment.status = "completed";
    experiment.endDate = new Date();
    return experiment;
  },
};

// Helper functions
const calculateMean = (values: number[]): number => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const calculateConfidenceInterval = (values: number[]): [number, number] => {
  const mean = calculateMean(values);
  const stdDev = Math.sqrt(
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      (values.length - 1),
  );
  const marginOfError = 1.96 * (stdDev / Math.sqrt(values.length));

  return [mean - marginOfError, mean + marginOfError];
};
