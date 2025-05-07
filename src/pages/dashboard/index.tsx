import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Refresh</Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Customers
              </p>
              <h3 className="text-3xl font-bold mt-2">1,234</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Appointments
              </p>
              <h3 className="text-3xl font-bold mt-2">56</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5% from last week</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <h3 className="text-3xl font-bold mt-2">$12,345</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Unread Messages
              </p>
              <h3 className="text-3xl font-bold mt-2">23</h3>
              <div className="flex items-center mt-1 text-sm text-amber-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>5 new since yesterday</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Activity and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Performance Overview</h3>
              <Button variant="ghost" size="sm" className="gap-1">
                View Details <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              {/* Placeholder for chart */}
              <div className="text-muted-foreground">Performance Chart</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                {
                  icon: <Users className="h-4 w-4" />,
                  text: "New customer registration",
                  time: "2 mins ago",
                },
                {
                  icon: <Calendar className="h-4 w-4" />,
                  text: "Appointment scheduled",
                  time: "1 hour ago",
                },
                {
                  icon: <MessageSquare className="h-4 w-4" />,
                  text: "Message received",
                  time: "3 hours ago",
                },
                {
                  icon: <DollarSign className="h-4 w-4" />,
                  text: "Payment processed",
                  time: "5 hours ago",
                },
                {
                  icon: <AlertCircle className="h-4 w-4" />,
                  text: "System alert resolved",
                  time: "1 day ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                      {activity.icon}
                    </div>
                    <span>{activity.text}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Tabs defaultValue="today">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="today" className="p-6 pt-0">
              <div className="space-y-4 mt-4">
                {[
                  { name: "John Doe", time: "10:00 AM", type: "Consultation" },
                  { name: "Jane Smith", time: "11:30 AM", type: "Follow-up" },
                  { name: "Robert Johnson", time: "2:15 PM", type: "Demo" },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time}
                      </p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tomorrow" className="p-6 pt-0">
              <div className="space-y-4 mt-4">
                {[
                  {
                    name: "Alice Williams",
                    time: "9:30 AM",
                    type: "Onboarding",
                  },
                  {
                    name: "David Brown",
                    time: "1:00 PM",
                    type: "Consultation",
                  },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time}
                      </p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="week" className="p-6 pt-0">
              <div className="space-y-4 mt-4">
                {[
                  {
                    name: "Michael Davis",
                    time: "Thursday, 11:00 AM",
                    type: "Demo",
                  },
                  {
                    name: "Sarah Miller",
                    time: "Friday, 2:30 PM",
                    type: "Consultation",
                  },
                  {
                    name: "James Wilson",
                    time: "Friday, 4:00 PM",
                    type: "Follow-up",
                  },
                ].map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time}
                      </p>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              >
                <Users className="h-6 w-6" />
                <span>Add Customer</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              >
                <Calendar className="h-6 w-6" />
                <span>Schedule Meeting</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Send Message</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
              >
                <DollarSign className="h-6 w-6" />
                <span>Create Invoice</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
