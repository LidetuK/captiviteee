import { FC, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReputationMetrics, Review } from "@/lib/reputation/reputationManager";
import {
  BarChart3,
  TrendingUp,
  Map,
  Share2,
  Download,
  Info,
} from "lucide-react";

interface ReputationVisualAnalysisProps {
  metrics?: ReputationMetrics | null;
  reviews?: Review[];
  isLoading?: boolean;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const ReputationVisualAnalysis: FC<ReputationVisualAnalysisProps> = ({
  metrics,
  reviews = [],
  isLoading = false,
  period = "monthly",
  onPeriodChange,
}) => {
  const [activeTab, setActiveTab] = useState("trends");
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (metrics) {
      // Process data for charts
      const processedData = {
        ratingTrend: metrics.metrics.ratingTrend,
        volumeTrend: metrics.metrics.volumeTrend,
        sentimentDistribution: {
          positive: reviews.filter(
            (r) => r.sentiment && r.sentiment.score > 0.2,
          ).length,
          neutral: reviews.filter(
            (r) =>
              r.sentiment &&
              r.sentiment.score >= -0.2 &&
              r.sentiment.score <= 0.2,
          ).length,
          negative: reviews.filter(
            (r) => r.sentiment && r.sentiment.score < -0.2,
          ).length,
        },
        responseTimeDistribution: {
          "<24h": reviews.filter(
            (r) =>
              r.responsePublishedAt &&
              (new Date(r.responsePublishedAt).getTime() -
                new Date(r.publishedAt).getTime()) /
                (1000 * 60 * 60) <
                24,
          ).length,
          "24-48h": reviews.filter(
            (r) =>
              r.responsePublishedAt &&
              (new Date(r.responsePublishedAt).getTime() -
                new Date(r.publishedAt).getTime()) /
                (1000 * 60 * 60) >=
                24 &&
              (new Date(r.responsePublishedAt).getTime() -
                new Date(r.publishedAt).getTime()) /
                (1000 * 60 * 60) <
                48,
          ).length,
          ">48h": reviews.filter(
            (r) =>
              r.responsePublishedAt &&
              (new Date(r.responsePublishedAt).getTime() -
                new Date(r.publishedAt).getTime()) /
                (1000 * 60 * 60) >=
                48,
          ).length,
        },
        keywordCloud: metrics.metrics.topKeywords,
        geographicDistribution: {
          // In a real app, this would come from actual data
          "United States": Math.floor(reviews.length * 0.45),
          "United Kingdom": Math.floor(reviews.length * 0.15),
          Canada: Math.floor(reviews.length * 0.12),
          Australia: Math.floor(reviews.length * 0.08),
          Germany: Math.floor(reviews.length * 0.05),
          France: Math.floor(reviews.length * 0.05),
          Other: reviews.length - Math.floor(reviews.length * 0.9),
        },
      };

      setChartData(processedData);
    }
  }, [metrics, reviews]);

  const handlePeriodChange = (value: string) => {
    if (onPeriodChange) {
      onPeriodChange(value);
    }
  };

  const renderTrendsTab = () => {
    if (!chartData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Trend</CardTitle>
            <CardDescription>Average rating over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {/* In a real app, this would be a chart component */}
            <div className="flex flex-col h-full justify-center items-center">
              <TrendingUp className="h-16 w-16 text-primary opacity-20" />
              <p className="text-sm text-muted-foreground mt-4">
                Rating trend visualization would appear here using a chart
                library like Chart.js, Recharts, or Nivo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Volume</CardTitle>
            <CardDescription>Number of reviews over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {/* In a real app, this would be a chart component */}
            <div className="flex flex-col h-full justify-center items-center">
              <BarChart3 className="h-16 w-16 text-primary opacity-20" />
              <p className="text-sm text-muted-foreground mt-4">
                Review volume visualization would appear here using a chart
                library
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSentimentTab = () => {
    if (!chartData) return null;

    const total =
      chartData.sentimentDistribution.positive +
      chartData.sentimentDistribution.neutral +
      chartData.sentimentDistribution.negative;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Breakdown of review sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Positive</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {chartData.sentimentDistribution.positive}(
                    {total > 0
                      ? (
                          (chartData.sentimentDistribution.positive / total) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    total > 0
                      ? (chartData.sentimentDistribution.positive / total) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                    <span>Neutral</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {chartData.sentimentDistribution.neutral}(
                    {total > 0
                      ? (
                          (chartData.sentimentDistribution.neutral / total) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    total > 0
                      ? (chartData.sentimentDistribution.neutral / total) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Negative</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {chartData.sentimentDistribution.negative}(
                    {total > 0
                      ? (
                          (chartData.sentimentDistribution.negative / total) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    total > 0
                      ? (chartData.sentimentDistribution.negative / total) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
            <CardDescription>Most common topics in reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.keywordCloud && chartData.keywordCloud.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center p-4">
                {chartData.keywordCloud.map((keyword: any, index: number) => (
                  <div
                    key={index}
                    className={`px-3 py-1.5 rounded-full ${
                      keyword.sentiment > 0.2
                        ? "bg-green-100 text-green-800"
                        : keyword.sentiment < -0.2
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                    style={{
                      fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + keyword.count / 10))}rem`,
                    }}
                  >
                    {keyword.keyword}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-40 justify-center items-center">
                <p className="text-sm text-muted-foreground">
                  No keyword data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGeographicTab = () => {
    if (!chartData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Where your reviews are coming from
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <div className="flex flex-col h-full">
              <div className="flex justify-center items-center mb-6">
                <Map className="h-16 w-16 text-primary opacity-20" />
                <p className="text-sm text-muted-foreground ml-4">
                  In a production environment, this would display an interactive
                  map visualization
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(chartData.geographicDistribution).map(
                  ([country, count]: [string, any]) => (
                    <div key={country} className="border rounded-md p-3">
                      <div className="text-sm font-medium">{country}</div>
                      <div className="flex items-center mt-2">
                        <div className="flex-1 mr-2">
                          <Progress
                            value={(count / reviews.length) * 100}
                            className="h-2"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {count} ({((count / reviews.length) * 100).toFixed(0)}
                          %)
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResponseTab = () => {
    if (!chartData) return null;

    const responseTotal =
      chartData.responseTimeDistribution["<24h"] +
      chartData.responseTimeDistribution["24-48h"] +
      chartData.responseTimeDistribution[">48h"];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
            <CardDescription>
              How quickly you respond to reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Under 24 hours</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {chartData.responseTimeDistribution["<24h"]}(
                    {responseTotal > 0
                      ? (
                          (chartData.responseTimeDistribution["<24h"] /
                            responseTotal) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    responseTotal > 0
                      ? (chartData.responseTimeDistribution["<24h"] /
                          responseTotal) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    <span>24-48 hours</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {chartData.responseTimeDistribution["24-48h"]}(
                    {responseTotal > 0
                      ? (
                          (chartData.responseTimeDistribution["24-48h"] /
                            responseTotal) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    responseTotal > 0
                      ? (chartData.responseTimeDistribution["24-48h"] /
                          responseTotal) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Over 48 hours</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {chartData.responseTimeDistribution[">48h"]}(
                    {responseTotal > 0
                      ? (
                          (chartData.responseTimeDistribution[">48h"] /
                            responseTotal) *
                          100
                        ).toFixed(0)
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    responseTotal > 0
                      ? (chartData.responseTimeDistribution[">48h"] /
                          responseTotal) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Impact</CardTitle>
            <CardDescription>
              How responses affect your reputation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border rounded-md">
                <div className="text-lg font-medium">+0.5</div>
                <div className="text-sm text-muted-foreground">
                  Average rating improvement after response
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <div className="text-lg font-medium">72%</div>
                <div className="text-sm text-muted-foreground">
                  Negative reviews with sentiment improvement
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <div className="text-lg font-medium">24%</div>
                <div className="text-sm text-muted-foreground">
                  Reviews updated after your response
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visual Analysis</h2>
          <p className="text-muted-foreground">
            Visualize your reputation data to identify trends and opportunities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Last 7 days</SelectItem>
              <SelectItem value="monthly">Last 30 days</SelectItem>
              <SelectItem value="quarterly">Last 90 days</SelectItem>
              <SelectItem value="yearly">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !metrics ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Info className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            There isn't enough reputation data to generate visualizations. Add
            more review sources or sync existing ones to see analytics.
          </p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="trends">Rating Trends</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="geographic">Geographic Data</TabsTrigger>
            <TabsTrigger value="response">Response Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            {renderTrendsTab()}
          </TabsContent>

          <TabsContent value="sentiment" className="mt-6">
            {renderSentimentTab()}
          </TabsContent>

          <TabsContent value="geographic" className="mt-6">
            {renderGeographicTab()}
          </TabsContent>

          <TabsContent value="response" className="mt-6">
            {renderResponseTab()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ReputationVisualAnalysis;
