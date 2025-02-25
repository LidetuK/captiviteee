import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  Star,
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const metrics: Record<string, MetricCard[]> = {
  "text-back": [
    {
      title: "Response Time",
      value: "1.2 min",
      change: "-85%",
      icon: <Clock className="w-4 h-4" />,
      trend: "down",
    },
    {
      title: "Conversion Rate",
      value: "28%",
      change: "+12%",
      icon: <TrendingUp className="w-4 h-4" />,
      trend: "up",
    },
    {
      title: "Cost Savings",
      value: "$2,450",
      change: "+35%",
      icon: <DollarSign className="w-4 h-4" />,
      trend: "up",
    },
  ],
  reputation: [
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.6",
      icon: <Star className="w-4 h-4" />,
      trend: "up",
    },
    {
      title: "Review Response Rate",
      value: "98%",
      change: "+23%",
      icon: <MessageSquare className="w-4 h-4" />,
      trend: "up",
    },
    {
      title: "New Reviews",
      value: "127",
      change: "+45%",
      icon: <Users className="w-4 h-4" />,
      trend: "up",
    },
  ],
};

const AnalyticsDashboard = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Real-Time Analytics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your business performance and ROI across all services
          </p>
        </div>

        <Tabs defaultValue="text-back" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="text-back">Text-Back Metrics</TabsTrigger>
            <TabsTrigger value="reputation">Reputation Metrics</TabsTrigger>
          </TabsList>

          {Object.entries(metrics).map(([key, metricCards]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metricCards.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {metric.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {metric.change}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {metric.title}
                      </h3>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
