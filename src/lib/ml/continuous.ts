import { mlPipeline } from "./pipeline";
import { modelMonitoring } from "./monitoring";
import { modelValidator } from "./validation";

interface FeedbackData {
  modelId: string;
  input: string;
  output: string;
  correct: boolean;
  userFeedback?: string;
  timestamp: Date;
}

export const continuousLearning = {
  feedbackQueue: new Map<string, FeedbackData[]>(),
  retrainingThreshold: 100, // Number of feedback items before retraining

  collectFeedback: async (feedback: FeedbackData) => {
    const feedbackList =
      continuousLearning.feedbackQueue.get(feedback.modelId) || [];
    feedbackList.push(feedback);
    continuousLearning.feedbackQueue.set(feedback.modelId, feedbackList);

    // Check if retraining is needed
    if (feedbackList.length >= continuousLearning.retrainingThreshold) {
      await continuousLearning.triggerRetraining(feedback.modelId);
    }

    return feedback;
  },

  triggerRetraining: async (modelId: string) => {
    const feedbackList = continuousLearning.feedbackQueue.get(modelId) || [];
    if (feedbackList.length === 0) return;

    // Prepare training data
    const trainingData = feedbackList.map((feedback) => ({
      id: crypto.randomUUID(),
      text: feedback.input,
      labels: [feedback.output],
      metadata: {
        correct: feedback.correct,
        userFeedback: feedback.userFeedback,
      },
      timestamp: feedback.timestamp,
    }));

    // Train model
    const { model, metrics } = await mlPipeline.trainModel(trainingData, {
      epochs: 5,
      batchSize: 32,
    });

    // Validate model
    const validationResult = await modelValidator.validateModel(
      model,
      trainingData,
      {
        metrics: ["accuracy", "f1Score"],
        thresholds: { accuracy: 0.9, f1Score: 0.85 },
      },
    );

    if (validationResult.passed) {
      // Deploy new version
      await mlPipeline.deployModel(model, `v${Date.now()}`);
      // Clear feedback queue
      continuousLearning.feedbackQueue.set(modelId, []);
    }

    return validationResult;
  },

  evaluatePerformance: async (modelId: string) => {
    const metrics = await modelMonitoring.getMetrics(modelId);
    const stats = modelMonitoring.calculateStats(metrics);
    const anomalies = modelMonitoring.detectAnomalies(metrics);

    return {
      stats,
      anomalies,
      needsRetraining: anomalies.length > 0,
    };
  },

  manageDataset: async (modelId: string) => {
    const feedbackList = continuousLearning.feedbackQueue.get(modelId) || [];

    // Clean and preprocess data
    const cleanedData = await mlPipeline.preprocessData(feedbackList);

    // Store processed data
    await mlPipeline.collectData(cleanedData);

    return cleanedData;
  },
};
