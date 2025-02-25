interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rules?: {
    type: "user" | "group" | "percentage" | "environment";
    value: any;
  }[];
  rolloutPercentage?: number;
  metadata?: Record<string, any>;
}

export const featureManager = {
  flags: new Map<string, FeatureFlag>(),
  userOverrides: new Map<string, Set<string>>(),

  createFlag: (flag: Omit<FeatureFlag, "id">) => {
    const newFlag: FeatureFlag = {
      id: crypto.randomUUID(),
      ...flag,
    };

    featureManager.flags.set(newFlag.name, newFlag);
    return newFlag;
  },

  isEnabled: (
    flagName: string,
    context?: {
      userId?: string;
      groups?: string[];
      environment?: string;
    },
  ) => {
    const flag = featureManager.flags.get(flagName);
    if (!flag) return false;

    // Check if feature is globally enabled
    if (!flag.enabled) return false;

    // Check user overrides
    if (context?.userId) {
      const userOverrides = featureManager.userOverrides.get(context.userId);
      if (userOverrides?.has(flagName)) return true;
    }

    // Check rules
    if (flag.rules) {
      for (const rule of flag.rules) {
        switch (rule.type) {
          case "user":
            if (context?.userId === rule.value) return true;
            break;
          case "group":
            if (context?.groups?.includes(rule.value)) return true;
            break;
          case "environment":
            if (context?.environment === rule.value) return true;
            break;
          case "percentage":
            if (context?.userId) {
              const hash = hashString(`${flagName}:${context.userId}`);
              if (hash % 100 < flag.rolloutPercentage!) return true;
            }
            break;
        }
      }
    }

    return false;
  },

  enableFlag: (flagName: string) => {
    const flag = featureManager.flags.get(flagName);
    if (flag) {
      flag.enabled = true;
      return flag;
    }
    return null;
  },

  disableFlag: (flagName: string) => {
    const flag = featureManager.flags.get(flagName);
    if (flag) {
      flag.enabled = false;
      return flag;
    }
    return null;
  },

  setRolloutPercentage: (flagName: string, percentage: number) => {
    const flag = featureManager.flags.get(flagName);
    if (flag) {
      flag.rolloutPercentage = Math.max(0, Math.min(100, percentage));
      return flag;
    }
    return null;
  },

  addUserOverride: (userId: string, flagName: string) => {
    if (!featureManager.userOverrides.has(userId)) {
      featureManager.userOverrides.set(userId, new Set());
    }
    featureManager.userOverrides.get(userId)?.add(flagName);
  },

  removeUserOverride: (userId: string, flagName: string) => {
    featureManager.userOverrides.get(userId)?.delete(flagName);
  },
};

// Helper function to generate a deterministic hash
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};
