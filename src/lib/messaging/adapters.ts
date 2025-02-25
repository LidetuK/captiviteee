import { messaging } from "../messaging";
import { CHANNELS, QUEUES } from "../channels";

interface Message {
  id: string;
  channel: string;
  content: any;
  metadata: {
    timestamp: Date;
    priority?: "high" | "normal" | "low";
    sender?: string;
    recipient?: string;
  };
}

export const adapters = {
  sms: {
    normalize: (rawMessage: any): Message => ({
      id: rawMessage.id || crypto.randomUUID(),
      channel: CHANNELS.CHAT,
      content: {
        text: rawMessage.text,
        phone: rawMessage.from,
      },
      metadata: {
        timestamp: new Date(),
        priority: rawMessage.urgent ? "high" : "normal",
        sender: rawMessage.from,
      },
    }),
    process: async (message: Message) => {
      await messaging.enqueue(QUEUES.SMS, message);
      return message;
    },
  },

  email: {
    normalize: (rawMessage: any): Message => ({
      id: rawMessage.id || crypto.randomUUID(),
      channel: CHANNELS.CHAT,
      content: {
        subject: rawMessage.subject,
        body: rawMessage.body,
        email: rawMessage.from,
      },
      metadata: {
        timestamp: new Date(),
        priority: rawMessage.priority || "normal",
        sender: rawMessage.from,
      },
    }),
    process: async (message: Message) => {
      await messaging.enqueue(QUEUES.EMAIL, message);
      return message;
    },
  },

  chat: {
    normalize: (rawMessage: any): Message => ({
      id: rawMessage.id || crypto.randomUUID(),
      channel: CHANNELS.CHAT,
      content: {
        text: rawMessage.text,
        sessionId: rawMessage.sessionId,
      },
      metadata: {
        timestamp: new Date(),
        priority: rawMessage.priority || "normal",
        sender: rawMessage.userId,
      },
    }),
    process: async (message: Message) => {
      await messaging.publish(CHANNELS.CHAT, message);
      return message;
    },
  },
};
