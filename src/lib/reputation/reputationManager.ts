/**
 * Reputation Management System
 */

import { auditLogger } from "../auth/audit";

export interface ReviewSource {
  id: string;
  name: string;
  type:
    | "google"
    | "yelp"
    | "facebook"
    | "trustpilot"
    | "capterra"
    | "g2"
    | "app_store"
    | "play_store"
    | "custom";
  url?: string;
  apiKey?: string;
  enabled: boolean;
  lastSyncTime?: Date;
  syncFrequency: "hourly" | "daily" | "weekly" | "never";
  credentials?: Record<string, string>;
}

export interface Review {
  id: string;
  sourceId: string;
  sourceName: string;
  externalId?: string;
  externalUrl?: string;
  authorName: string;
  authorId?: string;
  authorAvatar?: string;
  rating: number; // 1-5 scale
  title?: string;
  content: string;
  publishedAt: Date;
  updatedAt?: Date;
  responseId?: string;
  responseContent?: string;
  responsePublishedAt?: Date;
  status: "new" | "read" | "responded" | "flagged" | "archived";
  sentiment?: {
    score: number; // -1 to 1
    magnitude: number; // 0 to infinity
    categories?: { category: string; score: number }[];
  };
  keywords?: { keyword: string; relevance: number }[];
  tags?: string[];
  assignedTo?: string;
  notes?: string[];
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
  sentiment?: number; // -1 to 1
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
  successRate?: number; // 0-1 scale
}

export interface ReputationMetrics {
  id: string;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate: Date;
  metrics: {
    averageRating: number; // 1-5 scale
    totalReviews: number;
    reviewsBySource: Record<string, number>;
    reviewsByRating: Record<string, number>; // "1" to "5"
    responseRate: number; // 0-1 scale
    averageResponseTime: number; // in hours
    sentimentScore: number; // -1 to 1
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

export class ReputationManager {
  private sources = new Map<string, ReviewSource>();
  private reviews = new Map<string, Review>();
  private responses = new Map<string, ReviewResponse>();
  private templates = new Map<string, ResponseTemplate>();
  private competitors = new Map<string, Competitor>();
  private metrics = new Map<string, ReputationMetrics>();
  private storageKey = "captivite_reputation_data";

  constructor() {
    // Load reputation data from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // Load sources
          if (parsedData.sources) {
            Object.entries(parsedData.sources).forEach(
              ([id, source]: [string, any]) => {
                if (source.lastSyncTime) {
                  source.lastSyncTime = new Date(source.lastSyncTime);
                }
                this.sources.set(id, source as ReviewSource);
              },
            );
          }

          // Load reviews
          if (parsedData.reviews) {
            Object.entries(parsedData.reviews).forEach(
              ([id, review]: [string, any]) => {
                review.publishedAt = new Date(review.publishedAt);
                if (review.updatedAt) {
                  review.updatedAt = new Date(review.updatedAt);
                }
                if (review.responsePublishedAt) {
                  review.responsePublishedAt = new Date(
                    review.responsePublishedAt,
                  );
                }
                this.reviews.set(id, review as Review);
              },
            );
          }

          // Load responses
          if (parsedData.responses) {
            Object.entries(parsedData.responses).forEach(
              ([id, response]: [string, any]) => {
                response.createdAt = new Date(response.createdAt);
                if (response.publishedAt) {
                  response.publishedAt = new Date(response.publishedAt);
                }
                this.responses.set(id, response as ReviewResponse);
              },
            );
          }

          // Load templates
          if (parsedData.templates) {
            Object.entries(parsedData.templates).forEach(
              ([id, template]: [string, any]) => {
                template.createdAt = new Date(template.createdAt);
                template.updatedAt = new Date(template.updatedAt);
                this.templates.set(id, template as ResponseTemplate);
              },
            );
          }

          // Load competitors
          if (parsedData.competitors) {
            Object.entries(parsedData.competitors).forEach(
              ([id, competitor]: [string, any]) => {
                if (competitor.lastUpdated) {
                  competitor.lastUpdated = new Date(competitor.lastUpdated);
                }
                this.competitors.set(id, competitor as Competitor);
              },
            );
          }

          // Load metrics
          if (parsedData.metrics) {
            Object.entries(parsedData.metrics).forEach(
              ([id, metric]: [string, any]) => {
                metric.startDate = new Date(metric.startDate);
                metric.endDate = new Date(metric.endDate);
                this.metrics.set(id, metric as ReputationMetrics);
              },
            );
          }
        }
      } catch (error) {
        console.error("Failed to load reputation data from storage:", error);
      }
    }
  }

  /**
   * Add a new review source
   */
  async addSource(
    source: Omit<ReviewSource, "lastSyncTime">,
  ): Promise<ReviewSource> {
    const newSource: ReviewSource = {
      ...source,
      lastSyncTime: undefined,
    };

    this.sources.set(newSource.id, newSource);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_source_added",
      resource: "reputation",
      details: { sourceId: newSource.id, sourceName: newSource.name },
      status: "success",
    });

    return newSource;
  }

  /**
   * Get a review source by ID
   */
  getSource(sourceId: string): ReviewSource | undefined {
    return this.sources.get(sourceId);
  }

  /**
   * Get all review sources
   */
  getAllSources(): ReviewSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Update a review source
   */
  async updateSource(
    sourceId: string,
    updates: Partial<Omit<ReviewSource, "id">>,
  ): Promise<ReviewSource | undefined> {
    const source = this.sources.get(sourceId);
    if (!source) return undefined;

    const updatedSource: ReviewSource = {
      ...source,
      ...updates,
      id: sourceId, // Ensure ID doesn't change
    };

    this.sources.set(sourceId, updatedSource);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_source_updated",
      resource: "reputation",
      details: { sourceId, sourceName: updatedSource.name },
      status: "success",
    });

    return updatedSource;
  }

  /**
   * Delete a review source
   */
  async deleteSource(sourceId: string): Promise<boolean> {
    const source = this.sources.get(sourceId);
    if (!source) return false;

    this.sources.delete(sourceId);

    // Also delete all reviews from this source
    for (const [reviewId, review] of this.reviews.entries()) {
      if (review.sourceId === sourceId) {
        this.reviews.delete(reviewId);
      }
    }

    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_source_deleted",
      resource: "reputation",
      details: { sourceId, sourceName: source.name },
      status: "success",
    });

    return true;
  }

  /**
   * Add a new review
   */
  async addReview(
    review: Omit<Review, "sentiment" | "keywords">,
  ): Promise<Review> {
    // Analyze sentiment and extract keywords
    const analyzedReview = await this.analyzeReview(review);

    this.reviews.set(analyzedReview.id, analyzedReview);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_added",
      resource: "reputation",
      details: {
        reviewId: analyzedReview.id,
        sourceId: analyzedReview.sourceId,
        rating: analyzedReview.rating,
        sentiment: analyzedReview.sentiment?.score,
      },
      status: "success",
    });

    return analyzedReview;
  }

  /**
   * Get a review by ID
   */
  getReview(reviewId: string): Review | undefined {
    return this.reviews.get(reviewId);
  }

  /**
   * Get all reviews
   */
  getAllReviews(): Review[] {
    return Array.from(this.reviews.values());
  }

  /**
   * Get reviews with filtering
   */
  getReviews(
    filters: {
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
    } = {},
  ): Review[] {
    let filteredReviews = Array.from(this.reviews.values());

    // Apply filters
    if (filters.sourceId) {
      filteredReviews = filteredReviews.filter(
        (review) => review.sourceId === filters.sourceId,
      );
    }

    if (filters.minRating !== undefined) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating >= filters.minRating!,
      );
    }

    if (filters.maxRating !== undefined) {
      filteredReviews = filteredReviews.filter(
        (review) => review.rating <= filters.maxRating!,
      );
    }

    if (filters.status) {
      filteredReviews = filteredReviews.filter(
        (review) => review.status === filters.status,
      );
    }

    if (filters.startDate) {
      filteredReviews = filteredReviews.filter(
        (review) => review.publishedAt >= filters.startDate!,
      );
    }

    if (filters.endDate) {
      filteredReviews = filteredReviews.filter(
        (review) => review.publishedAt <= filters.endDate!,
      );
    }

    if (filters.sentiment) {
      filteredReviews = filteredReviews.filter((review) => {
        if (!review.sentiment) return false;

        switch (filters.sentiment) {
          case "positive":
            return review.sentiment.score > 0.2;
          case "neutral":
            return (
              review.sentiment.score >= -0.2 && review.sentiment.score <= 0.2
            );
          case "negative":
            return review.sentiment.score < -0.2;
          default:
            return true;
        }
      });
    }

    if (filters.hasResponse !== undefined) {
      filteredReviews = filteredReviews.filter(
        (review) => (review.responseId !== undefined) === filters.hasResponse,
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredReviews = filteredReviews.filter(
        (review) =>
          review.content.toLowerCase().includes(searchLower) ||
          (review.title?.toLowerCase().includes(searchLower) ?? false) ||
          review.authorName.toLowerCase().includes(searchLower),
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredReviews = filteredReviews.filter(
        (review) =>
          review.tags?.some((tag) => filters.tags!.includes(tag)) ?? false,
      );
    }

    if (filters.assignedTo) {
      filteredReviews = filteredReviews.filter(
        (review) => review.assignedTo === filters.assignedTo,
      );
    }

    return filteredReviews;
  }

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    updates: Partial<
      Omit<Review, "id" | "sourceId" | "sourceName" | "publishedAt">
    >,
  ): Promise<Review | undefined> {
    const review = this.reviews.get(reviewId);
    if (!review) return undefined;

    const updatedReview: Review = {
      ...review,
      ...updates,
      id: reviewId, // Ensure ID doesn't change
      sourceId: review.sourceId, // Ensure source doesn't change
      sourceName: review.sourceName, // Ensure source name doesn't change
      publishedAt: review.publishedAt, // Ensure published date doesn't change
    };

    this.reviews.set(reviewId, updatedReview);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_updated",
      resource: "reputation",
      details: { reviewId, status: updatedReview.status },
      status: "success",
    });

    return updatedReview;
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    const review = this.reviews.get(reviewId);
    if (!review) return false;

    this.reviews.delete(reviewId);

    // Also delete any responses to this review
    if (review.responseId) {
      this.responses.delete(review.responseId);
    }

    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_deleted",
      resource: "reputation",
      details: { reviewId, sourceId: review.sourceId },
      status: "success",
    });

    return true;
  }

  /**
   * Create a response to a review
   */
  async createResponse(
    response: Omit<ReviewResponse, "id" | "createdAt" | "sentiment">,
  ): Promise<ReviewResponse> {
    const responseId = `response_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();

    // Analyze sentiment of the response
    const sentiment = await this.analyzeSentiment(response.content);

    const newResponse: ReviewResponse = {
      ...response,
      id: responseId,
      createdAt: now,
      sentiment,
    };

    this.responses.set(responseId, newResponse);

    // Update the review with the response ID
    const review = this.reviews.get(response.reviewId);
    if (review) {
      review.responseId = responseId;
      review.responseContent = response.content;

      if (response.status === "published") {
        review.responsePublishedAt = now;
        review.status = "responded";
      }

      this.reviews.set(review.id, review);
    }

    this.persistData();

    await auditLogger.log({
      userId: response.createdBy,
      action: "review_response_created",
      resource: "reputation",
      details: {
        responseId,
        reviewId: response.reviewId,
        status: response.status,
      },
      status: "success",
    });

    // If a template was used, update its usage count
    if (response.templateId) {
      const template = this.templates.get(response.templateId);
      if (template) {
        template.usageCount++;
        this.templates.set(template.id, template);
        this.persistData();
      }
    }

    return newResponse;
  }

  /**
   * Update a response
   */
  async updateResponse(
    responseId: string,
    updates: Partial<Omit<ReviewResponse, "id" | "reviewId" | "createdAt">>,
  ): Promise<ReviewResponse | undefined> {
    const response = this.responses.get(responseId);
    if (!response) return undefined;

    // If content was updated, re-analyze sentiment
    let sentiment = response.sentiment;
    if (updates.content && updates.content !== response.content) {
      sentiment = await this.analyzeSentiment(updates.content);
    }

    const updatedResponse: ReviewResponse = {
      ...response,
      ...updates,
      id: responseId, // Ensure ID doesn't change
      reviewId: response.reviewId, // Ensure review ID doesn't change
      createdAt: response.createdAt, // Ensure created date doesn't change
      sentiment,
    };

    this.responses.set(responseId, updatedResponse);

    // Update the review with the new response content if needed
    if (updates.content) {
      const review = this.reviews.get(response.reviewId);
      if (review) {
        review.responseContent = updates.content;

        // If status changed to published, update the review status and published date
        if (updates.status === "published" && response.status !== "published") {
          review.responsePublishedAt = new Date();
          review.status = "responded";
        }

        this.reviews.set(review.id, review);
      }
    }

    this.persistData();

    await auditLogger.log({
      userId: updatedResponse.publishedBy || updatedResponse.createdBy,
      action: "review_response_updated",
      resource: "reputation",
      details: {
        responseId,
        reviewId: updatedResponse.reviewId,
        status: updatedResponse.status,
      },
      status: "success",
    });

    return updatedResponse;
  }

  /**
   * Delete a response
   */
  async deleteResponse(responseId: string): Promise<boolean> {
    const response = this.responses.get(responseId);
    if (!response) return false;

    this.responses.delete(responseId);

    // Update the review to remove the response reference
    const review = this.reviews.get(response.reviewId);
    if (review) {
      review.responseId = undefined;
      review.responseContent = undefined;
      review.responsePublishedAt = undefined;

      // If the review was in responded status, change it back to read
      if (review.status === "responded") {
        review.status = "read";
      }

      this.reviews.set(review.id, review);
    }

    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "review_response_deleted",
      resource: "reputation",
      details: { responseId, reviewId: response.reviewId },
      status: "success",
    });

    return true;
  }

  /**
   * Add a response template
   */
  async addTemplate(
    template: Omit<
      ResponseTemplate,
      "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate"
    >,
  ): Promise<ResponseTemplate> {
    const templateId = `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();

    const newTemplate: ResponseTemplate = {
      ...template,
      id: templateId,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      successRate: undefined,
    };

    this.templates.set(templateId, newTemplate);
    this.persistData();

    await auditLogger.log({
      userId: template.createdBy,
      action: "response_template_added",
      resource: "reputation",
      details: { templateId, name: template.name, category: template.category },
      status: "success",
    });

    return newTemplate;
  }

  /**
   * Get a template by ID
   */
  getTemplate(templateId: string): ResponseTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ResponseTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates with filtering
   */
  getTemplates(
    filters: {
      category?: string;
      sentiment?: ResponseTemplate["sentiment"];
      search?: string;
      tags?: string[];
      createdBy?: string;
    } = {},
  ): ResponseTemplate[] {
    let filteredTemplates = Array.from(this.templates.values());

    // Apply filters
    if (filters.category) {
      filteredTemplates = filteredTemplates.filter(
        (template) => template.category === filters.category,
      );
    }

    if (filters.sentiment) {
      filteredTemplates = filteredTemplates.filter(
        (template) => template.sentiment === filters.sentiment,
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchLower) ||
          template.content.toLowerCase().includes(searchLower) ||
          template.category.toLowerCase().includes(searchLower),
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredTemplates = filteredTemplates.filter(
        (template) =>
          template.tags?.some((tag) => filters.tags!.includes(tag)) ?? false,
      );
    }

    if (filters.createdBy) {
      filteredTemplates = filteredTemplates.filter(
        (template) => template.createdBy === filters.createdBy,
      );
    }

    return filteredTemplates;
  }

  /**
   * Update a template
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<
      Omit<
        ResponseTemplate,
        "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate"
      >
    >,
  ): Promise<ResponseTemplate | undefined> {
    const template = this.templates.get(templateId);
    if (!template) return undefined;

    const updatedTemplate: ResponseTemplate = {
      ...template,
      ...updates,
      id: templateId, // Ensure ID doesn't change
      createdAt: template.createdAt, // Ensure created date doesn't change
      updatedAt: new Date(), // Update the updated date
      usageCount: template.usageCount, // Ensure usage count doesn't change
      successRate: template.successRate, // Ensure success rate doesn't change
    };

    this.templates.set(templateId, updatedTemplate);
    this.persistData();

    await auditLogger.log({
      userId: updates.createdBy || template.createdBy,
      action: "response_template_updated",
      resource: "reputation",
      details: { templateId, name: updatedTemplate.name },
      status: "success",
    });

    return updatedTemplate;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) return false;

    this.templates.delete(templateId);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "response_template_deleted",
      resource: "reputation",
      details: { templateId, name: template.name },
      status: "success",
    });

    return true;
  }

  /**
   * Add a competitor
   */
  async addCompetitor(
    competitor: Omit<
      Competitor,
      "averageRating" | "totalReviews" | "lastUpdated"
    >,
  ): Promise<Competitor> {
    const newCompetitor: Competitor = {
      ...competitor,
      averageRating: undefined,
      totalReviews: undefined,
      lastUpdated: new Date(),
    };

    this.competitors.set(competitor.id, newCompetitor);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "competitor_added",
      resource: "reputation",
      details: { competitorId: competitor.id, name: competitor.name },
      status: "success",
    });

    return newCompetitor;
  }

  /**
   * Get a competitor by ID
   */
  getCompetitor(competitorId: string): Competitor | undefined {
    return this.competitors.get(competitorId);
  }

  /**
   * Get all competitors
   */
  getAllCompetitors(): Competitor[] {
    return Array.from(this.competitors.values());
  }

  /**
   * Update a competitor
   */
  async updateCompetitor(
    competitorId: string,
    updates: Partial<Omit<Competitor, "id">>,
  ): Promise<Competitor | undefined> {
    const competitor = this.competitors.get(competitorId);
    if (!competitor) return undefined;

    const updatedCompetitor: Competitor = {
      ...competitor,
      ...updates,
      id: competitorId, // Ensure ID doesn't change
      lastUpdated: new Date(), // Update the last updated date
    };

    this.competitors.set(competitorId, updatedCompetitor);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "competitor_updated",
      resource: "reputation",
      details: { competitorId, name: updatedCompetitor.name },
      status: "success",
    });

    return updatedCompetitor;
  }

  /**
   * Delete a competitor
   */
  async deleteCompetitor(competitorId: string): Promise<boolean> {
    const competitor = this.competitors.get(competitorId);
    if (!competitor) return false;

    this.competitors.delete(competitorId);
    this.persistData();

    await auditLogger.log({
      userId: "system",
      action: "competitor_deleted",
      resource: "reputation",
      details: { competitorId, name: competitor.name },
      status: "success",
    });

    return true;
  }

  /**
   * Generate reputation metrics for a specific period
   */
  async generateMetrics(
    period: ReputationMetrics["period"],
    startDate: Date,
    endDate: Date,
  ): Promise<ReputationMetrics> {
    const metricId = `metrics_${period}_${startDate.toISOString()}_${endDate.toISOString()}`;

    // Get reviews within the date range
    const reviews = this.getReviews({
      startDate,
      endDate,
    });

    // Calculate metrics
    const totalReviews = reviews.length;
    let totalRating = 0;
    const reviewsBySource: Record<string, number> = {};
    const reviewsByRating: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    let totalSentiment = 0;
    let respondedReviews = 0;
    let totalResponseTime = 0;

    // Keyword tracking
    const keywordCounts: Record<
      string,
      { count: number; totalSentiment: number }
    > = {};

    // Trend data
    const ratingByDate: Record<string, { total: number; count: number }> = {};
    const countByDate: Record<string, number> = {};

    // Process each review
    for (const review of reviews) {
      // Add to total rating
      totalRating += review.rating;

      // Count by source
      reviewsBySource[review.sourceId] =
        (reviewsBySource[review.sourceId] || 0) + 1;

      // Count by rating
      reviewsByRating[review.rating.toString()] =
        (reviewsByRating[review.rating.toString()] || 0) + 1;

      // Add to sentiment total if available
      if (review.sentiment) {
        totalSentiment += review.sentiment.score;
      }

      // Check if responded
      if (review.responseId) {
        respondedReviews++;

        // Calculate response time if available
        if (review.responsePublishedAt) {
          const responseTime =
            (review.responsePublishedAt.getTime() -
              review.publishedAt.getTime()) /
            (1000 * 60 * 60); // in hours
          totalResponseTime += responseTime;
        }
      }

      // Process keywords
      if (review.keywords) {
        for (const { keyword, relevance } of review.keywords) {
          if (relevance > 0.5) {
            // Only count significant keywords
            if (!keywordCounts[keyword]) {
              keywordCounts[keyword] = { count: 0, totalSentiment: 0 };
            }
            keywordCounts[keyword].count++;
            if (review.sentiment) {
              keywordCounts[keyword].totalSentiment += review.sentiment.score;
            }
          }
        }
      }

      // Add to trend data
      const dateStr = review.publishedAt.toISOString().split("T")[0]; // YYYY-MM-DD

      // Rating trend
      if (!ratingByDate[dateStr]) {
        ratingByDate[dateStr] = { total: 0, count: 0 };
      }
      ratingByDate[dateStr].total += review.rating;
      ratingByDate[dateStr].count++;

      // Volume trend
      countByDate[dateStr] = (countByDate[dateStr] || 0) + 1;
    }

    // Calculate averages and prepare final metrics
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    const responseRate = totalReviews > 0 ? respondedReviews / totalReviews : 0;
    const averageResponseTime =
      respondedReviews > 0 ? totalResponseTime / respondedReviews : 0;
    const sentimentScore = totalReviews > 0 ? totalSentiment / totalReviews : 0;

    // Prepare top keywords
    const topKeywords = Object.entries(keywordCounts)
      .map(([keyword, { count, totalSentiment }]) => ({
        keyword,
        count,
        sentiment: count > 0 ? totalSentiment / count : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 keywords

    // Prepare trend data
    const ratingTrend = Object.entries(ratingByDate)
      .map(([date, { total, count }]) => ({
        date,
        rating: count > 0 ? total / count : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const volumeTrend = Object.entries(countByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Create metrics object
    const metrics: ReputationMetrics = {
      id: metricId,
      period,
      startDate,
      endDate,
      metrics: {
        averageRating,
        totalReviews,
        reviewsBySource,
        reviewsByRating,
        responseRate,
        averageResponseTime,
        sentimentScore,
        topKeywords,
        ratingTrend,
        volumeTrend,
      },
    };

    // Add competitive metrics if competitors exist
    const competitors = this.getAllCompetitors();
    if (competitors.length > 0) {
      metrics.competitiveMetrics = competitors.map((competitor) => ({
        competitorId: competitor.id,
        competitorName: competitor.name,
        averageRating: competitor.averageRating || 0,
        totalReviews: competitor.totalReviews || 0,
        ratingDifference: (competitor.averageRating || 0) - averageRating,
        volumeDifference: (competitor.totalReviews || 0) - totalReviews,
      }));
    }

    // Save metrics
    this.metrics.set(metricId, metrics);
    this.persistData();

    return metrics;
  }

  /**
   * Get metrics by ID
   */
  getMetrics(metricId: string): ReputationMetrics | undefined {
    return this.metrics.get(metricId);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): ReputationMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Analyze sentiment and extract keywords from a review
   * This is a placeholder implementation - in a real app, this would use NLP services
   */
  private async analyzeReview(
    review: Omit<Review, "sentiment" | "keywords">,
  ): Promise<Review> {
    // Simple sentiment analysis based on rating
    const sentimentScore = (review.rating - 3) / 2; // Maps 1-5 to -1 to 1
    const magnitude = Math.abs(sentimentScore) * 2; // Higher for extreme ratings

    // Extract simple keywords (in a real app, this would use NLP)
    const keywords = this.extractKeywords(review.content);

    return {
      ...review,
      sentiment: {
        score: sentimentScore,
        magnitude,
        categories: [{ category: "general", score: sentimentScore }],
      },
      keywords,
    };
  }

  /**
   * Analyze sentiment of text
   * This is a placeholder implementation - in a real app, this would use NLP services
   */
  private async analyzeSentiment(text: string): Promise<number> {
    // Simple sentiment analysis based on positive/negative word count
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "helpful",
      "best",
      "love",
      "happy",
    ];
    const negativeWords = [
      "bad",
      "poor",
      "terrible",
      "awful",
      "horrible",
      "worst",
      "hate",
      "disappointed",
      "frustrating",
      "useless",
    ];

    const words = text.toLowerCase().split(/\W+/);

    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of words) {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    }

    // Calculate sentiment score between -1 and 1
    if (positiveCount === 0 && negativeCount === 0) return 0;
    return (positiveCount - negativeCount) / (positiveCount + negativeCount);
  }

  /**
   * Extract keywords from text
   * This is a placeholder implementation - in a real app, this would use NLP services
   */
  private extractKeywords(
    text: string,
  ): { keyword: string; relevance: number }[] {
    // Simple keyword extraction based on word frequency
    const stopWords = [
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "about",
      "as",
      "i",
      "my",
      "me",
      "we",
      "our",
      "you",
      "your",
      "they",
      "their",
      "it",
      "its",
      "this",
      "that",
      "these",
      "those",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "but",
      "or",
      "if",
      "then",
      "else",
      "when",
      "up",
      "down",
      "out",
      "so",
      "no",
      "not",
      "only",
      "very",
      "can",
      "will",
      "just",
    ];

    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 2 && !stopWords.includes(word));

    const wordCounts: Record<string, number> = {};
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }

    // Convert to array and sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 keywords

    // Calculate relevance scores (0-1 scale)
    const maxCount = sortedWords.length > 0 ? sortedWords[0][1] : 0;

    return sortedWords.map(([keyword, count]) => ({
      keyword,
      relevance: maxCount > 0 ? count / maxCount : 0,
    }));
  }

  /**
   * Persist data to localStorage
   */
  private persistData(): void {
    if (typeof window === "undefined") return;

    try {
      const data = {
        sources: Object.fromEntries(this.sources),
        reviews: Object.fromEntries(this.reviews),
        responses: Object.fromEntries(this.responses),
        templates: Object.fromEntries(this.templates),
        competitors: Object.fromEntries(this.competitors),
        metrics: Object.fromEntries(this.metrics),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to persist reputation data to storage:", error);
    }
  }
}

// Export a singleton instance
export const reputationManager = new ReputationManager();
