import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  RefreshCw,
  Filter,
  Star,
  Search,
  MoreHorizontal,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Download,
  BarChart4,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  ExternalLink,
  Send,
  Trash2,
  Edit,
  Copy,
  Save,
  X,
  Info,
  AlertTriangle,
  Sparkles,
  Zap,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import { ReputationManager, Review, ReviewSource, Competitor, ResponseTemplate, ReputationMetrics, ReviewResponse } from "@/types/reputation";
import { MockReputationManager } from "@/lib/reputation/mockReputationManager";
import { reputationService } from "@/lib/reputation/reputationService";

interface ReputationManagementProps {
  manager?: ReputationManager;
}

const ReputationManagement: React.FC<ReputationManagementProps> = ({ manager = new MockReputationManager() }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30days");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sources, setSources] = useState<ReviewSource[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        reviewsData,
        sourcesData,
        competitorsData,
        templatesData,
        metricsData
      ] = await Promise.all([
        reputationService.getReviews({}),
        reputationService.getSources(),
        reputationService.getCompetitors(),
        reputationService.getTemplates(),
        reputationService.getAllMetrics()
      ]);

      setReviews(reviewsData);
      setSources(sourcesData);
      setCompetitors(competitorsData);
      setTemplates(templatesData);
      setMetrics(metricsData[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (review: Omit<Review, "sentiment" | "keywords">) => {
    try {
      setLoading(true);
      setError(null);
      const newReview = await manager.addReview(review);
      await loadData();
      return newReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add review");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (id: string, updates: Partial<Omit<Review, "id" | "sourceId" | "sourceName" | "publishedAt">>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedReview = await manager.updateReview(id, updates);
      await loadData();
      return updatedReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await manager.deleteReview(id);
      if (success) {
        await loadData();
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResponse = async (response: Omit<ReviewResponse, "id" | "createdAt" | "sentiment">) => {
    try {
      setLoading(true);
      setError(null);
      const newResponse = await manager.createResponse(response);
      await loadData();
      return newResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create response");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSelect = (review: Review) => {
    setSelectedReview(review);
    setResponseText("");
  };

  const handleResponseSubmit = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      await handleCreateResponse({
        reviewId: selectedReview.id,
        content: responseText,
        status: "draft",
        createdBy: "user", // This should come from your auth context
      });
      setResponseText("");
      setSelectedReview(null);
      toast({
        title: "Response created",
        description: "Your response has been saved as a draft.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create response",
        variant: "destructive",
      });
    }
  };

  const handleSourceToggle = async (sourceId: string, enabled: boolean) => {
    try {
      const updatedSource = await manager.updateSource(sourceId, { enabled });
      if (updatedSource) {
        await loadData();
        toast({
          title: "Source updated",
          description: `Source has been ${enabled ? "enabled" : "disabled"}.`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update source",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: ResponseTemplate) => {
    if (selectedReview) {
      setResponseText(template.content.replace("{{name}}", selectedReview.authorName));
    }
  };

  const getSentimentLabel = (sentiment?: { score: number; magnitude: number }) => {
    if (!sentiment) return "neutral";
    const score = sentiment.score;
    if (score > 0.1) return "positive";
    if (score < -0.1) return "negative";
    return "neutral";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reputation Management</h1>
      
      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Reviews</h2>
              <div className="space-y-2">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className={`p-4 cursor-pointer ${
                      selectedReview?.id === review.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleReviewSelect(review)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.authorName}</p>
                        <p className="text-sm text-gray-600">{review.publishedAt.toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded ${
                          getSentimentLabel(review.sentiment) === "positive"
                            ? "bg-green-100 text-green-800"
                            : getSentimentLabel(review.sentiment) === "negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {review.rating} ★
                        </span>
                      </div>
                    </div>
                    <p className="mt-2">{review.content}</p>
                    {review.responseContent && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm font-medium">Response:</p>
                        <p className="text-sm">{review.responseContent}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {selectedReview && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Respond to Review</h2>
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Review Content</Label>
                      <p className="mt-1">{selectedReview.content}</p>
                    </div>
                    <div>
                      <Label>Response</Label>
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response here..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Response Templates</Label>
                      <div className="mt-2 space-y-2">
                        {templates.map((template) => (
                          <Button
                            key={template.id}
                            variant="outline"
                            className="w-full"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedReview(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleResponseSubmit}>Submit Response</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sources">
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Sources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => (
                <Card key={source.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-sm text-gray-600">{source.type}</p>
                    </div>
                    <div className="flex items-center">
                      <Label className="mr-2">Enabled</Label>
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={(e) => handleSourceToggle(source.id, e.target.checked)}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm">
                    Sync Frequency: {source.syncFrequency}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitors">
          <div>
            <h2 className="text-xl font-semibold mb-4">Competitors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitors.map((competitor) => (
                <Card key={competitor.id} className="p-4">
                  <h3 className="font-medium">{competitor.name}</h3>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Sources:</p>
                    <ul className="text-sm text-gray-600">
                      {competitor.sources.map((source, index) => (
                        <li key={index}>{source.name || source.sourceType}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div>
            <h2 className="text-xl font-semibold mb-4">Response Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="p-4">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="mt-2 text-sm">{template.content}</p>
                  <div className="mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          {metrics && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Reputation Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium">Overall Rating</h3>
                  <p className="text-2xl font-bold mt-2">
                    {metrics.metrics.averageRating.toFixed(1)} ★
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on {metrics.metrics.totalReviews} reviews
                  </p>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium">Sentiment Distribution</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Positive</span>
                      <span>{(metrics.metrics.sentimentScore > 0 ? metrics.metrics.sentimentScore * 100 : 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Neutral</span>
                      <span>{(Math.abs(metrics.metrics.sentimentScore) < 0.1 ? 100 : 0).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Negative</span>
                      <span>{(metrics.metrics.sentimentScore < 0 ? Math.abs(metrics.metrics.sentimentScore) * 100 : 0).toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium">Response Rate</h3>
                  <p className="text-2xl font-bold mt-2">
                    {(metrics.metrics.responseRate * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Average response time: {metrics.metrics.averageResponseTime.toFixed(1)} hours
                  </p>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReputationManagement;
