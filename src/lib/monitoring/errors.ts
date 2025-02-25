interface ErrorLog {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  stack?: string;
  context?: any;
}

export const errorTracker = {
  errors: new Map<string, ErrorLog[]>(),

  logError: (error: Error, context?: any) => {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type: error.name,
      message: error.message,
      stack: error.stack,
      context,
    };

    const date = errorLog.timestamp.toISOString().split("T")[0];
    if (!errorTracker.errors.has(date)) {
      errorTracker.errors.set(date, []);
    }
    errorTracker.errors.get(date)?.push(errorLog);

    return errorLog;
  },

  getErrors: (startDate?: Date, endDate?: Date) => {
    const errors: ErrorLog[] = [];
    errorTracker.errors.forEach((logs) => {
      errors.push(
        ...logs.filter((log) => {
          if (!startDate && !endDate) return true;
          return (
            (!startDate || log.timestamp >= startDate) &&
            (!endDate || log.timestamp <= endDate)
          );
        }),
      );
    });
    return errors;
  },

  getErrorStats: () => {
    const errors = Array.from(errorTracker.errors.values()).flat();
    return {
      total: errors.length,
      byType: errors.reduce(
        (acc, err) => {
          acc[err.type] = (acc[err.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  },
};
