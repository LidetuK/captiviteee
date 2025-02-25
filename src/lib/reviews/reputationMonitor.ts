import { messaging } from "../messaging";

interface Alert {
  type: "negative_review" | "rating_drop" | "volume_change";
  severity: "low" | "medium" | "high";
  message: string;
  data: any;
}

export const reputationMonitor = {
  thresholds: {
    ratingDrop: 0.5,
    negativeReviewThreshold: -0.3,
    volumeChangeThreshold: 0.3,
  },

  checkMetrics: async (currentMetrics: any, historicalMetrics: any) => {
    const alerts: Alert[] = [];

    // Check for rating drops
    const ratingDrop =
      historicalMetrics.averageRating - currentMetrics.averageRating;
    if (ratingDrop >= reputationMonitor.thresholds.ratingDrop) {
      alerts.push({
        type: "rating_drop",
        severity: ratingDrop >= 1 ? "high" : "medium",
        message: `Average rating dropped by ${ratingDrop.toFixed(1)} stars`,
        data: { ratingDrop, currentRating: currentMetrics.averageRating },
      });
    }

    // Check for negative sentiment trends
    if (
      currentMetrics.sentimentScore <=
      reputationMonitor.thresholds.negativeReviewThreshold
    ) {
      alerts.push({
        type: "negative_review",
        severity: "high",
        message: "Significant increase in negative sentiment detected",
        data: { sentimentScore: currentMetrics.sentimentScore },
      });
    }

    // Check for unusual volume changes
    const volumeChange = Math.abs(
      (currentMetrics.totalReviews - historicalMetrics.totalReviews) /
        historicalMetrics.totalReviews,
    );
    if (volumeChange >= reputationMonitor.thresholds.volumeChangeThreshold) {
      alerts.push({
        type: "volume_change",
        severity: "medium",
        message: `Unusual change in review volume detected (${(volumeChange * 100).toFixed(1)}% change)`,
        data: { volumeChange, currentVolume: currentMetrics.totalReviews },
      });
    }

    // Emit alerts
    alerts.forEach((alert) => {
      messaging.emit("REPUTATION_ALERT", alert);
    });

    return alerts;
  },

  generateReport: async (metrics: any, alerts: Alert[]) => {
    return {
      timestamp: new Date(),
      metrics,
      alerts,
      recommendations: alerts.map((alert) => {
        switch (alert.type) {
          case "negative_review":
            return "Increase response rate to negative reviews and address common concerns";
          case "rating_drop":
            return "Review recent changes in service/product and gather customer feedback";
          case "volume_change":
            return "Investigate potential causes for review volume changes";
          default:
            return "";
        }
      }),
    };
  },
};
