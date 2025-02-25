import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));

export const messaging = {
  publish: async (channel: string, message: any) => {
    await client.connect();
    await client.publish(channel, JSON.stringify(message));
    await client.disconnect();
  },

  subscribe: async (channel: string, callback: (message: any) => void) => {
    const subscriber = client.duplicate();
    await subscriber.connect();

    await subscriber.subscribe(channel, (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    return () => {
      subscriber.unsubscribe(channel);
      subscriber.disconnect();
    };
  },

  // Queue management
  enqueue: async (queue: string, message: any) => {
    await client.connect();
    await client.lPush(queue, JSON.stringify(message));
    await client.disconnect();
  },

  dequeue: async (queue: string) => {
    await client.connect();
    const message = await client.rPop(queue);
    await client.disconnect();
    return message ? JSON.parse(message) : null;
  },

  // Event handling
  emit: async (event: string, data: any) => {
    await messaging.publish("events", { event, data });
  },

  onEvent: async (event: string, handler: (data: any) => void) => {
    return messaging.subscribe("events", (message) => {
      if (message.event === event) {
        handler(message.data);
      }
    });
  },
};
