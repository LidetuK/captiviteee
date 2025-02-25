import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

const ReportsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download custom reports
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" /> Date Range
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          "Customer Engagement",
          "Response Times",
          "Conversion Rates",
          "User Activity",
        ].map((report, i) => (
          <Card
            key={i}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="font-semibold mb-2">{report}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed analysis and metrics
            </p>
            <Button variant="ghost" size="sm">
              Generate Report
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPanel;
