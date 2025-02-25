interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: any;
  timestamp: Date;
  status: "pending" | "sent" | "failed";
}

export const pushManager = {
  notifications: new Map<string, PushNotification[]>(),

  send: async (
    userId: string,
    notification: Omit<PushNotification, "id" | "timestamp" | "status">,
  ) => {
    const newNotification: PushNotification = {
      id: crypto.randomUUID(),
      ...notification,
      timestamp: new Date(),
      status: "pending",
    };

    // Store notification
    const userNotifications = pushManager.notifications.get(userId) || [];
    userNotifications.push(newNotification);
    pushManager.notifications.set(userId, userNotifications);

    // Send notification
    try {
      // Implement actual push notification sending
      newNotification.status = "sent";
      return newNotification;
    } catch (error) {
      newNotification.status = "failed";
      throw error;
    }
  },

  getNotifications: (userId: string) => {
    return pushManager.notifications.get(userId) || [];
  },

  markAsRead: (userId: string, notificationId: string) => {
    const notifications = pushManager.notifications.get(userId) || [];
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.status = "sent";
    }
    return notification;
  },
};
