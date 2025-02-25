interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  settings: Record<string, any>;
  recommendations: string[];
}

export const configTemplates = {
  templates: new Map<string, ConfigTemplate[]>(),

  createTemplate: (template: Omit<ConfigTemplate, "id">) => {
    const newTemplate: ConfigTemplate = {
      id: crypto.randomUUID(),
      ...template,
    };

    const industryTemplates =
      configTemplates.templates.get(template.industry) || [];
    industryTemplates.push(newTemplate);
    configTemplates.templates.set(template.industry, industryTemplates);

    return newTemplate;
  },

  getTemplatesByIndustry: (industry: string) => {
    return configTemplates.templates.get(industry) || [];
  },

  applyTemplate: async (organizationId: string, templateId: string) => {
    // Find template
    let template: ConfigTemplate | undefined;
    for (const [, templates] of configTemplates.templates) {
      template = templates.find((t) => t.id === templateId);
      if (template) break;
    }

    if (!template) throw new Error("Template not found");

    // Apply template settings
    return {
      organizationId,
      templateId,
      settings: template.settings,
      appliedAt: new Date(),
    };
  },

  generateCustomTemplate: (organizationData: any) => {
    // Generate custom template based on organization data
    return {
      id: crypto.randomUUID(),
      name: "Custom Template",
      description: "Generated based on your organization profile",
      industry: organizationData.industry,
      settings: {
        // Generate settings based on organization data
      },
      recommendations: [
        // Generate recommendations based on organization data
      ],
    };
  },
};
