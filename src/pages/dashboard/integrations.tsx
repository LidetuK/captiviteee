import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, MessageSquare, Calendar, CreditCard } from "lucide-react";

const IntegrationsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Integrations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Salesforce",
            description: "CRM and sales automation",
            icon: <Database className="h-6 w-6" />,
            status: "Available",
          },
          {
            title: "Slack",
            description: "Team communication",
            icon: <MessageSquare className="h-6 w-6" />,
            status: "Connected",
          },
          {
            title: "Google Calendar",
            description: "Calendar sync",
            icon: <Calendar className="h-6 w-6" />,
            status: "Available",
          },
          {
            title: "Stripe",
            description: "Payment processing",
            icon: <CreditCard className="h-6 w-6" />,
            status: "Coming Soon",
          },
        ].map((integration, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {integration.icon}
              </div>
              <div>
                <h3 className="font-semibold">{integration.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </div>
            </div>
            <Button
              variant={
                integration.status === "Coming Soon" ? "secondary" : "default"
              }
              className="w-full"
              disabled={integration.status === "Coming Soon"}
            >
              {integration.status}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
