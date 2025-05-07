import { mockReputationManager } from "./mockReputationManager";
import type {
  Review,
  ReviewSource,
  Competitor,
  ResponseTemplate,
  ReputationMetrics,
  ReviewResponse,
} from "@/types/reputation";

export class ReputationService {
  private manager = mockReputationManager;

  // Reviews
  async getReviews(filters?: {
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
  }): Promise<Review[]> {
    if (filters) {
      return this.manager.getReviews(filters);
    }
    return this.manager.getAllReviews();
  }

  async getReview(id: string): Promise<Review | undefined> {
    return this.manager.getReview(id);
  }

  async addReview(review: Omit<Review, "sentiment" | "keywords">): Promise<Review> {
    return this.manager.addReview(review);
  }

  async updateReview(id: string, updates: Partial<Omit<Review, "id" | "sourceId" | "sourceName" | "publishedAt">>): Promise<Review | undefined> {
    return this.manager.updateReview(id, updates);
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.manager.deleteReview(id);
  }

  async createResponse(response: Omit<ReviewResponse, "id" | "createdAt" | "sentiment">): Promise<ReviewResponse> {
    return this.manager.createResponse(response);
  }

  // Sources
  async getSources(): Promise<ReviewSource[]> {
    return this.manager.getAllSources();
  }

  async getSource(id: string): Promise<ReviewSource | undefined> {
    return this.manager.getSource(id);
  }

  async addSource(source: Omit<ReviewSource, "lastSyncTime">): Promise<ReviewSource> {
    return this.manager.addSource(source);
  }

  async updateSource(id: string, updates: Partial<Omit<ReviewSource, "id">>): Promise<ReviewSource | undefined> {
    return this.manager.updateSource(id, updates);
  }

  async deleteSource(id: string): Promise<boolean> {
    return this.manager.deleteSource(id);
  }

  // Competitors
  async getCompetitors(): Promise<Competitor[]> {
    return this.manager.getAllCompetitors();
  }

  async getCompetitor(id: string): Promise<Competitor | undefined> {
    return this.manager.getCompetitor(id);
  }

  async addCompetitor(competitor: Omit<Competitor, "averageRating" | "totalReviews" | "lastUpdated">): Promise<Competitor> {
    return this.manager.addCompetitor(competitor);
  }

  async updateCompetitor(id: string, updates: Partial<Omit<Competitor, "id">>): Promise<Competitor | undefined> {
    return this.manager.updateCompetitor(id, updates);
  }

  async deleteCompetitor(id: string): Promise<boolean> {
    return this.manager.deleteCompetitor(id);
  }

  // Templates
  async getTemplates(): Promise<ResponseTemplate[]> {
    return this.manager.getAllTemplates();
  }

  async getTemplate(id: string): Promise<ResponseTemplate | undefined> {
    return this.manager.getTemplate(id);
  }

  async addTemplate(template: Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">): Promise<ResponseTemplate> {
    return this.manager.addTemplate(template);
  }

  async updateTemplate(id: string, updates: Partial<Omit<ResponseTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate">>): Promise<ResponseTemplate | undefined> {
    return this.manager.updateTemplate(id, updates);
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.manager.deleteTemplate(id);
  }

  // Metrics
  async generateMetrics(period: ReputationMetrics["period"], startDate: Date, endDate: Date): Promise<ReputationMetrics> {
    return this.manager.generateMetrics(period, startDate, endDate);
  }

  async getMetrics(metricId: string): Promise<ReputationMetrics | undefined> {
    return this.manager.getMetrics(metricId);
  }

  async getAllMetrics(): Promise<ReputationMetrics[]> {
    return this.manager.getAllMetrics();
  }
}

// Create and export a singleton instance
export const reputationService = new ReputationService(); 