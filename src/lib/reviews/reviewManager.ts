import { nlp } from "../ai/nlp";
import { responseGenerator } from "../ai/responseGenerator";

interface Review {
  id: string;
  rating: number;
  text: string;
  source: string;
  sentiment?: number;
  response?: string;
  status: "pending" | "responded" | "flagged";
  createdAt: Date;
  updatedAt: Date;
}

export const reviewManager = {
  analyzeReview: async (review: Review) => {
    // Analyze sentiment
    const sentiment = await nlp.analyzeSentiment(review.text);

    // Determine if review needs immediate attention
    const needsAttention = sentiment < -0.5 || review.rating <= 2;

    return {
      ...review,
      sentiment,
      status: needsAttention ? "flagged" : "pending",
    };
  },

  generateResponse: async (review: Review) => {
    const context = {
      rating: review.rating,
      sentiment: review.sentiment,
      source: review.source,
    };

    const response = await responseGenerator.generateResponse(
      "review_response",
      {
        variables: {
          rating: review.rating.toString(),
          sentiment: review.sentiment?.toString() || "0",
          reviewText: review.text,
        },
        language: "en",
      },
    );

    return {
      ...review,
      response,
      status: "responded",
    };
  },

  aggregateMetrics: (reviews: Review[]) => {
    const metrics = {
      averageRating: 0,
      totalReviews: reviews.length,
      sentimentScore: 0,
      responseRate: 0,
      sourcesBreakdown: {} as Record<string, number>,
    };

    reviews.forEach((review) => {
      metrics.averageRating += review.rating;
      metrics.sentimentScore += review.sentiment || 0;
      metrics.sourcesBreakdown[review.source] =
        (metrics.sourcesBreakdown[review.source] || 0) + 1;
      if (review.status === "responded") metrics.responseRate++;
    });

    metrics.averageRating /= reviews.length;
    metrics.sentimentScore /= reviews.length;
    metrics.responseRate = (metrics.responseRate / reviews.length) * 100;

    return metrics;
  },
};
