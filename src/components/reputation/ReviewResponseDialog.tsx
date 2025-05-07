import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Review, ResponseTemplate } from "@/types/reputation";
import { reputationService } from "@/lib/reputation/reputationService";

interface ReviewResponseDialogProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ResponseTemplate[];
  onSubmit: (reviewId: string, content: string, status: "draft" | "published" | "rejected") => Promise<void>;
}

const ReviewResponseDialog: FC<ReviewResponseDialogProps> = ({
  review,
  open,
  onOpenChange,
  templates,
  onSubmit,
}) => {
  const [responseContent, setResponseContent] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (review?.responseContent) {
      setResponseContent(review.responseContent);
    } else {
      setResponseContent("");
    }
  }, [review]);

  const handleSubmit = async () => {
    if (!review || !responseContent.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await onSubmit(review.id, responseContent, "published");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: ResponseTemplate) => {
    if (review) {
      const response = template.content.replace("{{name}}", review.authorName);
      setResponseContent(response);
      setActiveTab("write");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getSentimentIcon = (sentiment?: { score: number; magnitude: number }) => {
    if (!sentiment) return <MessageSquare className="h-4 w-4 text-gray-500" />;
    
    if (sentiment.score > 0.3) return <ThumbsUp className="h-4 w-4 text-green-500" />;
    if (sentiment.score < -0.3) return <ThumbsDown className="h-4 w-4 text-red-500" />;
    return <MessageSquare className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Respond to Review</DialogTitle>
          <DialogDescription>
            Write a response to the customer's review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{review.authorName}</p>
                <p className="text-sm text-gray-600">
                  {review.publishedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <div>{getSentimentIcon(review.sentiment)}</div>
              </div>
            </div>
            <p className="mt-2">{review.content}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="write">Write Response</TabsTrigger>
              <TabsTrigger value="templates">Use Template</TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <Textarea
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
                placeholder="Write your response here..."
                rows={4}
              />
            </TabsContent>

            <TabsContent value="templates">
              <div className="space-y-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !responseContent.trim()}>
            {loading ? "Submitting..." : "Submit Response"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewResponseDialog;
