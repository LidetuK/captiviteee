interface BetaProgram {
  id: string;
  name: string;
  description: string;
  features: string[];
  startDate: Date;
  endDate?: Date;
  maxParticipants: number;
  status: "draft" | "active" | "completed";
}

interface BetaParticipant {
  userId: string;
  programId: string;
  joinDate: Date;
  status: "active" | "inactive";
  feedback: Array<{
    feature: string;
    rating: number;
    comment: string;
    timestamp: Date;
  }>;
}

export const betaManager = {
  programs: new Map<string, BetaProgram>(),
  participants: new Map<string, BetaParticipant[]>(),

  createProgram: (program: Omit<BetaProgram, "id" | "status">) => {
    const newProgram: BetaProgram = {
      id: crypto.randomUUID(),
      ...program,
      status: "draft",
    };

    betaManager.programs.set(newProgram.id, newProgram);
    return newProgram;
  },

  startProgram: (programId: string) => {
    const program = betaManager.programs.get(programId);
    if (!program) throw new Error("Program not found");

    program.status = "active";
    program.startDate = new Date();
    return program;
  },

  addParticipant: (programId: string, userId: string) => {
    const program = betaManager.programs.get(programId);
    if (!program) throw new Error("Program not found");

    const participant: BetaParticipant = {
      userId,
      programId,
      joinDate: new Date(),
      status: "active",
      feedback: [],
    };

    const participants = betaManager.participants.get(programId) || [];
    if (participants.length >= program.maxParticipants) {
      throw new Error("Program is full");
    }

    participants.push(participant);
    betaManager.participants.set(programId, participants);
    return participant;
  },

  submitFeedback: (
    programId: string,
    userId: string,
    feedback: {
      feature: string;
      rating: number;
      comment: string;
    },
  ) => {
    const participants = betaManager.participants.get(programId) || [];
    const participant = participants.find((p) => p.userId === userId);
    if (!participant) throw new Error("Participant not found");

    participant.feedback.push({
      ...feedback,
      timestamp: new Date(),
    });

    return participant;
  },

  getFeedbackSummary: (programId: string) => {
    const participants = betaManager.participants.get(programId) || [];
    const feedback = participants.flatMap((p) => p.feedback);

    const summary = {};
    feedback.forEach((f) => {
      if (!summary[f.feature]) {
        summary[f.feature] = {
          ratings: [],
          comments: [],
        };
      }
      summary[f.feature].ratings.push(f.rating);
      summary[f.feature].comments.push(f.comment);
    });

    return Object.entries(summary).map(([feature, data]) => ({
      feature,
      averageRating: calculateMean(data.ratings),
      totalFeedback: data.ratings.length,
      comments: data.comments,
    }));
  },

  endProgram: (programId: string) => {
    const program = betaManager.programs.get(programId);
    if (!program) throw new Error("Program not found");

    program.status = "completed";
    program.endDate = new Date();
    return program;
  },
};

// Helper function
const calculateMean = (values: number[]): number => {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};
