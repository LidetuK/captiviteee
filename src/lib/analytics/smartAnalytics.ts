import { metricTracker } from "./metrics";
import { analyticsDashboard } from "./dashboard";

export interface SmartInsight {
  id: string;
  type: "opportunity" | "risk" | "trend" | "anomaly";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  metric?: string;
  value?: number | string;
  change?: number;
  recommendation?: string;
  category: string;
  timestamp: Date;
}

export interface PredictiveModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastUpdated: Date;
  metrics: string[];
  status: "active" | "training" | "paused";
}

export interface AnalyticsTimeframe {
  label: string;
  value: string;
  days: number;
}

export const timeframes: AnalyticsTimeframe[] = [
  { label: "Today", value: "today", days: 1 },
  { label: "Yesterday", value: "yesterday", days: 1 },
  { label: "Last 7 days", value: "7days", days: 7 },
  { label: "Last 30 days", value: "30days", days: 30 },
  { label: "Last 90 days", value: "90days", days: 90 },
  { label: "This year", value: "year", days: 365 },
];

export interface ForecastData {
  date: string;
  value: number;
  isProjected: boolean;
}

export interface AnomalyData {
  metric: string;
  date: string;
  expected: number;
  actual: number;
  deviation: number;
  significance: "high" | "medium" | "low";
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  category: string;
}

export const smartAnalytics = {
  // Get AI-generated insights based on data patterns
  getInsights: async (
    organizationId: string,
    timeframe: string = "30days",
  ): Promise<SmartInsight[]> => {
    // This would connect to a real ML backend in production
    // For now, we'll return mock insights
    return [
      {
        id: "insight-1",
        type: "opportunity",
        title: "Increase in mobile conversions",
        description:
          "Mobile conversion rate has increased by 15% in the last 30 days",
        impact: "high",
        metric: "conversion_rate",
        value: "8.5%",
        change: 15,
        recommendation:
          "Consider allocating more resources to mobile optimization",
        category: "conversion",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "insight-2",
        type: "risk",
        title: "Declining engagement in email campaigns",
        description:
          "Email open rates have decreased by 8% compared to previous period",
        impact: "medium",
        metric: "email_open_rate",
        value: "22.3%",
        change: -8,
        recommendation: "Review email subject lines and sending frequency",
        category: "engagement",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "insight-3",
        type: "trend",
        title: "Increasing customer acquisition cost",
        description: "CAC has increased by 12% over the last quarter",
        impact: "medium",
        metric: "customer_acquisition_cost",
        value: "$125",
        change: 12,
        recommendation:
          "Review marketing channel efficiency and optimize spend",
        category: "acquisition",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "insight-4",
        type: "anomaly",
        title: "Unusual spike in support requests",
        description: "Support tickets increased by 35% on Tuesday",
        impact: "high",
        metric: "support_tickets",
        value: "142",
        change: 35,
        recommendation:
          "Investigate potential product issues from recent deployment",
        category: "support",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "insight-5",
        type: "opportunity",
        title: "High engagement with new feature",
        description: "Users are spending 2.5x more time with the new dashboard",
        impact: "high",
        metric: "feature_engagement",
        value: "250%",
        change: 150,
        recommendation:
          "Consider expanding feature capabilities based on usage patterns",
        category: "product",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: "insight-6",
        type: "trend",
        title: "Increasing revenue per user",
        description: "Average revenue per user has grown steadily by 8%",
        impact: "medium",
        metric: "arpu",
        value: "$85",
        change: 8,
        recommendation:
          "Analyze which customer segments are driving this growth",
        category: "revenue",
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
    ];
  },

  // Get predictive models available for the organization
  getPredictiveModels: async (
    organizationId: string,
  ): Promise<PredictiveModel[]> => {
    // Mock data for predictive models
    return [
      {
        id: "model-1",
        name: "Customer Churn Predictor",
        description:
          "Predicts likelihood of customer churn based on engagement patterns",
        accuracy: 0.85,
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        metrics: ["engagement_score", "login_frequency", "feature_usage"],
        status: "active",
      },
      {
        id: "model-2",
        name: "Revenue Forecaster",
        description:
          "Projects revenue for next quarter based on historical data and trends",
        accuracy: 0.78,
        lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        metrics: ["mrr", "conversion_rate", "customer_lifetime_value"],
        status: "active",
      },
      {
        id: "model-3",
        name: "Lead Scoring Model",
        description:
          "Scores leads based on likelihood to convert to paying customers",
        accuracy: 0.82,
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        metrics: ["website_visits", "content_engagement", "email_responses"],
        status: "active",
      },
      {
        id: "model-4",
        name: "Customer Segmentation",
        description:
          "Automatically segments customers based on behavior patterns",
        accuracy: 0.91,
        lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        metrics: ["purchase_history", "engagement_level", "demographic_data"],
        status: "training",
      },
    ];
  },

  // Get forecast data for key metrics
  getForecasts: async (
    organizationId: string,
    metrics: string[] = ["revenue", "customers", "churn"],
  ): Promise<Record<string, ForecastData[]>> => {
    // Mock forecast data
    const today = new Date();
    const forecasts: Record<string, ForecastData[]> = {};

    metrics.forEach((metric) => {
      const data: ForecastData[] = [];
      let baseValue = Math.random() * 1000;
      const trend = Math.random() * 0.2 - 0.1; // Random trend between -10% and +10%

      // Generate 12 months of forecast data
      for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() + i);

        // Add some randomness to the trend
        const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
        baseValue = baseValue * (1 + trend) * randomFactor;

        data.push({
          date: date.toISOString().split("T")[0],
          value: Math.round(baseValue * 100) / 100,
          isProjected: true,
        });
      }

      forecasts[metric] = data;
    });

    return forecasts;
  },

  // Get anomaly detection results
  getAnomalies: async (
    organizationId: string,
    timeframe: string = "30days",
  ): Promise<AnomalyData[]> => {
    // Mock anomaly data
    return [
      {
        metric: "website_traffic",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        expected: 1250,
        actual: 1850,
        deviation: 48,
        significance: "high",
      },
      {
        metric: "conversion_rate",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        expected: 3.2,
        actual: 2.1,
        deviation: -34,
        significance: "medium",
      },
      {
        metric: "average_order_value",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        expected: 85,
        actual: 110,
        deviation: 29,
        significance: "medium",
      },
    ];
  },

  // Get recommendations based on data analysis
  getRecommendations: async (organizationId: string): Promise<Recommendation[]> => {
    // Mock recommendations
    return [
      {
        id: "rec-1",
        title: "Optimize email campaign timing",
        description:
          "Based on open rate analysis, sending emails between 10-11am on Tuesdays and Thursdays could increase engagement by up to 15%",
        impact: "medium",
        effort: "low",
        category: "marketing",
      },
      {
        id: "rec-2",
        title: "Focus on customer retention",
        description:
          "Churn prediction model indicates increasing risk among premium tier customers. Consider implementing targeted retention campaign.",
        impact: "high",
        effort: "medium",
        category: "customer",
      },
      {
        id: "rec-3",
        title: "Reallocate marketing budget",
        description:
          "Channel analysis shows social media ads delivering 2.3x better ROI than search ads for acquisition. Consider shifting 20% of search budget to social.",
        impact: "high",
        effort: "low",
        category: "marketing",
      },
    ];
  },
};
