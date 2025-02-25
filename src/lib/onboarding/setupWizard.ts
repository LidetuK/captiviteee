interface SetupStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
  validationFn?: (data: any) => boolean;
}

export const setupWizard = {
  steps: new Map<string, SetupStep[]>(),

  initializeSetup: (organizationId: string) => {
    const defaultSteps: SetupStep[] = [
      {
        id: "profile",
        title: "Organization Profile",
        description: "Set up your organization details",
        component: "ProfileSetup",
        required: true,
        completed: false,
      },
      {
        id: "integrations",
        title: "Connect Integrations",
        description: "Connect your existing tools",
        component: "IntegrationsSetup",
        required: false,
        completed: false,
      },
      {
        id: "team",
        title: "Team Setup",
        description: "Invite your team members",
        component: "TeamSetup",
        required: true,
        completed: false,
      },
      {
        id: "preferences",
        title: "System Preferences",
        description: "Configure system settings",
        component: "PreferencesSetup",
        required: true,
        completed: false,
      },
    ];

    setupWizard.steps.set(organizationId, defaultSteps);
    return defaultSteps;
  },

  getProgress: (organizationId: string) => {
    const steps = setupWizard.steps.get(organizationId) || [];
    const completed = steps.filter((step) => step.completed).length;
    const required = steps.filter((step) => step.required).length;

    return {
      completed,
      total: steps.length,
      requiredCompleted: steps.filter((step) => step.required && step.completed)
        .length,
      requiredTotal: required,
      percentage: (completed / steps.length) * 100,
    };
  },

  completeStep: (organizationId: string, stepId: string, data?: any) => {
    const steps = setupWizard.steps.get(organizationId);
    if (!steps) return null;

    const step = steps.find((s) => s.id === stepId);
    if (!step) return null;

    if (step.validationFn && !step.validationFn(data)) {
      throw new Error("Step validation failed");
    }

    step.completed = true;
    setupWizard.steps.set(organizationId, steps);

    return setupWizard.getProgress(organizationId);
  },

  generateSetupGuide: (organizationId: string) => {
    const steps = setupWizard.steps.get(organizationId) || [];
    return steps.map((step) => ({
      ...step,
      nextSteps: step.completed ? [] : ["Complete " + step.title],
      resources: [`docs/setup/${step.id}`, `videos/setup/${step.id}`],
    }));
  },
};
