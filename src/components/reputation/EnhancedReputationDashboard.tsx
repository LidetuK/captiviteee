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
  Review,
  ReviewSource,
  ReputationMetrics,
  Competitor,
  ResponseTemplate,
  ReviewResponse,
} from "@/types/reputation";
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
} from "lucide-react";
import ReviewsTable, { ReviewFilters } from "./ReviewsTable";
import ReviewResponseDialog from "./ReviewResponseDialog";
import SourcesTable from "./SourcesTable";
import AddSourceDialog from "./AddSourceDialog";
import ReputationVisualAnalysis from "./ReputationVisualAnalysis";
import IntegrationExamples from "./IntegrationExamples";
import CompetitorAnalysis from "./CompetitorAnalysis";
import { ReputationManager } from "@/lib/reputation/reputationManager";

interface EnhancedReputationDashboardProps {
  reputationManager: ReputationManager;
}

const EnhancedReputationDashboard: FC<EnhancedReputationDashboardProps> = ({
  reputationManager,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "sources" | "competitors" | "analysis" | "integrations">("overview");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sources, setSources] = useState<ReviewSource[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [addSourceDialogOpen, setAddSourceDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisPeriod, setAnalysisPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const allSources = await reputationManager.getAllSources();
        setSources(allSources);

        const allCompetitors = await reputationManager.getAllCompetitors();
        setCompetitors(allCompetitors);

        const allTemplates = await reputationManager.getAllTemplates();
        setTemplates(allTemplates);

        const filteredReviews = await reputationManager.getReviews({
          sourceId: filters.sourceId,
          minRating: filters.minRating,
          maxRating: filters.maxRating,
          status: filters.status,
          sentiment: filters.sentiment,
          hasResponse: filters.hasResponse,
          search: filters.search,
        });
        setReviews(filteredReviews);

        // Get metrics
        const metricsData = await reputationManager.generateMetrics(
          analysisPeriod,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          new Date()
        );
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error loading reputation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [reputationManager, filters, analysisPeriod]);

  const handleFilterChange = (newFilters: ReviewFilters) => {
    setFilters(newFilters);
  };

  const handleRespondClick = (review: Review) => {
    setSelectedReview(review);
    setResponseDialogOpen(true);
  };

  const handleResponseSubmit = async (
    reviewId: string,
    content: string,
    status: "draft" | "published" | "rejected",
  ) => {
    try {
      await reputationManager.createResponse({
        reviewId,
        content,
        status,
        createdBy: "current-user",
      });

      // Refresh reviews
      const updatedReviews = await reputationManager.getReviews({
        sourceId: filters.sourceId,
        minRating: filters.minRating,
        maxRating: filters.maxRating,
        status: filters.status,
        sentiment: filters.sentiment,
        hasResponse: filters.hasResponse,
        search: filters.search,
      });
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const handleAddSource = async (source: Omit<ReviewSource, "id">) => {
    try {
      await reputationManager.addSource(source as Omit<ReviewSource, "lastSyncTime">);

      // Refresh sources
      const updatedSources = await reputationManager.getAllSources();
      setSources(updatedSources);

      setAddSourceDialogOpen(false);
    } catch (error) {
      console.error("Error adding source:", error);
    }
  };

  const handleAddCompetitor = async (
    competitor: Omit<Competitor, "id" | "averageRating" | "totalReviews" | "lastUpdated">,
  ) => {
    try {
      await reputationManager.addCompetitor(competitor as Omit<Competitor, "averageRating" | "totalReviews" | "lastUpdated">);

      // Refresh competitors
      const updatedCompetitors = await reputationManager.getAllCompetitors();
      setCompetitors(updatedCompetitors);
    } catch (error) {
      console.error("Error adding competitor:", error);
    }
  };

  const handleDeleteCompetitor = async (competitorId: string) => {
    try {
      await reputationManager.deleteCompetitor(competitorId);

      // Refresh competitors
      const updatedCompetitors = await reputationManager.getAllCompetitors();
      setCompetitors(updatedCompetitors);
    } catch (error) {
      console.error("Error deleting competitor:", error);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const [updatedReviews, updatedSources, updatedCompetitors, updatedMetrics] = await Promise.all([
        reputationManager.getReviews({
          sourceId: filters.sourceId,
          minRating: filters.minRating,
          maxRating: filters.maxRating,
          status: filters.status,
          sentiment: filters.sentiment,
          hasResponse: filters.hasResponse,
          search: filters.search,
        }),
        reputationManager.getAllSources(),
        reputationManager.getAllCompetitors(),
        reputationManager.generateMetrics(
          analysisPeriod,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        ),
      ]);

      setReviews(updatedReviews);
      setSources(updatedSources);
      setCompetitors(updatedCompetitors);
      setMetrics(updatedMetrics);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverviewCards = () => {
    if (!metrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
              <div className="text-2xl font-bold">
                {metrics.metrics.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground ml-2">/5</div>
            </div>
            <div className="mt-2">
              <Progress
                value={metrics.metrics.averageRating * 20}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {metrics.metrics.totalReviews}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              <span className="text-green-500 font-medium">+12%</span> from last
              month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {(metrics.metrics.responseRate * 100).toFixed(0)}%
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={metrics.metrics.responseRate * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">
                {reviews.filter((r) => r.status === "flagged").length}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Negative reviews requiring immediate response
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Reputation Management
        </h2>
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
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageSquare className="h-4 w-4 mr-2" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="sources">
            <Layers className="h-4 w-4 mr-2" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <LineChart className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="competitors">
            <Users className="h-4 w-4 mr-2" />
            Competitors
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Settings className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {renderOverviewCards()}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>
                      Your most recent customer feedback across all platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewsTable
                      reviews={reviews.slice(0, 5)}
                      onRespondClick={handleRespondClick}
                      onFilterChange={handleFilterChange}
                    />
                    <div className="mt-4 text-center">
                      <Button
                        variant="link"
                        onClick={() => setActiveTab("reviews")}
                      >
                        View all reviews
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of ratings across all platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {metrics && (
                      <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count =
                            metrics.metrics.reviewsByRating[
                              rating.toString()
                            ] || 0;
                          const percentage = metrics.metrics.totalReviews
                            ? (count / metrics.metrics.totalReviews) * 100
                            : 0;

                          return (
                            <div key={rating} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex">
                                    {Array.from({ length: rating }).map(
                                      (_, i) => (
                                        <Star
                                          key={i}
                                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                        />
                                      ),
                                    )}
                                  </div>
                                  <span className="text-sm ml-2">
                                    {rating} star
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">All Reviews</h3>
              <Button variant="outline" size="sm">
                Export Reviews
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <ReviewsTable
                  reviews={reviews}
                  onRespondClick={handleRespondClick}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>
          </div>

          {selectedReview && (
            <ReviewResponseDialog
              open={responseDialogOpen}
              onOpenChange={setResponseDialogOpen}
              review={selectedReview}
              templates={templates}
              onSubmit={handleResponseSubmit}
            />
          )}
        </TabsContent>

        <TabsContent value="sources">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Review Sources</h3>
              <Button onClick={() => setAddSourceDialogOpen(true)}>
                Add Source
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <SourcesTable sources={sources} />
              </CardContent>
            </Card>
          </div>

          <AddSourceDialog
            open={addSourceDialogOpen}
            onOpenChange={setAddSourceDialogOpen}
            onSubmit={handleAddSource}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <ReputationVisualAnalysis
            metrics={metrics}
            reviews={reviews}
            isLoading={isLoading}
            period={analysisPeriod}
            onPeriodChange={(period: string) => setAnalysisPeriod(period as typeof analysisPeriod)}
          />
        </TabsContent>

        <TabsContent value="competitors">
          <CompetitorAnalysis
            competitors={competitors}
            yourAverageRating={metrics?.metrics.averageRating || 0}
            yourTotalReviews={metrics?.metrics.totalReviews || 0}
            onAddCompetitor={handleAddCompetitor}
            onDeleteCompetitor={handleDeleteCompetitor}
          />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationExamples />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedReputationDashboard;
