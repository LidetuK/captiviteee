import { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Star, Filter, Search } from "lucide-react";
import type { Review } from "@/types/reputation";
import { Label } from "@/components/ui/label";

interface ReviewsTableProps {
  reviews?: Review[];
  onRespondClick?: (review: Review) => void;
  onFilterChange?: (filters: ReviewFilters) => void;
}

export interface ReviewFilters {
  sourceId?: string;
  minRating?: number;
  maxRating?: number;
  status?: Review["status"];
  sentiment?: "positive" | "neutral" | "negative";
  hasResponse?: boolean;
  search?: string;
}

const ReviewsTable: FC<ReviewsTableProps> = ({
  reviews = [],
  onRespondClick,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ search: e.target.value });
  };

  const getStatusBadge = (status: Review["status"]) => {
    switch (status) {
      case "new":
        return <Badge variant="outline">New</Badge>;
      case "responded":
        return <Badge variant="success">Responded</Badge>;
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>;
      default:
        return null;
    }
  };

  const getSentimentBadge = (sentiment?: { score: number; magnitude: number }) => {
    if (!sentiment) return null;
    const score = sentiment.score;
    if (score > 0.1) return <Badge variant="success">Positive</Badge>;
    if (score < -0.1) return <Badge variant="destructive">Negative</Badge>;
    return <Badge variant="outline">Neutral</Badge>;
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            className="pl-10"
            onChange={handleSearchChange}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
          <div>
            <Label>Source</Label>
            <Select
              onValueChange={(value) =>
                handleFilterChange({ sourceId: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="yelp">Yelp</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Rating</Label>
            <Select
              onValueChange={(value) => {
                const [min, max] = value.split("-").map(Number);
                handleFilterChange({
                  minRating: min,
                  maxRating: max,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Ratings</SelectItem>
                <SelectItem value="4-5">4-5 Stars</SelectItem>
                <SelectItem value="2-3">2-3 Stars</SelectItem>
                <SelectItem value="0-1">0-1 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(value) =>
                handleFilterChange({ status: value as Review["status"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.authorName}</TableCell>
                <TableCell>
                  <div className="flex">{renderStars(review.rating)}</div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2">{review.content}</p>
                </TableCell>
                <TableCell>{getSentimentBadge(review.sentiment)}</TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>{review.publishedAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRespondClick?.(review)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReviewsTable;
