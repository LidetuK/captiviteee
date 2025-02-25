import React from "react";
import { Card } from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Customers</h3>
          <p className="text-3xl font-bold">1,234</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Active Appointments</h3>
          <p className="text-3xl font-bold">56</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Unread Messages</h3>
          <p className="text-3xl font-bold">23</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$12,345</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              "New customer registration",
              "Appointment scheduled",
              "Message received",
              "Payment processed",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span>{activity}</span>
                <span className="text-sm text-muted-foreground">
                  2 mins ago
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {[
              "Meeting with John Doe",
              "Product Demo",
              "Team Sync",
              "Client Call",
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span>{appointment}</span>
                <span className="text-sm text-muted-foreground">Tomorrow</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
