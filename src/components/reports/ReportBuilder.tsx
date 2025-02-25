import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface ReportConfig {
  title: string;
  type: "performance" | "engagement" | "revenue" | "custom";
  metrics: string[];
  dateRange: { start: Date; end: Date };
  format: "pdf" | "csv" | "excel";
  schedule?: {
    frequency: "daily" | "weekly" | "monthly";
    time: string;
  };
}

const ReportBuilder = () => {
  const [config, setConfig] = useState<ReportConfig>({
    title: "",
    type: "performance",
    metrics: [],
    dateRange: {
      start: new Date(),
      end: new Date(),
    },
    format: "pdf",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle report generation
    console.log("Generating report with config:", config);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <Label htmlFor="type">Report Type</Label>
            <Select
              value={config.type}
              onValueChange={(value) =>
                setConfig((prev) => ({
                  ...prev,
                  type: value as ReportConfig["type"],
                }))
              }
            >
              <option value="performance">Performance</option>
              <option value="engagement">Engagement</option>
              <option value="revenue">Revenue</option>
              <option value="custom">Custom</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="format">Format</Label>
            <Select
              value={config.format}
              onValueChange={(value) =>
                setConfig((prev) => ({
                  ...prev,
                  format: value as ReportConfig["format"],
                }))
              }
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </Select>
          </div>
        </div>

        <Button type="submit">Generate Report</Button>
      </form>
    </Card>
  );
};

export default ReportBuilder;
