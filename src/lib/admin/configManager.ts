interface SystemConfig {
  id: string;
  key: string;
  value: any;
  environment: string;
  description?: string;
  lastUpdated: Date;
}

export const configManager = {
  configs: new Map<string, SystemConfig>(),

  setConfig: async (
    key: string,
    value: any,
    environment: string = "default",
  ) => {
    const config: SystemConfig = {
      id: crypto.randomUUID(),
      key,
      value,
      environment,
      lastUpdated: new Date(),
    };

    configManager.configs.set(key, config);
    return config;
  },

  getConfig: (key: string) => {
    return configManager.configs.get(key);
  },

  listConfigs: (environment?: string) => {
    let configs = Array.from(configManager.configs.values());
    if (environment) {
      configs = configs.filter((c) => c.environment === environment);
    }
    return configs;
  },

  deleteConfig: (key: string) => {
    return configManager.configs.delete(key);
  },

  validateConfig: (config: SystemConfig) => {
    // Add validation logic
    return true;
  },
};
