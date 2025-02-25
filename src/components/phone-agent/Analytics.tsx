import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Phone,
  Clock,
  ThumbsUp,
  Calendar,
  Download,
} from "lucide-react";

const Analytics = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Call Analytics</h2>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Total Calls</h3>
            <Phone className="text-primary" />
          </div>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-muted-foreground">+12% vs last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Avg. Duration</h3>
            <Clock className="text-primary" />
          </div>
          <p className="text-3xl font-bold">3:45</p>
          <p className="text-sm text-muted-foreground">-8% vs last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Success Rate</h3>
            <ThumbsUp className="text-primary" />
          </div>
          <p className="text-3xl font-bold">92%</p>
          <p className="text-sm text-muted-foreground">+5% vs last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Appointments</h3>
            <Calendar className="text-primary" />
          </div>
          <p className="text-3xl font-bold">456</p>
          <p className="text-sm text-muted-foreground">+15% vs last month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Call Volume Trends</h3>
            <BarChart className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Call Volume Chart Placeholder
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Common Topics</h3>
            <BarChart className="text-primary" />
          </div>
          <div className="h-[300px] flex items-center justify-center border rounded">
            Topics Chart Placeholder
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
