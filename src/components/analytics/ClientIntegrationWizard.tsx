import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Check,
  Database,
  LineChart,
  Link,
  Loader2,
  LucideIcon,
  PlusCircle,
  RefreshCw,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  clientAnalytics,
  type ClientConfig,
} from "@/lib/analytics/clientIntegration";

interface DataSourceType {
  id: string;
  name: string;
  type: "crm" | "marketing" | "sales" | "support" | "custom";
  icon: LucideIcon;
  description: string;
}

const dataSourceTypes: DataSourceType[] = [
  {
    id: "crm",
    name: "CRM System",
    type: "crm",
    icon: Database,
    description: "Connect to your CRM system to analyze customer data",
  },
  {
    id: "marketing",
    name: "Marketing Platform",
    type: "marketing",
    icon: Sparkles,
    description:
      "Connect to your marketing platforms to analyze campaign performance",
  },
  {
    id: "sales",
    name: "Sales Platform",
    type: "sales",
    icon: LineChart,
    description: "Connect to your sales platform to analyze sales performance",
  },
  {
    id: "support",
    name: "Support System",
    type: "support",
    icon: Zap,
    description: "Connect to your support system to analyze customer issues",
  },
];

const ClientIntegrationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clientConfig, setClientConfig] = useState<Partial<ClientConfig>>({
    enabledFeatures: {
      insights: true,
      predictions: true,
      anomalyDetection: true,
      recommendations: true,
    },
    dataSourceIds: [],
  });
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDataSourceToggle = (sourceId: string) => {
    setSelectedDataSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId],
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Update the client config with the selected data sources
      const config: ClientConfig = {
        clientId: clientConfig.clientId || "",
        organizationId: clientConfig.organizationId || "",
        dataSourceIds: selectedDataSources,
        enabledFeatures:
          clientConfig.enabledFeatures as ClientConfig["enabledFeatures"],
        refreshInterval: clientConfig.refreshInterval || 60,
      };

      // Initialize the client
      const result = await clientAnalytics.initializeClient(config);
      if (result) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error completing integration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-background">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Smart Analytics Integration</h2>
        <p className="text-muted-foreground mt-1">
          Set up Smart Analytics for your client in just a few steps
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span
              className={
                currentStep >= 1 ? "font-medium" : "text-muted-foreground"
              }
            >
              Client Details
            </span>
          </div>
          <Separator className="w-12" />
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span
              className={
                currentStep >= 2 ? "font-medium" : "text-muted-foreground"
              }
            >
              Data Sources
            </span>
          </div>
          <Separator className="w-12" />
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > 3 ? <Check className="h-4 w-4" /> : "3"}
            </div>
            <span
              className={
                currentStep >= 3 ? "font-medium" : "text-muted-foreground"
              }
            >
              Features
            </span>
          </div>
          <Separator className="w-12" />
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 4
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              "4"
            </div>
            <span
              className={
                currentStep >= 4 ? "font-medium" : "text-muted-foreground"
              }
            >
              Review & Activate
            </span>
          </div>
        </div>
        <Progress value={(currentStep / 4) * 100} className="h-2" />
      </div>

      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                placeholder="Enter client ID"
                value={clientConfig.clientId || ""}
                onChange={(e) =>
                  setClientConfig({ ...clientConfig, clientId: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationId">Organization ID</Label>
              <Input
                id="organizationId"
                placeholder="Enter organization ID"
                value={clientConfig.organizationId || ""}
                onChange={(e) =>
                  setClientConfig({
                    ...clientConfig,
                    organizationId: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refreshInterval">
              Data Refresh Interval (minutes)
            </Label>
            <Input
              id="refreshInterval"
              type="number"
              placeholder="60"
              value={clientConfig.refreshInterval || "60"}
              onChange={(e) =>
                setClientConfig({
                  ...clientConfig,
                  refreshInterval: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!clientConfig.clientId || !clientConfig.organizationId}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select the data sources you want to connect to Smart Analytics
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSourceTypes.map((source) => {
              const Icon = source.icon;
              const isSelected = selectedDataSources.includes(source.id);

              return (
                <div
                  key={source.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  onClick={() => handleDataSourceToggle(source.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{source.name}</h3>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleDataSourceToggle(source.id)
                          }
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {source.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 border border-dashed rounded-lg cursor-pointer hover:border-primary/50 flex items-center justify-center">
              <div className="text-center">
                <PlusCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium">Add Custom Data Source</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect to a custom data source
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedDataSources.length === 0}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select which Smart Analytics features you want to enable for this
            client
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="insights"
                checked={clientConfig.enabledFeatures?.insights}
                onCheckedChange={(checked) =>
                  setClientConfig({
                    ...clientConfig,
                    enabledFeatures: {
                      ...(clientConfig.enabledFeatures as ClientConfig["enabledFeatures"]),
                      insights: !!checked,
                    },
                  })
                }
              />
              <div>
                <Label
                  htmlFor="insights"
                  className="text-base font-medium cursor-pointer"
                >
                  AI Insights
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically generate insights based on data patterns and
                  anomalies
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="predictions"
                checked={clientConfig.enabledFeatures?.predictions}
                onCheckedChange={(checked) =>
                  setClientConfig({
                    ...clientConfig,
                    enabledFeatures: {
                      ...(clientConfig.enabledFeatures as ClientConfig["enabledFeatures"]),
                      predictions: !!checked,
                    },
                  })
                }
              />
              <div>
                <Label
                  htmlFor="predictions"
                  className="text-base font-medium cursor-pointer"
                >
                  Predictive Analytics
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Forecast future trends and outcomes based on historical data
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="anomalyDetection"
                checked={clientConfig.enabledFeatures?.anomalyDetection}
                onCheckedChange={(checked) =>
                  setClientConfig({
                    ...clientConfig,
                    enabledFeatures: {
                      ...(clientConfig.enabledFeatures as ClientConfig["enabledFeatures"]),
                      anomalyDetection: !!checked,
                    },
                  })
                }
              />
              <div>
                <Label
                  htmlFor="anomalyDetection"
                  className="text-base font-medium cursor-pointer"
                >
                  Anomaly Detection
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically detect unusual patterns and outliers in data
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="recommendations"
                checked={clientConfig.enabledFeatures?.recommendations}
                onCheckedChange={(checked) =>
                  setClientConfig({
                    ...clientConfig,
                    enabledFeatures: {
                      ...(clientConfig.enabledFeatures as ClientConfig["enabledFeatures"]),
                      recommendations: !!checked,
                    },
                  })
                }
              />
              <div>
                <Label
                  htmlFor="recommendations"
                  className="text-base font-medium cursor-pointer"
                >
                  Smart Recommendations
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get AI-powered recommendations for improving business outcomes
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                !Object.values(clientConfig.enabledFeatures || {}).some(Boolean)
              }
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integration Complete!</h3>
              <p className="text-muted-foreground mb-6">
                Smart Analytics has been successfully set up for this client
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" /> Configure Settings
                </Button>
                <Button>
                  <LineChart className="mr-2 h-4 w-4" /> View Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Integration Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client ID:</span>
                    <span className="font-medium">{clientConfig.clientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Organization ID:
                    </span>
                    <span className="font-medium">
                      {clientConfig.organizationId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Sources:</span>
                    <span className="font-medium">
                      {selectedDataSources.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Refresh Interval:
                    </span>
                    <span className="font-medium">
                      {clientConfig.refreshInterval} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Enabled Features:
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {clientConfig.enabledFeatures?.insights && (
                        <Badge variant="outline">Insights</Badge>
                      )}
                      {clientConfig.enabledFeatures?.predictions && (
                        <Badge variant="outline">Predictions</Badge>
                      )}
                      {clientConfig.enabledFeatures?.anomalyDetection && (
                        <Badge variant="outline">Anomaly Detection</Badge>
                      )}
                      {clientConfig.enabledFeatures?.recommendations && (
                        <Badge variant="outline">Recommendations</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTitle>Before you activate</AlertTitle>
                <AlertDescription>
                  Make sure you have the necessary permissions to access the
                  selected data sources. The initial data sync may take some
                  time depending on the amount of data.
                </AlertDescription>
              </Alert>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Activating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" /> Activate Integration
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default ClientIntegrationWizard;
