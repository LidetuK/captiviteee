interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  features: string[];
  metadata?: Record<string, any>;
}

export const subscriptionManager = {
  subscriptions: new Map<string, Subscription>(),

  createSubscription: async (userId: string, plan: string) => {
    const subscription: Subscription = {
      id: crypto.randomUUID(),
      userId,
      plan,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      features: [],
    };

    subscriptionManager.subscriptions.set(subscription.id, subscription);
    return subscription;
  },

  updateSubscription: async (
    subscriptionId: string,
    updates: Partial<Subscription>,
  ) => {
    const subscription = subscriptionManager.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");

    const updatedSubscription = { ...subscription, ...updates };
    subscriptionManager.subscriptions.set(subscriptionId, updatedSubscription);
    return updatedSubscription;
  },

  cancelSubscription: async (subscriptionId: string, immediate = false) => {
    const subscription = subscriptionManager.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");

    if (immediate) {
      subscription.status = "canceled";
    } else {
      subscription.cancelAtPeriodEnd = true;
    }

    subscriptionManager.subscriptions.set(subscriptionId, subscription);
    return subscription;
  },

  getSubscription: (subscriptionId: string) => {
    return subscriptionManager.subscriptions.get(subscriptionId);
  },

  getUserSubscriptions: (userId: string) => {
    return Array.from(subscriptionManager.subscriptions.values()).filter(
      (sub) => sub.userId === userId,
    );
  },
};
