interface UsageRecord {
  id: string;
  userId: string;
  feature: string;
  quantity: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const usageTracker = {
  usage: new Map<string, UsageRecord[]>(),

  trackUsage: async (userId: string, feature: string, quantity: number) => {
    const record: UsageRecord = {
      id: crypto.randomUUID(),
      userId,
      feature,
      quantity,
      timestamp: new Date(),
    };

    if (!usageTracker.usage.has(userId)) {
      usageTracker.usage.set(userId, []);
    }
    usageTracker.usage.get(userId)?.push(record);

    return record;
  },

  getUsage: (
    userId: string,
    feature?: string,
    timeRange?: { start: Date; end: Date },
  ) => {
    const records = usageTracker.usage.get(userId) || [];
    return records.filter((record) => {
      const matchesFeature = !feature || record.feature === feature;
      const inTimeRange =
        !timeRange ||
        (record.timestamp >= timeRange.start &&
          record.timestamp <= timeRange.end);
      return matchesFeature && inTimeRange;
    });
  },

  calculateUsage: (userId: string, feature: string) => {
    const records = usageTracker.getUsage(userId, feature);
    return records.reduce((total, record) => total + record.quantity, 0);
  },
};
