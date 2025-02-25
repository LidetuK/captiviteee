import { Router } from "express";
import { accessControl } from "@/lib/security/access";
import { auditLogger } from "@/lib/security/audit";

interface WebhookRequest {
  url: string;
  events: string[];
  secret: string;
}

const router = Router();

const registerHandler = async (req: any, res: any) => {
  const { url, events, secret } = req.body as Partial<WebhookRequest>;
  const userId = (req as any).user?.id as string | undefined;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!url || !events || !secret) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const hasPermission = await accessControl.checkPermission(
      userId,
      "webhook:register",
      {
        id: userId,
        type: "webhook",
        ownerId: userId,
      },
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const webhook = {
      id: crypto.randomUUID(),
      url,
      events,
      secret,
      userId,
      createdAt: new Date(),
    };

    await auditLogger.log({
      userId,
      action: "webhook:register",
      resource: "webhook",
      details: { webhookId: webhook.id },
    });

    return res.json(webhook);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Webhook registration error:", error.message);
      return res.status(500).json({ error: "Failed to register webhook" });
    }
    console.error("Webhook registration error:", error);
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

router.post("/register", registerHandler);

export default router;
