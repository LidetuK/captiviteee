import {
  responseTemplates,
  ResponseTemplate,
} from "./templates/responseTemplates";

interface ResponseContext {
  language?: string;
  category?: string;
  variables: Record<string, string>;
  userPreferences?: Record<string, any>;
}

export const responseGenerator = {
  generateResponse: (templateId: string, context: ResponseContext): string => {
    const template = responseTemplates.find(
      (t) =>
        t.id === templateId &&
        (context.language ? t.language === context.language : true),
    );

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    return responseGenerator.personalizeContent(template, context);
  },

  personalizeContent: (
    template: ResponseTemplate,
    context: ResponseContext,
  ): string => {
    let content = template.content;

    // Replace variables
    template.variables.forEach((variable) => {
      const value = context.variables[variable] || `[${variable}]`;
      content = content.replace(new RegExp(`{{${variable}}}`, "g"), value);
    });

    // Apply user preferences
    if (context.userPreferences?.formality === "formal") {
      content = content.replace(/Hi/g, "Dear");
      content = content.replace(/Hey/g, "Dear");
    }

    return content;
  },

  getAvailableTemplates: (
    category?: string,
    language?: string,
  ): ResponseTemplate[] => {
    return responseTemplates.filter(
      (template) =>
        (!category || template.category === category) &&
        (!language || template.language === language),
    );
  },
};
