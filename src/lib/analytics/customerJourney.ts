interface JourneyEvent {
  id: string;
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export const customerJourney = {
  events: new Map<string, JourneyEvent[]>(),

  trackEvent: async (
    userId: string,
    event: string,
    properties: Record<string, any>,
  ) => {
    const journeyEvent: JourneyEvent = {
      id: crypto.randomUUID(),
      userId,
      event,
      properties,
      timestamp: new Date(),
    };

    if (!customerJourney.events.has(userId)) {
      customerJourney.events.set(userId, []);
    }
    customerJourney.events.get(userId)?.push(journeyEvent);

    return journeyEvent;
  },

  getJourney: (userId: string) => {
    return customerJourney.events.get(userId) || [];
  },

  analyzeFunnel: (steps: string[]) => {
    const funnel = new Map<string, number>();
    steps.forEach((step) => funnel.set(step, 0));

    // Count users at each step
    customerJourney.events.forEach((userEvents) => {
      let lastCompletedStep = -1;
      steps.forEach((step, index) => {
        if (userEvents.some((event) => event.event === step)) {
          funnel.set(step, (funnel.get(step) || 0) + 1);
          lastCompletedStep = index;
        }
      });
    });

    return Array.from(funnel.entries()).map(([step, count]) => ({
      step,
      count,
      conversionRate: count / (funnel.get(steps[0]) || 1),
    }));
  },
};
