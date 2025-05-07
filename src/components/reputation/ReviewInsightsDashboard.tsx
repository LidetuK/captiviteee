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
import { Badge } from "@/components/ui/badge";
import {
  Review,
  ReviewSource,
  ReputationMetrics,
  Competitor,
  ResponseTemplate,
  reputationManager,
} from "@/lib/reputation/reputationManager";
import {
  Star,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Settings,
  Users,
  LineChart,
  Layers,
  Download,
  Filter,
  Search,
  PieChart,
  Award,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  Zap,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewInsightsDashboardProps {
  reputationManager: any; // Using any for now, should be properly typed
}

const ReviewInsightsDashboard: FC<ReviewInsightsDashboardProps> = ({
  reputationManager,
}) => {
  const [activeTab, setActiveTab] = useState("insights");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisPeriod, setAnalysisPeriod] = useState("monthly");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [sources, setSources] = useState<ReviewSource[]>([]);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get sources
        const allSources = reputationManager.getAllSources();
        setSources(allSources);

        // Get reviews with filters
        const filters: Record<string, any> = {};
        if (searchTerm) filters.search = searchTerm;
        if (selectedSource) filters.sourceId = selectedSource;

        const filteredReviews = reputationManager.getReviews(filters);
        setReviews(filteredReviews);

        // Generate metrics
        if (filteredReviews.length > 0) {
          const now = new Date();
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);

          const aggregatedMetrics = reputationManager.aggregateMetrics
            ? reputationManager.aggregateMetrics(filteredReviews)
            : {
                averageRating: 0,
                totalReviews: 0,
                sentimentScore: 0,
                responseRate: 0,
                sourcesBreakdown: {},
              };

          const demoMetrics: ReputationMetrics = {
            id: "current",
            period: "monthly",
            startDate: lastMonth,
            endDate: now,
            metrics: {
              averageRating: aggregatedMetrics.averageRating || 0,
              totalReviews: aggregatedMetrics.totalReviews || 0,
              reviewsBySource: aggregatedMetrics.sourcesBreakdown || {},
              reviewsByRating: {
                "1": filteredReviews.filter((r) => r.rating === 1).length,
                "2": filteredReviews.filter((r) => r.rating === 2).length,
                "3": filteredReviews.filter((r) => r.rating === 3).length,
                "4": filteredReviews.filter((r) => r.rating === 4).length,
                "5": filteredReviews.filter((r) => r.rating === 5).length,
              },
              responseRate: aggregatedMetrics.responseRate / 100 || 0,
              averageResponseTime: 24, // Mock value
              sentimentScore: aggregatedMetrics.sentimentScore || 0,
              topKeywords: [],
              ratingTrend: [],
              volumeTrend: [],
            },
          };

          setMetrics(demoMetrics);
        }
      } catch (error) {
        console.error("Error loading reputation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [reputationManager, searchTerm, selectedSource]);

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value === "all" ? null : value);
  };

  const renderInsightCards = () => {
    if (!metrics) return null;

    // Calculate positive and negative reviews
    const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
    const negativeReviews = reviews.filter((r) => r.rating <= 2).length;
    const positivePercentage = metrics.metrics.totalReviews
      ? (positiveReviews / metrics.metrics.totalReviews) * 100
      : 0;
    const negativePercentage = metrics.metrics.totalReviews
      ? (negativeReviews / metrics.metrics.totalReviews) * 100
      : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" />
              Reputation Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {(metrics.metrics.averageRating * 20).toFixed(0)}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 ml-2">
                /100
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={metrics.metrics.averageRating * 20}
                className="h-2 bg-blue-200 dark:bg-blue-800"
              />
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              <span className="text-green-500 font-medium">+5 points</span> from
              last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
              Review Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {metrics.metrics.totalReviews}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {positiveReviews} positive
              </Badge>
              <Badge
                variant="outline"
                className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                {negativeReviews} negative
              </Badge>
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              <span className="text-green-500 font-medium">+12%</span> from last
              month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-emerald-500" />
              Response Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                {(metrics.metrics.responseRate * 100).toFixed(0)}%
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={metrics.metrics.responseRate * 100}
                className="h-2 bg-emerald-200 dark:bg-emerald-800"
              />
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              Average response time:{" "}
              <span className="font-medium">
                {metrics.metrics.averageResponseTime}h
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSentimentAnalysis = () => {
    if (!metrics) return null;

    // Calculate sentiment distribution
    const positiveSentiment = reviews.filter(
      (r) => (r.sentiment?.score || 0) > 0.3,
    ).length;
    const neutralSentiment = reviews.filter(
      (r) =>
        (r.sentiment?.score || 0) >= -0.3 && (r.sentiment?.score || 0) <= 0.3,
    ).length;
    const negativeSentiment = reviews.filter(
      (r) => (r.sentiment?.score || 0) < -0.3,
    ).length;

    const positivePercentage = metrics.metrics.totalReviews
      ? (positiveSentiment / metrics.metrics.totalReviews) * 100
      : 0;
    const neutralPercentage = metrics.metrics.totalReviews
      ? (neutralSentiment / metrics.metrics.totalReviews) * 100
      : 0;
    const negativePercentage = metrics.metrics.totalReviews
      ? (negativeSentiment / metrics.metrics.totalReviews) * 100
      : 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Sentiment Analysis
          </CardTitle>
          <CardDescription>
            AI-powered analysis of customer sentiment in reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Positive</span>
                </div>
                <span className="text-sm">
                  {positiveSentiment} ({positivePercentage.toFixed(0)}%)
                </span>
              </div>
              <Progress
                value={positivePercentage}
                className="h-2 bg-slate-200 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Neutral</span>
                </div>
                <span className="text-sm">
                  {neutralSentiment} ({neutralPercentage.toFixed(0)}%)
                </span>
              </div>
              <Progress
                value={neutralPercentage}
                className="h-2 bg-slate-200 dark:bg-slate-800"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Negative</span>
                </div>
                <span className="text-sm">
                  {negativeSentiment} ({negativePercentage.toFixed(0)}%)
                </span>
              </div>
              <Progress
                value={negativePercentage}
                className="h-2 bg-slate-200 dark:bg-slate-800"
              />
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">
                Top Sentiment Drivers
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-md">
                  <h5 className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
                    Positive Factors
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "friendly",
                      "excellent",
                      "helpful",
                      "professional",
                      "quality",
                    ].map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-md">
                  <h5 className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                    Negative Factors
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {["slow", "expensive", "disappointed", "poor", "wait"].map(
                      (keyword) => (
                        <Badge
                          key={keyword}
                          variant="secondary"
                          className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                        >
                          {keyword}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRecentReviews = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>
            Your most recent customer feedback across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={
                          review.authorAvatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorName}`
                        }
                        alt={review.authorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{review.authorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.sourceName} •{" "}
                        {new Date(review.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  {review.title && (
                    <div className="font-medium">{review.title}</div>
                  )}
                  <p className="text-sm mt-1">{review.content}</p>
                </div>
                {review.responseContent && (
                  <div className="mt-3 pl-3 border-l-2 border-primary">
                    <div className="text-xs font-medium">Your response:</div>
                    <p className="text-sm mt-1">{review.responseContent}</p>
                  </div>
                )}
                <div className="mt-3 flex justify-between items-center">
                  <Badge
                    variant={
                      review.status === "new"
                        ? "default"
                        : review.status === "responded"
                          ? "outline"
                          : review.status === "flagged"
                            ? "destructive"
                            : "secondary"
                    }
                  >
                    {review.status.charAt(0).toUpperCase() +
                      review.status.slice(1)}
                  </Badge>
                  {!review.responseContent && (
                    <Button variant="outline" size="sm">
                      Respond
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setActiveTab("reviews")}>
              View all reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Review Insights Dashboard
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={selectedSource || "all"}
            onValueChange={handleSourceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source.id} value={source.id}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={analysisPeriod} onValueChange={setAnalysisPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Last week</SelectItem>
              <SelectItem value="monthly">Last month</SelectItem>
              <SelectItem value="quarterly">Last quarter</SelectItem>
              <SelectItem value="yearly">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="insights">
            <Zap className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageSquare className="h-4 w-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="actions">
            <Sparkles className="h-4 w-4 mr-2" />
            Recommended Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {renderInsightCards()}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSentimentAnalysis()}
                {renderRecentReviews()}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={
                                review.authorAvatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorName}`
                              }
                              alt={review.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {review.authorName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.sourceName} •{" "}
                              {new Date(
                                review.publishedAt,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-2">
                        {review.title && (
                          <div className="font-medium">{review.title}</div>
                        )}
                        <p className="text-sm mt-1">{review.content}</p>
                      </div>
                      {review.responseContent && (
                        <div className="mt-3 pl-3 border-l-2 border-primary">
                          <div className="text-xs font-medium">
                            Your response:
                          </div>
                          <p className="text-sm mt-1">
                            {review.responseContent}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 flex justify-between items-center">
                        <Badge
                          variant={
                            review.status === "new"
                              ? "default"
                              : review.status === "responded"
                                ? "outline"
                                : review.status === "flagged"
                                  ? "destructive"
                                  : "secondary"
                          }
                        >
                          {review.status.charAt(0).toUpperCase() +
                            review.status.slice(1)}
                        </Badge>
                        {!review.responseContent && (
                          <Button variant="outline" size="sm">
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Trends</CardTitle>
                <CardDescription>
                  How your ratings have changed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Rating trend visualization would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Recommendations</CardTitle>
                <CardDescription>
                  Smart actions to improve your reputation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-700 dark:text-amber-300">
                          Respond to Negative Reviews
                        </h4>
                        <p className="text-sm mt-1 text-amber-600 dark:text-amber-400">
                          You have 5 negative reviews that need responses.
                          Responding promptly can improve customer satisfaction.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300 dark:bg-amber-900 dark:hover:bg-amber-800 dark:text-amber-300 dark:border-amber-700"
                        >
                          View Negative Reviews
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start">
                      <Sparkles className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-700 dark:text-blue-300">
                          Optimize Response Templates
                        </h4>
                        <p className="text-sm mt-1 text-blue-600 dark:text-blue-400">
                          Our AI analysis suggests updating your response
                          templates to address common customer concerns about
                          wait times.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300 dark:border-blue-700"
                        >
                          Update Templates
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <div className="flex items-start">
                      <Award className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-700 dark:text-green-300">
                          Highlight Positive Reviews
                        </h4>
                        <p className="text-sm mt-1 text-green-600 dark:text-green-400">
                          You have 12 excellent reviews that would be perfect
                          for showcasing on your website or social media.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-green-100 hover:bg-green-200 text-green-700 border-green-300 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300 dark:border-green-700"
                        >
                          Create Showcase
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewInsightsDashboard;
