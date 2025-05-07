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
  Star,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import type { Review, ReviewSource, ReputationMetrics, ResponseTemplate } from "@/types/reputation";
import { reputationService } from "@/lib/reputation/reputationService";
import ReviewsTable, { ReviewFilters } from "./ReviewsTable";
import ReviewResponseDialog from "./ReviewResponseDialog";
import SourcesTable from "./SourcesTable";
import AddSourceDialog from "./AddSourceDialog";

const ReputationDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sources, setSources] = useState<ReviewSource[]>([]);
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [selectedReview, setSelectedReview] = useState<Review | undefined>();
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [addSourceDialogOpen, setAddSourceDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reviewsData, sourcesData, metricsData, templatesData] = await Promise.all([
        reputationService.getReviews({
          sourceId: filters.sourceId,
          minRating: filters.minRating,
          maxRating: filters.maxRating,
          status: filters.status,
          sentiment: filters.sentiment,
          hasResponse: filters.hasResponse,
          search: filters.search,
        }),
        reputationService.getSources(),
        reputationService.getAllMetrics(),
        reputationService.getTemplates(),
      ]);

      setReviews(reviewsData);
      setSources(sourcesData);
      setMetrics(metricsData[0] || null);
      setTemplates(templatesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading reputation data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

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
    status: "draft" | "published" | "rejected"
  ) => {
    try {
      await reputationService.createResponse({
        reviewId,
        content,
        status,
        createdBy: "current-user",
      });
      await loadData();
      setResponseDialogOpen(false);
    } catch (err) {
      console.error("Error submitting response:", err);
    }
  };

  const handleAddSource = async (source: Omit<ReviewSource, "lastSyncTime">) => {
    try {
      await reputationService.addSource(source);
      await loadData();
      setAddSourceDialogOpen(false);
    } catch (err) {
      console.error("Error adding source:", err);
    }
  };

  const handleSourceDialogSubmit = (source: Omit<ReviewSource, "id">) => {
    handleAddSource(source as Omit<ReviewSource, "lastSyncTime">);
  };

  const handleSourceToggle = async (sourceId: string, enabled: boolean) => {
    try {
      await reputationService.updateSource(sourceId, { enabled });
      await loadData();
    } catch (err) {
      console.error("Error toggling source:", err);
    }
  };

  const handleSourceDelete = async (sourceId: string) => {
    try {
      await reputationService.deleteSource(sourceId);
      await loadData();
    } catch (err) {
      console.error("Error deleting source:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reputation Management</h1>
        <Button onClick={() => setAddSourceDialogOpen(true)}>
          Add Review Source
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                    <div className="text-2xl font-bold">
                      {metrics.metrics.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500 ml-2">/5</div>
                  </div>
                  <Progress
                    value={metrics.metrics.averageRating * 20}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                    <div className="text-2xl font-bold">
                      {metrics.metrics.totalReviews}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    <div className="text-2xl font-bold">
                      {(metrics.metrics.responseRate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <Progress
                    value={metrics.metrics.responseRate * 100}
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Positive</span>
                      <span>
                        {(metrics.metrics.sentimentScore > 0 ? metrics.metrics.sentimentScore * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Neutral</span>
                      <span>
                        {(Math.abs(metrics.metrics.sentimentScore) < 0.1 ? 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Negative</span>
                      <span>
                        {(metrics.metrics.sentimentScore < 0 ? Math.abs(metrics.metrics.sentimentScore) * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTable
            reviews={reviews}
            onRespondClick={handleRespondClick}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>

        <TabsContent value="sources">
          <SourcesTable
            sources={sources}
            onToggleSource={handleSourceToggle}
            onDeleteSource={handleSourceDelete}
          />
        </TabsContent>
      </Tabs>

      {selectedReview && (
        <ReviewResponseDialog
          review={selectedReview}
          open={responseDialogOpen}
          onOpenChange={setResponseDialogOpen}
          templates={templates}
          onSubmit={handleResponseSubmit}
        />
      )}

      <AddSourceDialog
        open={addSourceDialogOpen}
        onOpenChange={setAddSourceDialogOpen}
        onSubmit={handleSourceDialogSubmit}
      />
    </div>
  );
};

export default ReputationDashboard;
