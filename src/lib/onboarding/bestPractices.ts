interface BestPractice {
  id: string;
  category: string;
  title: string;
  description: string;
  importance: "critical" | "recommended" | "optional";
  implementation: string;
  examples: string[];
  benefits: string[];
}

export const bestPractices = {
  practices: new Map<string, BestPractice[]>(),

  addPractice: (practice: Omit<BestPractice, "id">) => {
    const newPractice: BestPractice = {
      id: crypto.randomUUID(),
      ...practice,
    };

    const categoryPractices =
      bestPractices.practices.get(practice.category) || [];
    categoryPractices.push(newPractice);
    bestPractices.practices.set(practice.category, categoryPractices);

    return newPractice;
  },

  getPracticesByCategory: (category: string) => {
    return bestPractices.practices.get(category) || [];
  },

  generateChecklist: (categories: string[]) => {
    const checklist: Array<{
      category: string;
      items: Array<{
        title: string;
        importance: string;
        completed: boolean;
      }>;
    }> = [];

    categories.forEach((category) => {
      const practices = bestPractices.practices.get(category) || [];
      checklist.push({
        category,
        items: practices.map((practice) => ({
          title: practice.title,
          importance: practice.importance,
          completed: false,
        })),
      });
    });

    return checklist;
  },

  validateImplementation: (practiceId: string, implementation: any) => {
    // Find practice
    let practice: BestPractice | undefined;
    for (const [, practices] of bestPractices.practices) {
      practice = practices.find((p) => p.id === practiceId);
      if (practice) break;
    }

    if (!practice) return false;

    // Validate implementation
    return true;
  },
};
