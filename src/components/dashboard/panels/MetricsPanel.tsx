import React from "react";
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, Clock, TrendingUp } from "lucide-react";

const MetricsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <Users />,
            label: "Active Users",
            value: "1,234",
            trend: "+12%",
          },
          {
            icon: <MessageSquare />,
            label: "Total Conversations",
            value: "5,678",
            trend: "+8%",
          },
          {
            icon: <Clock />,
            label: "Avg Response Time",
            value: "1.2m",
            trend: "-15%",
          },
          {
            icon: <TrendingUp />,
            label: "Conversion Rate",
            value: "24%",
            trend: "+5%",
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
                    className={`text-sm ${metric.trend.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                  >
                    {metric.trend}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <div className="h-[400px] bg-muted rounded-lg" />
      </Card>
    </div>
  );
};

export default MetricsPanel;
