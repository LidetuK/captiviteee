import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Calendar,
  CreditCard,
  Webhook,
  MessageSquare,
  BarChart3,
  Store,
  Boxes,
} from "lucide-react";

interface Integration {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "connected" | "available" | "coming-soon";
  category: string;
}

const integrations: Integration[] = [
  {
    icon: <Database className="w-6 h-6" />,
    title: "Salesforce",
    description: "Sync contacts, leads, and activities",
    status: "available",
    category: "crm",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "HubSpot",
    description: "Integrate CRM and marketing automation",
    status: "available",
    category: "crm",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Stripe",
    description: "Process payments and subscriptions",
    status: "available",
    category: "payment",
  },
  {
    icon: <Store className="w-6 h-6" />,
    title: "Shopify",
    description: "E-commerce integration",
    status: "coming-soon",
    category: "payment",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Google Calendar",
    description: "Sync appointments and availability",
    status: "available",
    category: "calendar",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Outlook Calendar",
    description: "Microsoft calendar integration",
    status: "available",
    category: "calendar",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Google Analytics",
    description: "Track website performance",
    status: "coming-soon",
    category: "analytics",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Slack",
    description: "Real-time notifications and updates",
    status: "coming-soon",
    category: "communication",
  },
  {
    icon: <Webhook className="w-6 h-6" />,
    title: "Custom Webhooks",
    description: "Build custom integrations",
    status: "available",
    category: "api",
  },
  {
    icon: <Boxes className="w-6 h-6" />,
    title: "API",
    description: "Direct API access",
    status: "available",
    category: "api",
  },
];

const IntegrationHub = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Integration Hub</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect your favorite tools and streamline your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {integrations.map((integration, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        integration.status === "connected"
                          ? "bg-green-100 text-green-700"
                          : integration.status === "available"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {integration.description}
                </p>
                <Button
                  variant={
                    integration.status === "coming-soon"
                      ? "secondary"
                      : "default"
                  }
                  className="w-full"
                  disabled={integration.status === "coming-soon"}
                >
                  {integration.status === "connected"
                    ? "Manage"
                    : integration.status === "available"
                      ? "Connect"
                      : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationHub;
