interface CustomModule {
  id: string;
  name: string;
  type: string;
  code: string;
  config?: Record<string, any>;
  enabled: boolean;
}

export const moduleLoader = {
  modules: new Map<string, CustomModule>(),

  loadModule: async (module: Omit<CustomModule, "id" | "enabled">) => {
    const newModule: CustomModule = {
      id: crypto.randomUUID(),
      ...module,
      enabled: true,
    };

    try {
      // Validate and compile module
      await validateModule(newModule);
      moduleLoader.modules.set(newModule.id, newModule);
      return newModule;
    } catch (error) {
      throw new Error(`Failed to load module: ${error.message}`);
    }
  },

  executeModule: async (moduleId: string, context: any) => {
    const module = moduleLoader.modules.get(moduleId);
    if (!module || !module.enabled) return null;

    try {
      const fn = new Function("context", module.code);
      return await fn(context);
    } catch (error) {
      throw new Error(`Failed to execute module: ${error.message}`);
    }
  },

  unloadModule: (moduleId: string) => {
    return moduleLoader.modules.delete(moduleId);
  },
};

const validateModule = async (module: CustomModule) => {
  // Add validation logic
  return true;
};
