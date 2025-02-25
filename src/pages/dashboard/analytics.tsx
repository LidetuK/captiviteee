import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  BarChart2,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue Growth</h3>
            <TrendingUp className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">+24%</p>
          <p className="text-sm text-muted-foreground">vs. last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Active Users</h3>
            <Users className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-muted-foreground">+7% new users</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Total Sales</h3>
            <DollarSign className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">$45,678</p>
          <p className="text-sm text-muted-foreground">+12% increase</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Revenue Trends</h3>
            <LineChart className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Revenue Chart Placeholder
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Customer Distribution</h3>
            <PieChart className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Distribution Chart Placeholder
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Monthly Performance</h3>
            <BarChart2 className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Performance Chart Placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
