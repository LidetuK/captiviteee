interface Feedback {
  id: string;
  userId: string;
  type: "bug" | "feature" | "improvement" | "other";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status:
    | "new"
    | "in_review"
    | "planned"
    | "in_progress"
    | "completed"
    | "declined";
  votes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const feedbackManager = {
  feedback: new Map<string, Feedback>(),
  userVotes: new Map<string, Set<string>>(),

  submitFeedback: (
    feedback: Omit<
      Feedback,
      "id" | "votes" | "createdAt" | "updatedAt" | "status"
    >,
  ) => {
    const newFeedback: Feedback = {
      id: crypto.randomUUID(),
      ...feedback,
      votes: 0,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    feedbackManager.feedback.set(newFeedback.id, newFeedback);
    return newFeedback;
  },

  voteFeedback: (feedbackId: string, userId: string) => {
    const feedback = feedbackManager.feedback.get(feedbackId);
    if (!feedback) throw new Error("Feedback not found");

    const userVotes = feedbackManager.userVotes.get(userId) || new Set();

    if (userVotes.has(feedbackId)) {
      userVotes.delete(feedbackId);
      feedback.votes--;
    } else {
      userVotes.add(feedbackId);
      feedback.votes++;
    }

    feedbackManager.userVotes.set(userId, userVotes);
    return feedback;
  },

  updateStatus: (feedbackId: string, status: Feedback["status"]) => {
    const feedback = feedbackManager.feedback.get(feedbackId);
    if (!feedback) throw new Error("Feedback not found");

    feedback.status = status;
    feedback.updatedAt = new Date();
    return feedback;
  },

  getFeedbackSummary: () => {
    const feedback = Array.from(feedbackManager.feedback.values());
    return {
      total: feedback.length,
      byType: feedback.reduce(
        (acc, f) => {
          acc[f.type] = (acc[f.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byStatus: feedback.reduce(
        (acc, f) => {
          acc[f.status] = (acc[f.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      topVoted: feedback.sort((a, b) => b.votes - a.votes).slice(0, 5),
    };
  },

  searchFeedback: (query: {
    type?: string;
    status?: string;
    tags?: string[];
    search?: string;
  }) => {
    return Array.from(feedbackManager.feedback.values()).filter((feedback) => {
      if (query.type && feedback.type !== query.type) return false;
      if (query.status && feedback.status !== query.status) return false;
      if (query.tags && !query.tags.every((tag) => feedback.tags.includes(tag)))
        return false;
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        return (
          feedback.title.toLowerCase().includes(searchLower) ||
          feedback.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  },
};
