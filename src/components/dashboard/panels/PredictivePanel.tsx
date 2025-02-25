import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users, Package } from "lucide-react";

const PredictivePanel = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <Users />,
            label: "Churn Risk",
            value: "12%",
            trend: "-3%",
            action: "View At-Risk Customers",
          },
          {
            icon: <TrendingUp />,
            label: "Forecasted Growth",
            value: "+24%",
            trend: "+5%",
            action: "View Forecast Details",
          },
          {
            icon: <Brain />,
            label: "Peak Hours",
            value: "2-5 PM",
            trend: "Optimal",
            action: "View Staffing Plan",
          },
          {
            icon: <Package />,
            label: "Inventory Prediction",
            value: "85%",
            trend: "+10%",
            action: "View Recommendations",
          },
        ].map((metric, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  <span
                    className={`text-sm ${metric.trend.startsWith("+") ? "text-green-500" : metric.trend === "Optimal" ? "text-blue-500" : "text-red-500"}`}
                  >
                    {metric.trend}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              {metric.action}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        <div className="space-y-4">
          {[
            "Customer churn risk decreased by 3% this month",
            "Peak business hours shifted to afternoon (2-5 PM)",
            "Projected 24% growth in Q3 based on current trends",
            "Inventory optimization could save 15% in carrying costs",
          ].map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-muted rounded-lg"
            >
              <Brain className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PredictivePanel;
