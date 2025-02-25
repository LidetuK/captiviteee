import { metricsTracker } from "./metrics";

export const analyticsDashboard = {
  getOverview: async (organizationId: string) => {
    const report = metricsTracker.generateReport(organizationId);
    if (!report) return null;

    return {
      metrics: report.summary,
      trends: report.trends,
      insights: analyticsDashboard.generateInsights(report),
    };
  },

  generateInsights: (report: any) => {
    const insights = [];
    const { summary, trends } = report;

    // Customer Satisfaction Insights
    if (parseFloat(summary.avgCustomerSatisfaction) > 4.5) {
      insights.push({
        type: "positive",
        metric: "Customer Satisfaction",
        message: "Excellent customer satisfaction scores",
      });
    }

    // Response Time Insights
    const avgResponseTime = parseFloat(summary.avgResponseTime);
    if (avgResponseTime < 60) {
      insights.push({
        type: "positive",
        metric: "Response Time",
        message: `Fast average response time of ${avgResponseTime}s`,
      });
    }

    // Resolution Rate Insights
    const resolutionRate = parseFloat(summary.avgResolutionRate);
    if (resolutionRate > 90) {
      insights.push({
        type: "positive",
        metric: "Resolution Rate",
        message: `High resolution rate of ${resolutionRate}%`,
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
