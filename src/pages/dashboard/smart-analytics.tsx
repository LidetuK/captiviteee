import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  LineChart,
  BarChart,
  PieChart,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Download,
  Filter,
  Calendar,
  Zap,
  Target,
  Activity,
  RefreshCw,
  ChevronRight,
  Clock,
  Info,
  Sparkles,
  BarChart3,
  Layers,
} from "lucide-react";
import {
  smartAnalytics,
  timeframes,
  type SmartInsight,
  type PredictiveModel,
} from "@/lib/analytics/smartAnalytics";

const SmartAnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState("30days");
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [models, setModels] = useState<PredictiveModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("insights");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, you would pass the actual organization ID
        const orgId = "org-123";
        const [insightsData, modelsData] = await Promise.all([
          smartAnalytics.getInsights(orgId, timeframe),
          smartAnalytics.getPredictiveModels(orgId),
        ]);

        setInsights(insightsData);
        setModels(modelsData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Lightbulb className="h-5 w-5 text-green-500" />;
      case "risk":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "trend":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "anomaly":
        return <Activity className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            High Impact
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Medium Impact
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Low Impact
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Analytics</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights and predictions for your business
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" onClick={() => setLoading(true)}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Predictive Accuracy
              </p>
              <h3 className="text-3xl font-bold mt-2">85%</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+3% from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Insights
              </p>
              <h3 className="text-3xl font-bold mt-2">{insights.length}</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+2 from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Forecasted Growth
              </p>
              <h3 className="text-3xl font-bold mt-2">+24%</h3>
              <div className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5% from previous forecast</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Anomalies Detected
              </p>
              <h3 className="text-3xl font-bold mt-2">3</h3>
              <div className="flex items-center mt-1 text-sm text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-2 from previous period</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Latest Insights</h3>
                    <Button variant="outline" size="sm" className="gap-1">
                      View All <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {insights.map((insight) => (
                        <Card
                          key={insight.id}
                          className="p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                  {insight.title}
                                </h4>
                                {getImpactBadge(insight.impact)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {insight.description}
                              </p>

                              {insight.metric && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {insight.metric}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {insight.value}
                                  </span>
                                  {insight.change && (
                                    <div className="flex items-center text-xs">
                                      {getChangeIndicator(insight.change)}
                                      <span
                                        className={
                                          insight.change > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {insight.change > 0 ? "+" : ""}
                                        {insight.change}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {insight.recommendation && (
                                <div className="mt-3 p-2 bg-muted rounded-md">
                                  <div className="flex items-center gap-1 text-xs font-medium mb-1">
                                    <Lightbulb className="h-3 w-3" />
                                    <span>RECOMMENDATION</span>
                                  </div>
                                  <p className="text-sm">
                                    {insight.recommendation}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(
                                      insight.timestamp,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                >
                                  Take Action
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Insights by Category
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Conversion</span>
                      <span className="text-sm text-muted-foreground">
                        2 insights
                      </span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Engagement</span>
                      <span className="text-sm text-muted-foreground">
                        1 insight
                      </span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Revenue</span>
                      <span className="text-sm text-muted-foreground">
                        1 insight
                      </span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Support</span>
                      <span className="text-sm text-muted-foreground">
                        1 insight
                      </span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Product</span>
                      <span className="text-sm text-muted-foreground">
                        1 insight
                      </span>
                    </div>
                    <Progress value={17} className="h-2" />
                  </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-xl font-semibold mb-4">Insights by Type</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Opportunities</span>
                    </div>
                    <Badge>2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Risks</span>
                    </div>
                    <Badge>1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Trends</span>
                    </div>
                    <Badge>2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Anomalies</span>
                    </div>
                    <Badge>1</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Revenue Forecast</h3>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" /> Change Period
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mb-2" />
                    <span>Revenue Forecast Chart</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">
                      Projected Q3
                    </p>
                    <p className="text-lg font-bold">$1.2M</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+15%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">
                      Projected Q4
                    </p>
                    <p className="text-lg font-bold">$1.5M</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+24%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Year-End</p>
                    <p className="text-lg font-bold">$5.8M</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+18%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Customer Growth</h3>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" /> Segment
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  {/* Placeholder for chart */}
                  <div className="flex flex-col items-center text-muted-foreground">
                    <BarChart className="h-12 w-12 mb-2" />
                    <span>Customer Growth Chart</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">
                      New Customers
                    </p>
                    <p className="text-lg font-bold">+285</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Churn Rate</p>
                    <p className="text-lg font-bold">4.2%</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>-0.8%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Net Growth</p>
                    <p className="text-lg font-bold">+215</p>
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+18%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Anomaly Detection</h3>
                <Button variant="outline" size="sm">
                  <Activity className="mr-2 h-4 w-4" /> View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Expected
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Actual
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Deviation
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Significance
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">Website Traffic</td>
                      <td className="py-3 px-4">Jun 15, 2023</td>
                      <td className="py-3 px-4">1,250</td>
                      <td className="py-3 px-4 font-medium">1,850</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" /> +48%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          High
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          Investigate
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">Conversion Rate</td>
                      <td className="py-3 px-4">Jun 12, 2023</td>
                      <td className="py-3 px-4">3.2%</td>
                      <td className="py-3 px-4 font-medium">2.1%</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center text-red-600">
                          <TrendingDown className="h-4 w-4 mr-1" /> -34%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Medium
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          Investigate
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="py-3 px-4">Average Order Value</td>
                      <td className="py-3 px-4">Jun 9, 2023</td>
                      <td className="py-3 px-4">$85</td>
                      <td className="py-3 px-4 font-medium">$110</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="h-4 w-4 mr-1" /> +29%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Medium
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          Investigate
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {model.description}
                      </p>
                    </div>
                    <Badge
                      className={`${
                        model.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : model.status === "training"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {model.status === "active"
                        ? "Active"
                        : model.status === "training"
                          ? "Training"
                          : "Paused"}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm">
                        {(model.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={model.accuracy * 100} className="h-2" />
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Metrics Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.metrics.map((metric) => (
                        <Badge key={metric} variant="outline">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="text-xs text-muted-foreground">
                      Last updated:{" "}
                      {new Date(model.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Layers className="h-4 w-4 mr-2" /> View Details
                      </Button>
                      {model.status === "active" && (
                        <Button variant="default" size="sm">
                          <Zap className="h-4 w-4 mr-2" /> Run Prediction
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Model Performance History
                </h3>
                <Select defaultValue="churn">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="churn">
                      Customer Churn Predictor
                    </SelectItem>
                    <SelectItem value="revenue">Revenue Forecaster</SelectItem>
                    <SelectItem value="lead">Lead Scoring Model</SelectItem>
                    <SelectItem value="segment">
                      Customer Segmentation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-muted-foreground">
                  <LineChart className="h-12 w-12 mb-2" />
                  <span>Model Performance History Chart</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    Optimize email campaign timing
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on open rate analysis, sending emails between 10-11am
                    on Tuesdays and Thursdays could increase engagement by up to
                    15%
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Medium Impact
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Low Effort
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-2" /> Implement
                    </Button>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Focus on customer retention</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Churn prediction model indicates increasing risk among
                    premium tier customers. Consider implementing targeted
                    retention campaign.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      High Impact
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Medium Effort
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-2" /> Implement
                    </Button>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Reallocate marketing budget</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Channel analysis shows social media ads delivering 2.3x
                    better ROI than search ads for acquisition. Consider
                    shifting 20% of search budget to social.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      High Impact
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      Low Effort
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-2" /> Implement
                    </Button>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Recommendation Impact Analysis
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                {/* Placeholder for chart */}
                <div className="flex flex-col items-center text-muted-foreground">
                  <PieChart className="h-12 w-12 mb-2" />
                  <span>Recommendation Impact Chart</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-1">
                    Potential Revenue Impact
                  </h4>
                  <p className="text-2xl font-bold">+$125K</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated annual increase
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-1">
                    Customer Retention
                  </h4>
                  <p className="text-2xl font-bold">+15%</p>
                  <p className="text-xs text-muted-foreground">
                    Projected improvement
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-1">
                    Implementation Time
                  </h4>
                  <p className="text-2xl font-bold">2-4 weeks</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated timeline
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartAnalyticsPage;
