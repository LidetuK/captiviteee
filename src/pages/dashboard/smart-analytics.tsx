import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, TrendingUp, LineChart, PieChart } from "lucide-react";

const SmartAnalyticsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Smart Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Predictive Insights</h3>
            <BrainCircuit className="text-primary" />
          </div>
          <p className="text-3xl font-bold">85%</p>
          <p className="text-sm text-muted-foreground">Accuracy Rate</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Growth Forecast</h3>
            <TrendingUp className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">+24%</p>
          <p className="text-sm text-muted-foreground">Next Quarter</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">AI Recommendations</h3>
            <LineChart className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-muted-foreground">Active Insights</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Performance Trends</h3>
            <Button variant="outline">View Details</Button>
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Performance Chart Placeholder
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">AI Insights Distribution</h3>
            <Button variant="outline">Export</Button>
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Distribution Chart Placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SmartAnalyticsPage;
