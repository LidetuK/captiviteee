import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, BarChart3, PieChart } from "lucide-react";

const AnalyticsPanel = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <LineChart className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold">Response Time</h3>
        </div>
        <div className="h-[200px] bg-muted rounded-lg" />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold">Conversion Rate</h3>
        </div>
        <div className="h-[200px] bg-muted rounded-lg" />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <PieChart className="w-8 h-8 text-primary" />
          <h3 className="text-lg font-semibold">Customer Satisfaction</h3>
        </div>
        <div className="h-[200px] bg-muted rounded-lg" />
      </Card>
    </div>
  );
};

export default AnalyticsPanel;
