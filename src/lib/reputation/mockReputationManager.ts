import {
  Review,
  ReviewSource,
  ReputationMetrics,
  Competitor,
  ResponseTemplate,
  ReputationManager,
  ReviewResponse,
} from "@/types/reputation";

// Create a more robust mock implementation of the ReputationManager
export class MockReputationManager implements ReputationManager {
  private reviews: Review[] = [];
  private sources: ReviewSource[] = [];
  private competitors: Competitor[] = [];
  private templates: ResponseTemplate[] = [];
  private metrics: ReputationMetrics[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add sources
    this.addSource({
      id: "source_google",
      name: "Google Business",
      type: "google",
      url: "https://business.google.com/dashboard",
      enabled: true,
      syncFrequency: "daily",
      credentials: {
        apiKey: "mock-api-key",
      },
    });

    this.addSource({
      id: "source_yelp",
      name: "Yelp",
      type: "yelp",
      url: "https://biz.yelp.com",
      enabled: true,
      syncFrequency: "daily",
    });

    this.addSource({
      id: "source_facebook",
      name: "Facebook",
      type: "facebook",
      url: "https://facebook.com/business",
      enabled: true,
      syncFrequency: "weekly",
    });

    // Add reviews
    const reviewsData = [
      {
        id: "review_1",
        sourceId: "source_google",
        sourceName: "Google Business",
        authorName: "John Smith",
        content: "Excellent service! The team was very professional and responsive to all my needs. Would definitely recommend to anyone looking for quality service.",
        rating: 5,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "new" as const,
      },
      {
        id: "review_2",
        sourceId: "source_yelp",
        sourceName: "Yelp",
        authorName: "Sarah Johnson",
        content: "Great experience overall. The staff was friendly and helpful. Would recommend to others looking for quality service.",
        rating: 4,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "new" as const,
      },
      {
        id: "review_3",
        sourceId: "source_google",
        sourceName: "Google Business",
        authorName: "Michael Brown",
        content: "Service was slower than expected. Had to follow up multiple times to get a response. Not very impressed with the communication.",
        rating: 2,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "flagged" as const,
      },
    ];

    reviewsData.forEach((review) => this.addReview(review));

    // Add competitors
    this.addCompetitor({
      id: "competitor_1",
      name: "Competitor A",
      sources: [
        {
          sourceType: "google",
          url: "https://business.google.com/competitor-a",
          name: "Google Business",
        },
        {
          sourceType: "yelp",
          url: "https://yelp.com/biz/competitor-a",
          name: "Yelp",
        },
      ],
    });

    // Add response templates
    this.addTemplate({
      name: "Positive Review Response",
      content: "Thank you for your kind words, {{name}}! We're thrilled to hear about your positive experience and look forward to serving you again soon.",
      category: "positive",
      sentiment: "positive",
      tags: ["positive", "thank you", "appreciation"],
      createdBy: "system",
    });

    this.addTemplate({
      name: "Negative Review Response",
      content: "We're sorry to hear about your experience, {{name}}. We take your feedback seriously and would like to make things right. Please contact our customer service team at support@example.com so we can address your concerns directly.",
      category: "negative",
      sentiment: "negative",
      tags: ["negative", "apology", "customer service"],
      createdBy: "system",
    });

    // Generate initial metrics
    this.generateMetrics("monthly", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
  }

  // Reviews methods
  getAllReviews(): Review[] {
    return this.reviews;
  }

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
  }): Review[] {
    return this.reviews.filter(review => {
      if (filters.sourceId && review.sourceId !== filters.sourceId) return false;
      if (filters.minRating && review.rating < filters.minRating) return false;
      if (filters.maxRating && review.rating > filters.maxRating) return false;
      if (filters.status && review.status !== filters.status) return false;
      if (filters.startDate && review.publishedAt < filters.startDate) return false;
      if (filters.endDate && review.publishedAt > filters.endDate) return false;
      if (filters.sentiment && review.sentiment?.score) {
        const score = review.sentiment.score;
        if (filters.sentiment === "positive" && score <= 0) return false;
        if (filters.sentiment === "negative" && score >= 0) return false;
        if (filters.sentiment === "neutral" && (score < -0.1 || score > 0.1)) return false;
      }
      if (filters.hasResponse !== undefined) {
        if (filters.hasResponse && !review.responseId) return false;
        if (!filters.hasResponse && review.responseId) return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!review.content.toLowerCase().includes(searchLower) &&
            !review.authorName.toLowerCase().includes(searchLower)) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!review.tags?.some(tag => filters.tags!.includes(tag))) return false;
      }
      if (filters.assignedTo && review.assignedTo !== filters.assignedTo) return false;
      return true;
    });
  }

  getReview(id: string): Review | undefined {
    return this.reviews.find(review => review.id === id);
  }

  async addReview(review: Omit<Review, "sentiment" | "keywords">): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `review_${Date.now()}`,
      sentiment: {
        score: 0,
        magnitude: 0,
      },
      keywords: [],
    };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReview(id: string, updates: Partial<Omit<Review, "id" | "sourceId" | "sourceName" | "publishedAt">>): Promise<Review | undefined> {
    const index = this.reviews.findIndex(review => review.id === id);
    if (index !== -1) {
      this.reviews[index] = { ...this.reviews[index], ...updates };
      return this.reviews[index];
    }
    return undefined;
  }

  async deleteReview(id: string): Promise<boolean> {
    const index = this.reviews.findIndex(review => review.id === id);
    if (index !== -1) {
      this.reviews.splice(index, 1);
      return true;
    }
    return false;
  }

  async createResponse(response: Omit<ReviewResponse, "id" | "createdAt" | "sentiment">): Promise<ReviewResponse> {
    const newResponse: ReviewResponse = {
      ...response,
      id: `response_${Date.now()}`,
      createdAt: new Date(),
      sentiment: 0,
    };
    return newResponse;
  }

  // Sources methods
  getAllSources(): ReviewSource[] {
    return this.sources;
  }

  getSource(id: string): ReviewSource | undefined {
    return this.sources.find(source => source.id === id);
  }

  async addSource(source: Omit<ReviewSource, "lastSyncTime">): Promise<ReviewSource> {
    const newSource: ReviewSource = {
      ...source,
      id: `source_${Date.now()}`,
      lastSyncTime: new Date(),
    };
    this.sources.push(newSource);
    return newSource;
  }

  async updateSource(id: string, updates: Partial<Omit<ReviewSource, "id">>): Promise<ReviewSource | undefined> {
    const index = this.sources.findIndex(source => source.id === id);
    if (index !== -1) {
      this.sources[index] = { ...this.sources[index], ...updates };
      return this.sources[index];
    }
    return undefined;
  }

  async deleteSource(id: string): Promise<boolean> {
    const index = this.sources.findIndex(source => source.id === id);
    if (index !== -1) {
      this.sources.splice(index, 1);
      return true;
    }
    return false;
  }

  // Competitors methods
  getAllCompetitors(): Competitor[] {
    return this.competitors;
  }

  getCompetitor(id: string): Competitor | undefined {
    return this.competitors.find(competitor => competitor.id === id);
  }

  async addCompetitor(competitor: Omit<Competitor, "averageRating" | "totalReviews" | "lastUpdated">): Promise<Competitor> {
    const newCompetitor: Competitor = {
      ...competitor,
      id: `competitor_${Date.now()}`,
      averageRating: 0,
      totalReviews: 0,
      lastUpdated: new Date(),
    };
    this.competitors.push(newCompetitor);
    return newCompetitor;
  }

  async updateCompetitor(id: string, updates: Partial<Omit<Competitor, "id">>): Promise<Competitor | undefined> {
    const index = this.competitors.findIndex(competitor => competitor.id === id);
    if (index !== -1) {
      this.competitors[index] = { ...this.competitors[index], ...updates };
      return this.competitors[index];
    }
    return undefined;
  }

  async deleteCompetitor(id: string): Promise<boolean> {
    const index = this.competitors.findIndex(competitor => competitor.id === id);
    if (index !== -1) {
      this.competitors.splice(index, 1);
      return true;
    }
    return false;
  }

  // Templates methods
  getAllTemplates(): ResponseTemplate[] {
    return this.templates;
  }

  getTemplate(id: string): ResponseTemplate | undefined {
    return this.templates.find(template => template.id === id);
  }

  async addTemplate(template: Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">): Promise<ResponseTemplate> {
    const newTemplate: ResponseTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      successRate: 0,
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">>): Promise<ResponseTemplate | undefined> {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.templates[index] = {
        ...this.templates[index],
        ...updates,
        updatedAt: new Date(),
      };
      return this.templates[index];
    }
    return undefined;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const index = this.templates.findIndex(template => template.id === id);
    if (index !== -1) {
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  // Metrics methods
  async generateMetrics(period: ReputationMetrics["period"], startDate: Date, endDate: Date): Promise<ReputationMetrics> {
    const reviewsInPeriod = this.reviews.filter(review => 
      review.publishedAt >= startDate && review.publishedAt <= endDate
    );

    const metrics: ReputationMetrics = {
      id: `metrics_${Date.now()}`,
      period,
      startDate,
      endDate,
      metrics: {
        averageRating: reviewsInPeriod.reduce((sum, r) => sum + r.rating, 0) / reviewsInPeriod.length || 0,
        totalReviews: reviewsInPeriod.length,
        reviewsBySource: reviewsInPeriod.reduce((acc, review) => {
          acc[review.sourceId] = (acc[review.sourceId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        reviewsByRating: reviewsInPeriod.reduce((acc, review) => {
          acc[review.rating.toString()] = (acc[review.rating.toString()] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        responseRate: reviewsInPeriod.filter(r => r.responseId).length / reviewsInPeriod.length || 0,
        averageResponseTime: 0, // This would require actual response time data
        sentimentScore: reviewsInPeriod.reduce((sum, r) => sum + (r.sentiment?.score || 0), 0) / reviewsInPeriod.length || 0,
        topKeywords: [], // This would require keyword extraction
        ratingTrend: [], // This would require historical data
        volumeTrend: [], // This would require historical data
      },
    };

    this.metrics.push(metrics);
    return metrics;
  }

  getMetrics(metricId: string): ReputationMetrics | undefined {
    return this.metrics.find(metric => metric.id === metricId);
  }

  getAllMetrics(): ReputationMetrics[] {
    return this.metrics;
  }
}

// Create and export an instance of the MockReputationManager
export const mockReputationManager = new MockReputationManager();
