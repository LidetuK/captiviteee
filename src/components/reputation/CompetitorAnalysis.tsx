import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Competitor } from "@/types/reputation";
import {
  Plus,
  Search,
  TrendingUp,
  BarChart3,
  Star,
  ExternalLink,
  Trash2,
} from "lucide-react";

type SourceType = "g2" | "google" | "yelp" | "facebook" | "trustpilot" | "capterra" | "app_store" | "play_store" | "custom";

interface CompetitorAnalysisProps {
  competitors?: Competitor[];
  yourAverageRating?: number;
  yourTotalReviews?: number;
  onAddCompetitor?: (
    competitor: Omit<
      Competitor,
      "id" | "averageRating" | "totalReviews" | "lastUpdated"
    >,
  ) => void;
  onDeleteCompetitor?: (competitorId: string) => void;
  onRefreshCompetitor?: (competitorId: string) => void;
}

const CompetitorAnalysis: FC<CompetitorAnalysisProps> = ({
  competitors = [],
  yourAverageRating = 4.5,
  yourTotalReviews = 250,
  onAddCompetitor,
  onDeleteCompetitor,
  onRefreshCompetitor,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "competitors">("overview");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState<{
    name: string;
    sources: { sourceType: SourceType; url: string; name?: string }[];
  }>({
    name: "",
    sources: [{ sourceType: "google", url: "", name: "" }],
  });

  const handleAddSource = () => {
    setNewCompetitor({
      ...newCompetitor,
      sources: [
        ...newCompetitor.sources,
        { sourceType: "google", url: "", name: "" },
      ],
    });
  };

  const handleRemoveSource = (index: number) => {
    const updatedSources = [...newCompetitor.sources];
    updatedSources.splice(index, 1);
    setNewCompetitor({
      ...newCompetitor,
      sources: updatedSources,
    });
  };

  const handleSourceChange = (
    index: number,
    field: "sourceType" | "url" | "name",
    value: string,
  ) => {
    const updatedSources = [...newCompetitor.sources];
    updatedSources[index] = {
      ...updatedSources[index],
      [field]: field === "sourceType" ? value as SourceType : value,
    };
    setNewCompetitor({
      ...newCompetitor,
      sources: updatedSources,
    });
  };

  const handleSubmit = () => {
    if (onAddCompetitor && newCompetitor.name.trim() !== "") {
      onAddCompetitor({
        name: newCompetitor.name,
        sources: newCompetitor.sources.filter((s) => s.url.trim() !== ""),
      });
      setNewCompetitor({
        name: "",
        sources: [{ sourceType: "google", url: "", name: "" }],
      });
      setAddDialogOpen(false);
    }
  };

  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-primary">You</Badge>
                      <span>{yourAverageRating.toFixed(1)}</span>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(yourAverageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <Progress value={yourAverageRating * 20} className="h-2" />
                </div>

                {competitors.map((competitor) => (
                  <div key={competitor.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {competitor.name}
                        </Badge>
                        <span>
                          {(competitor.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.round(competitor.averageRating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <Progress
                      value={(competitor.averageRating || 0) * 20}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Review Volume Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-primary">You</Badge>
                    </div>
                    <span className="text-sm">{yourTotalReviews} reviews</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                {competitors.map((competitor) => {
                  const percentage =
                    ((competitor.totalReviews || 0) / yourTotalReviews) * 100;
                  return (
                    <div key={competitor.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {competitor.name}
                          </Badge>
                        </div>
                        <span className="text-sm">
                          {competitor.totalReviews || 0} reviews
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Competitive Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-primary opacity-20 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Competitive position chart would appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Competitor Trends</CardTitle>
            <CardDescription>
              Rating and review volume trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-primary opacity-20 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Competitor trend chart would appear here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCompetitorsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search competitors..." className="pl-8" />
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-5 p-4 font-medium border-b">
            <div className="col-span-2">Competitor</div>
            <div>Rating</div>
            <div>Reviews</div>
            <div className="text-right">Actions</div>
          </div>

          {competitors.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No competitors added yet. Add competitors to track and compare
              your reputation.
            </div>
          ) : (
            competitors.map((competitor) => (
              <div
                key={competitor.id}
                className="grid grid-cols-5 p-4 border-b last:border-b-0 items-center"
              >
                <div className="col-span-2">
                  <div className="font-medium">{competitor.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {competitor.sources.length} source
                    {competitor.sources.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>
                      {competitor.averageRating
                        ? competitor.averageRating.toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div>{competitor.totalReviews || "N/A"}</div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRefreshCompetitor?.(competitor.id)}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={competitor.sources[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCompetitor?.(competitor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Competitor Analysis
        </h2>
        <p className="text-muted-foreground">
          Track and compare your reputation against competitors
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "overview" | "competitors")}
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          {renderCompetitorsTab()}
        </TabsContent>
      </Tabs>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Competitor</DialogTitle>
            <DialogDescription>
              Add a competitor to track and compare their reviews and ratings
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">
                Name
              </label>
              <Input
                id="name"
                value={newCompetitor.name}
                onChange={(e) =>
                  setNewCompetitor({ ...newCompetitor, name: e.target.value })
                }
                placeholder="Competitor name"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right font-medium pt-2">Sources</div>
              <div className="col-span-3 space-y-4">
                {newCompetitor.sources.map((source, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <Select
                      value={source.sourceType}
                      onValueChange={(value) =>
                        handleSourceChange(index, "sourceType", value)
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Source type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="yelp">Yelp</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="trustpilot">Trustpilot</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={source.url}
                      onChange={(e) =>
                        handleSourceChange(index, "url", e.target.value)
                      }
                      placeholder="URL"
                      className="col-span-7"
                    />

                    <div className="col-span-2 flex space-x-1">
                      {index === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddSource}
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveSource(index)}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!newCompetitor.name.trim()}
            >
              Add Competitor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetitorAnalysis;
