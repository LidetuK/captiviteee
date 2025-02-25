import { messaging } from "../messaging";
import { adapters } from "./adapters";
import { nlp } from "../ai/nlp";
import { businessLogic } from "../ai/business-logic";

export const messageProcessor = {
  processMessage: async (channel: string, rawMessage: any) => {
    // 1. Normalize message using channel-specific adapter
    const adapter = adapters[channel];
    if (!adapter) throw new Error(`No adapter found for channel: ${channel}`);

    const normalizedMessage = adapter.normalize(rawMessage);

    // 2. Analyze message priority
    const sentiment = await nlp.analyzeSentiment(
      normalizedMessage.content.text,
    );
    if (sentiment < -0.5) {
      normalizedMessage.metadata.priority = "high";
    }

    // 3. Process through channel adapter
    await adapter.process(normalizedMessage);

    // 4. Generate response
    const response = await businessLogic.handleCustomerQuery(
      normalizedMessage.content.text,
      {
        channel,
        sentiment,
        metadata: normalizedMessage.metadata,
      },
    );

    // 5. Send response back through appropriate channel
    await messaging.emit("MESSAGE_PROCESSED", {
      originalMessage: normalizedMessage,
      response,
    });

    return response;
  },

  handlePriorityQueue: async () => {
    // Process high priority messages first
    const processQueue = async (queue: string) => {
      const message = await messaging.dequeue(queue);
      if (message && message.metadata.priority === "high") {
        await messageProcessor.processMessage(message.channel, message);
      }
    };

    // Process each queue
    await Promise.all([
      processQueue("sms_queue"),
      processQueue("email_queue"),
      processQueue("task_queue"),
    ]);
  },
};
