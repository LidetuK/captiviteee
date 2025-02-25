interface ResourceCost {
  id: string;
  resourceType: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface Budget {
  id: string;
  resourceType: string;
  limit: number;
  used: number;
  period: "monthly" | "quarterly" | "yearly";
  alerts: number[];
}

export const costManager = {
  costs: new Map<string, ResourceCost[]>(),
  budgets: new Map<string, Budget>(),

  trackResourceUsage: async (
    resourceType: string,
    quantity: number,
    unitCost: number,
  ) => {
    const cost: ResourceCost = {
      id: crypto.randomUUID(),
      resourceType,
      quantity,
      unitCost,
      totalCost: quantity * unitCost,
      timestamp: new Date(),
    };

    if (!costManager.costs.has(resourceType)) {
      costManager.costs.set(resourceType, []);
    }
    costManager.costs.get(resourceType)?.push(cost);

    // Check budget alerts
    await costManager.checkBudgetAlerts(resourceType);

    return cost;
  },

  setBudget: (budget: Omit<Budget, "id" | "used">) => {
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      ...budget,
      used: 0,
    };
    costManager.budgets.set(budget.resourceType, newBudget);
    return newBudget;
  },

  checkBudgetAlerts: async (resourceType: string) => {
    const budget = costManager.budgets.get(resourceType);
    if (!budget) return null;

    const costs = costManager.costs.get(resourceType) || [];
    const totalCost = costs.reduce((sum, cost) => sum + cost.totalCost, 0);
    budget.used = totalCost;

    const usagePercentage = (totalCost / budget.limit) * 100;
    const alerts = [];

    for (const threshold of budget.alerts) {
      if (usagePercentage >= threshold) {
        alerts.push({
          threshold,
          currentUsage: usagePercentage,
          resourceType,
        });
      }
    }

    return alerts;
  },

  getCostBreakdown: (timeRange?: { start: Date; end: Date }) => {
    const breakdown: Record<string, number> = {};

    costManager.costs.forEach((costs, resourceType) => {
      const filteredCosts = timeRange
        ? costs.filter(
            (cost) =>
              cost.timestamp >= timeRange.start &&
              cost.timestamp <= timeRange.end,
          )
        : costs;

      breakdown[resourceType] = filteredCosts.reduce(
        (sum, cost) => sum + cost.totalCost,
        0,
      );
    });

    return breakdown;
  },

  forecastCosts: async (months: number) => {
    const forecasts: Record<string, number[]> = {};

    costManager.costs.forEach((costs, resourceType) => {
      // Calculate trend based on historical data
      const monthlyTotals = calculateMonthlyTotals(costs);
      const trend = calculateTrend(monthlyTotals);

      // Generate forecast
      forecasts[resourceType] = Array(months)
        .fill(0)
        .map((_, i) => {
          const lastMonth = monthlyTotals[monthlyTotals.length - 1] || 0;
          return lastMonth * Math.pow(1 + trend, i + 1);
        });
    });

    return forecasts;
  },

  optimizeCosts: () => {
    const recommendations = [];

    costManager.costs.forEach((costs, resourceType) => {
      const recentCosts = costs.slice(-30); // Last 30 days
      const averageUsage = calculateAverageUsage(recentCosts);
      const peakUsage = calculatePeakUsage(recentCosts);

      if (peakUsage / averageUsage > 2) {
        recommendations.push(`Consider rightsizing ${resourceType} resources`);
      }

      const trend = calculateTrend(recentCosts.map((c) => c.totalCost));
      if (trend > 0.1) {
        recommendations.push(`Investigate increasing ${resourceType} costs`);
      }
    });

    return recommendations;
  },

  calculateROI: (investment: number, timeRange: { start: Date; end: Date }) => {
    const totalCosts = Object.values(
      costManager.getCostBreakdown(timeRange),
    ).reduce((sum, cost) => sum + cost, 0);

    const revenue = 0; // This should be fetched from revenue tracking system
    const profit = revenue - totalCosts;
    const roi = ((profit - investment) / investment) * 100;

    return {
      investment,
      costs: totalCosts,
      revenue,
      profit,
      roi,
      timeRange,
    };
  },
};

// Helper functions
const calculateMonthlyTotals = (costs: ResourceCost[]): number[] => {
  const monthlyTotals: Record<string, number> = {};

  costs.forEach((cost) => {
    const monthKey = cost.timestamp.toISOString().slice(0, 7); // YYYY-MM
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + cost.totalCost;
  });

  return Object.values(monthlyTotals);
};

const calculateTrend = (values: number[]): number => {
  if (values.length < 2) return 0;
  const last = values[values.length - 1];
  const first = values[0];
  return (last - first) / first;
};

const calculateAverageUsage = (costs: ResourceCost[]): number => {
  return costs.reduce((sum, cost) => sum + cost.quantity, 0) / costs.length;
};

const calculatePeakUsage = (costs: ResourceCost[]): number => {
  return Math.max(...costs.map((cost) => cost.quantity));
};
