interface Plugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  hooks: Record<string, Function[]>;
  enabled: boolean;
}

export const pluginManager = {
  plugins: new Map<string, Plugin>(),

  register: (plugin: Omit<Plugin, "id" | "hooks" | "enabled">) => {
    const newPlugin: Plugin = {
      id: crypto.randomUUID(),
      ...plugin,
      hooks: {},
      enabled: true,
    };

    pluginManager.plugins.set(newPlugin.id, newPlugin);
    return newPlugin;
  },

  addHook: (pluginId: string, hookName: string, callback: Function) => {
    const plugin = pluginManager.plugins.get(pluginId);
    if (!plugin) throw new Error("Plugin not found");

    if (!plugin.hooks[hookName]) {
      plugin.hooks[hookName] = [];
    }
    plugin.hooks[hookName].push(callback);
  },

  executeHook: async (hookName: string, context: any) => {
    const results = [];
    for (const plugin of pluginManager.plugins.values()) {
      if (!plugin.enabled) continue;
      const hooks = plugin.hooks[hookName] || [];
      for (const hook of hooks) {
        try {
          const result = await hook(context);
          results.push({ pluginId: plugin.id, result });
        } catch (error) {
          console.error(
            `Error executing hook ${hookName} for plugin ${plugin.id}:`,
            error,
          );
        }
      }
    }
    return results;
  },

  enablePlugin: (pluginId: string) => {
    const plugin = pluginManager.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
      return true;
    }
    return false;
  },

  disablePlugin: (pluginId: string) => {
    const plugin = pluginManager.plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = false;
      return true;
    }
    return false;
  },
};
