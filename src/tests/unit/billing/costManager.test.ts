import { costManager } from "@/lib/billing/costManager";

describe("Cost Manager", () => {
  beforeEach(() => {
    costManager.costs.clear();
    costManager.budgets.clear();
  });

  test("tracks resource usage", async () => {
    const cost = await costManager.trackResourceUsage("compute", 10, 0.5);

    expect(cost).toBeDefined();
    expect(cost.totalCost).toBe(5); // 10 * 0.5
  });

  test("sets budget and checks alerts", async () => {
    const budget = costManager.setBudget({
      resourceType: "compute",
      limit: 1000,
      period: "monthly",
      alerts: [80, 90, 100],
    });

    await costManager.trackResourceUsage("compute", 100, 10); // 1000 total

    const alerts = await costManager.checkBudgetAlerts("compute");
    expect(alerts).toHaveLength(3); // All thresholds exceeded
  });

  test("generates cost breakdown", async () => {
    await costManager.trackResourceUsage("compute", 10, 5);
    await costManager.trackResourceUsage("storage", 20, 2);

    const breakdown = costManager.getCostBreakdown();
    expect(breakdown.compute).toBe(50);
    expect(breakdown.storage).toBe(40);
  });
});
