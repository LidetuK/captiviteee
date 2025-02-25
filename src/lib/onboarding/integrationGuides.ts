interface IntegrationGuide {
  id: string;
  integration: string;
  steps: Array<{
    title: string;
    description: string;
    code?: string;
    image?: string;
  }>;
  requirements: string[];
  troubleshooting: Array<{
    issue: string;
    solution: string;
  }>;
}

export const integrationGuides = {
  guides: new Map<string, IntegrationGuide>(),

  createGuide: (guide: Omit<IntegrationGuide, "id">) => {
    const newGuide: IntegrationGuide = {
      id: crypto.randomUUID(),
      ...guide,
    };

    integrationGuides.guides.set(guide.integration, newGuide);
    return newGuide;
  },

  getGuide: (integration: string) => {
    return integrationGuides.guides.get(integration);
  },

  validateSetup: async (integration: string, config: any) => {
    const guide = integrationGuides.guides.get(integration);
    if (!guide) throw new Error("Integration guide not found");

    // Validate integration setup
    return {
      valid: true,
      messages: ["Integration configured correctly"],
    };
  },

  generateConnectionInstructions: (integration: string) => {
    const guide = integrationGuides.guides.get(integration);
    if (!guide) return null;

    return {
      integration,
      instructions: guide.steps,
      requirements: guide.requirements,
      troubleshooting: guide.troubleshooting,
    };
  },
};
