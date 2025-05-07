import { metricTracker } from "./metrics";

interface Insight {
  type: "positive" | "negative" | "neutral";
  metric: string;
  message: string;
}

interface ReportSummary {
  avgCustomerSatisfaction: number;
  avgResponseTime: number;
  avgResolutionRate: number;
}

interface TrendPoint {
  value: number;
  timestamp: string;
}

interface Report {
  summary: ReportSummary;
  trends: {
    conversionRate: TrendPoint[];
  };
}

export const analyticsDashboard = {
  getOverview: async (organizationId: string) => {
    // Get metrics from metricTracker
    const customerSatisfaction = metricTracker.calculateMetric('customer_satisfaction');
    const responseTime = metricTracker.calculateMetric('response_time');
    const resolutionRate = metricTracker.calculateMetric('resolution_rate');
    const conversionRateHistory = metricTracker.getMetricHistory('conversion_rate');

    if (!customerSatisfaction || !responseTime || !resolutionRate || !conversionRateHistory) {
      return null;
    }

    // Convert conversion rate history to trend points
    const conversionRate = conversionRateHistory.map((value, index) => ({
      value,
      timestamp: new Date(Date.now() - (conversionRateHistory.length - index - 1) * 24 * 60 * 60 * 1000).toISOString()
    }));

    const report: Report = {
      summary: {
        avgCustomerSatisfaction: customerSatisfaction,
        avgResponseTime: responseTime,
        avgResolutionRate: resolutionRate
      },
      trends: {
        conversionRate
      }
    };

    return {
      metrics: report.summary,
      trends: report.trends,
      insights: analyticsDashboard.generateInsights(report),
    };
  },

  generateInsights: (report: Report): Insight[] => {
    const insights: Insight[] = [];
    const { summary, trends } = report;

    // Customer Satisfaction Insights
    if (summary.avgCustomerSatisfaction > 4.5) {
      insights.push({
        type: "positive",
        metric: "Customer Satisfaction",
        message: "Excellent customer satisfaction scores",
      });
    }

    // Response Time Insights
    if (summary.avgResponseTime < 60) {
      insights.push({
        type: "positive",
        metric: "Response Time",
        message: `Fast average response time of ${summary.avgResponseTime}s`,
      });
    }

    // Resolution Rate Insights
    if (summary.avgResolutionRate > 90) {
      insights.push({
        type: "positive",
        metric: "Resolution Rate",
        message: `High resolution rate of ${summary.avgResolutionRate}%`,
      });
    }

    // Conversion Rate Insights
    const conversionTrend = trends.conversionRate;
    const isImproving =
      conversionTrend[conversionTrend.length - 1].value >
      conversionTrend[0].value;

    if (isImproving) {
      insights.push({
        type: "positive",
        metric: "Conversion Rate",
        message: "Improving conversion trend",
      });
    }

    return insights;
  },
};
