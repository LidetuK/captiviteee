export const CHANNELS = {
  CHAT: "chat",
  NOTIFICATIONS: "notifications",
  APPOINTMENTS: "appointments",
  REVIEWS: "reviews",
} as const;

export const QUEUES = {
  EMAIL: "email_queue",
  SMS: "sms_queue",
  TASKS: "task_queue",
} as const;

export const EVENTS = {
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",
  APPOINTMENT_CREATED: "appointment.created",
  APPOINTMENT_UPDATED: "appointment.updated",
  REVIEW_RECEIVED: "review.received",
  MESSAGE_RECEIVED: "message.received",
} as const;
