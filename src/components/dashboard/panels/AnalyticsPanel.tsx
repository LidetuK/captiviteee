import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, BarChart3, Clock } from "lucide-react";

const AnalyticsPanel = () => {
  return (
    <div className="w-full bg-white p-6">
      {/* Top navigation - pill style */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 border-b">
        <button className="px-4 py-2 bg-primary text-white rounded-full">
          Analytics
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Conversations
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Metrics
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Reports
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Settings
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Predictive
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Backend
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          AI Assistant
        </button>
        <button className="px-4 py-2 text-muted-foreground rounded-full hover:bg-muted">
          Integrations
        </button>
      </div>

      {/* Second navigation - tab style */}
      <div className="flex space-x-8 mb-8 overflow-x-auto pb-2">
        <button className="px-4 py-2 text-primary border-b-2 border-primary font-medium">
          Analytics
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Conversations
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Metrics
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Reports
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Settings
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Predictive
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Backend
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          AI Assistant
        </button>
        <button className="px-4 py-2 text-muted-foreground hover:text-primary">
          Integrations
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 border rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <LineChart className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium">Response Time</h3>
          </div>
          <div className="h-[200px] bg-muted/10 rounded-lg" />
        </Card>

        <Card className="p-6 border rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium">Conversion Rate</h3>
          </div>
          <div className="h-[200px] bg-muted/10 rounded-lg" />
        </Card>

        <Card className="p-6 border rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium">Customer Satisfaction</h3>
          </div>
          <div className="h-[200px] bg-muted/10 rounded-lg" />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
