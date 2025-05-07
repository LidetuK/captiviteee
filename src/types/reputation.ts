export interface Review {
  id: string;
  sourceId: string;
  sourceName: string;
  externalId?: string;
  externalUrl?: string;
  authorName: string;
  authorId?: string;
  authorAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  publishedAt: Date;
  updatedAt?: Date;
  responseId?: string;
  responseContent?: string;
  responsePublishedAt?: Date;
  status: "new" | "read" | "responded" | "flagged" | "archived";
  sentiment?: {
    score: number;
    magnitude: number;
    categories?: { category: string; score: number }[];
  };
  keywords?: { keyword: string; relevance: number }[];
  tags?: string[];
  assignedTo?: string;
  notes?: string[];
}

export interface ReviewSource {
  id: string;
  name: string;
  type: "google" | "yelp" | "facebook" | "trustpilot" | "capterra" | "g2" | "app_store" | "play_store" | "custom";
  url?: string;
  apiKey?: string;
  enabled: boolean;
  lastSyncTime?: Date;
  syncFrequency: "hourly" | "daily" | "weekly" | "never";
  credentials?: Record<string, string>;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  content: string;
  status: "draft" | "published" | "rejected";
  createdAt: Date;
  publishedAt?: Date;
  createdBy: string;
  publishedBy?: string;
  templateId?: string;
  sentiment?: number;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  variables?: string[];
  sentiment: "positive" | "neutral" | "negative";
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
  successRate?: number;
}

export interface Competitor {
  id: string;
  name: string;
  sources: {
    sourceType: ReviewSource["type"];
    url: string;
    name?: string;
  }[];
  averageRating?: number;
  totalReviews?: number;
  lastUpdated?: Date;
}

export interface ReputationMetrics {
  id: string;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate: Date;
  metrics: {
    averageRating: number;
    totalReviews: number;
    reviewsBySource: Record<string, number>;
    reviewsByRating: Record<string, number>;
    responseRate: number;
    averageResponseTime: number;
    sentimentScore: number;
    topKeywords: { keyword: string; count: number; sentiment: number }[];
    ratingTrend: { date: string; rating: number }[];
    volumeTrend: { date: string; count: number }[];
  };
  competitiveMetrics?: {
    competitorId: string;
    competitorName: string;
    averageRating: number;
    totalReviews: number;
    ratingDifference: number;
    volumeDifference: number;
  }[];
}

export interface ReputationManager {
  getAllReviews(): Review[];
  getReviews(filters: {
    sourceId?: string;
    minRating?: number;
    maxRating?: number;
    status?: Review["status"];
    startDate?: Date;
    endDate?: Date;
    sentiment?: "positive" | "neutral" | "negative";
    hasResponse?: boolean;
    search?: string;
    tags?: string[];
    assignedTo?: string;
  }): Review[];
  getReview(id: string): Review | undefined;
  addReview(review: Omit<Review, "sentiment" | "keywords">): Promise<Review>;
  updateReview(id: string, updates: Partial<Omit<Review, "id" | "sourceId" | "sourceName" | "publishedAt">>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
  createResponse(response: Omit<ReviewResponse, "id" | "createdAt" | "sentiment">): Promise<ReviewResponse>;
  
  getAllSources(): ReviewSource[];
  getSource(id: string): ReviewSource | undefined;
  addSource(source: Omit<ReviewSource, "lastSyncTime">): Promise<ReviewSource>;
  updateSource(id: string, updates: Partial<Omit<ReviewSource, "id">>): Promise<ReviewSource | undefined>;
  deleteSource(id: string): Promise<boolean>;
  
  getAllCompetitors(): Competitor[];
  getCompetitor(id: string): Competitor | undefined;
  addCompetitor(competitor: Omit<Competitor, "averageRating" | "totalReviews" | "lastUpdated">): Promise<Competitor>;
  updateCompetitor(id: string, updates: Partial<Omit<Competitor, "id">>): Promise<Competitor | undefined>;
  deleteCompetitor(id: string): Promise<boolean>;
  
  getAllTemplates(): ResponseTemplate[];
  getTemplate(id: string): ResponseTemplate | undefined;
  addTemplate(template: Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">): Promise<ResponseTemplate>;
  updateTemplate(id: string, updates: Partial<Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">>): Promise<ResponseTemplate | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  
  generateMetrics(period: ReputationMetrics["period"], startDate: Date, endDate: Date): Promise<ReputationMetrics>;
  getMetrics(metricId: string): ReputationMetrics | undefined;
  getAllMetrics(): ReputationMetrics[];
} 