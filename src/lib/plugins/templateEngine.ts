interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  type: "email" | "notification" | "document";
}

export const templateEngine = {
  templates: new Map<string, Template>(),

  createTemplate: (template: Omit<Template, "id">) => {
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      ...template,
    };

    templateEngine.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  },

  render: (templateId: string, variables: Record<string, any>) => {
    const template = templateEngine.templates.get(templateId);
    if (!template) throw new Error("Template not found");

    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`{{${key}}}`, "g"), String(value));
    }

    return content;
  },

  validateTemplate: (template: Template) => {
    const variables = extractVariables(template.content);
    const undeclaredVariables = variables.filter(
      (v) => !template.variables.includes(v),
    );

    if (undeclaredVariables.length > 0) {
      throw new Error(
        `Undeclared variables: ${undeclaredVariables.join(", ")}`,
      );
    }

    return true;
  },
};

const extractVariables = (content: string): string[] => {
  const matches = content.match(/{{([^}]+)}}/g) || [];
  return matches.map((match) => match.slice(2, -2).trim());
};
