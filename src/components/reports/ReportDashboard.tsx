import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart, Download, Clock } from "lucide-react";
import ReportBuilder from "./ReportBuilder";

const ReportDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="flex gap-4">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" /> Scheduled Reports
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Performance Overview",
                icon: <BarChart3 className="w-6 h-6" />,
                description: "Key performance metrics and trends",
              },
              {
                title: "User Engagement",
                icon: <LineChart className="w-6 h-6" />,
                description: "User activity and interaction metrics",
              },
              {
                title: "Revenue Analysis",
                icon: <PieChart className="w-6 h-6" />,
                description: "Revenue breakdown and trends",
              },
            ].map((template, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            {[
              {
                title: "Weekly Performance Report",
                frequency: "Weekly",
                nextRun: "2024-03-18 09:00 AM",
                format: "PDF",
              },
              {
                title: "Monthly Revenue Analysis",
                frequency: "Monthly",
                nextRun: "2024-04-01 08:00 AM",
                format: "Excel",
              },
            ].map((report, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.frequency} • Next run: {report.nextRun}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDashboard;
