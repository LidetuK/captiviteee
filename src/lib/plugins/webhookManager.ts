interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret?: string;
  enabled: boolean;
  lastTriggered?: Date;
  failureCount: number;
}

export const webhookManager = {
  webhooks: new Map<string, Webhook>(),

  register: (webhook: Omit<Webhook, "id" | "enabled" | "failureCount">) => {
    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      ...webhook,
      enabled: true,
      failureCount: 0,
    };

    webhookManager.webhooks.set(newWebhook.id, newWebhook);
    return newWebhook;
  },

  trigger: async (event: string, payload: any) => {
    const results = [];
    for (const webhook of webhookManager.webhooks.values()) {
      if (!webhook.enabled || !webhook.events.includes(event)) continue;

      try {
        const result = await sendWebhook(webhook, event, payload);
        webhook.lastTriggered = new Date();
        webhook.failureCount = 0;
        results.push({ webhookId: webhook.id, success: true, result });
      } catch (error) {
        webhook.failureCount++;
        if (webhook.failureCount > 3) {
          webhook.enabled = false;
        }
        results.push({
          webhookId: webhook.id,
          success: false,
          error: (error as Error).message,
        });
      }
    }
    return results;
  },

  getWebhook: (webhookId: string) => {
    return webhookManager.webhooks.get(webhookId);
  },

  listWebhooks: () => {
    return Array.from(webhookManager.webhooks.values());
  },
};

const sendWebhook = async (webhook: Webhook, event: string, payload: any) => {
  const response = await fetch(webhook.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Event": event,
      ...(webhook.secret && {
        "X-Webhook-Signature": generateSignature(payload, webhook.secret),
      }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }

  return await response.json();
};

const generateSignature = (_payload: any, secret: string) => {
  // Implement signature generation
  return "signature";
};
