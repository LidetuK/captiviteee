import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Settings, Mail, Calendar } from "lucide-react";

const NotificationsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Notification Preferences
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "Email Notifications",
                description: "Receive updates via email",
                icon: <Mail className="h-5 w-5" />,
              },
              {
                title: "Push Notifications",
                description: "Receive instant push notifications",
                icon: <Bell className="h-5 w-5" />,
              },
              {
                title: "Calendar Reminders",
                description: "Get reminders for upcoming appointments",
                icon: <Calendar className="h-5 w-5" />,
              },
              {
                title: "System Updates",
                description: "Get notified about system changes",
                icon: <Settings className="h-5 w-5" />,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Switch />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            {[
              "New appointment scheduled",
              "Customer feedback received",
              "System update completed",
              "Payment processed",
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <span>{notification}</span>
                <Button variant="ghost" size="sm">
                  Mark as Read
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
