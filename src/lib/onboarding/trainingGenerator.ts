interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  prerequisites?: string[];
  resources: string[];
}

export const trainingGenerator = {
  modules: new Map<string, TrainingModule[]>(),

  generateTrainingPath: (userRole: string, experience: string) => {
    const modules = trainingGenerator.modules.get(userRole) || [];
    const difficulty =
      experience === "expert"
        ? "advanced"
        : experience === "intermediate"
          ? "intermediate"
          : "beginner";

    return modules
      .filter((module) => module.difficulty === difficulty)
      .sort((a, b) => {
        // Sort by prerequisites
        if (a.prerequisites?.length && !b.prerequisites?.length) return 1;
        if (!a.prerequisites?.length && b.prerequisites?.length) return -1;
        return 0;
      });
  },

  createModule: (module: Omit<TrainingModule, "id">) => {
    const newModule: TrainingModule = {
      id: crypto.randomUUID(),
      ...module,
    };

    const roleModules = trainingGenerator.modules.get(module.title) || [];
    roleModules.push(newModule);
    trainingGenerator.modules.set(module.title, roleModules);

    return newModule;
  },

  generateQuiz: (moduleId: string) => {
    // Find module
    let module: TrainingModule | undefined;
    for (const [, modules] of trainingGenerator.modules) {
      module = modules.find((m) => m.id === moduleId);
      if (module) break;
    }

    if (!module) return null;

    // Generate quiz questions based on module content
    return {
      moduleId,
      questions: [
        {
          question: `What is the main purpose of ${module.title}?`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 0,
        },
        // Add more questions based on content
      ],
    };
  },

  trackProgress: (userId: string, moduleId: string, progress: number) => {
    // Track user's progress through training modules
    return { userId, moduleId, progress, timestamp: new Date() };
  },
};
