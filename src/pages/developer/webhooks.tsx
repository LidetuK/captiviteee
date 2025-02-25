import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Webhook, Plus, Trash2 } from "lucide-react";
import { webhookManager } from "@/lib/plugins/webhookManager";

const WebhooksPage = () => {
  const [webhooks, setWebhooks] = useState(webhookManager.listWebhooks());
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [newEvent, setNewEvent] = useState("");

  const handleAddWebhook = async () => {
    if (!url || events.length === 0) return;

    const webhook = webhookManager.register({
      url,
      events,
      secret: crypto.randomUUID(),
    });

    setWebhooks(webhookManager.listWebhooks());
    setUrl("");
    setEvents([]);
  };

  const handleAddEvent = () => {
    if (!newEvent) return;
    setEvents([...events, newEvent]);
    setNewEvent("");
  };

  const handleRemoveEvent = (event: string) => {
    setEvents(events.filter((e) => e !== event));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Webhooks</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Register New Webhook</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Endpoint URL
              </label>
              <Input
                placeholder="https://your-domain.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Events</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Event name"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                />
                <Button onClick={handleAddEvent}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {events.map((event) => (
                  <div
                    key={event}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-2"
                  >
                    <span>{event}</span>
                    <button
                      onClick={() => handleRemoveEvent(event)}
                      className="text-secondary-foreground/50 hover:text-secondary-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddWebhook}
              disabled={!url || events.length === 0}
              className="w-full"
            >
              Register Webhook
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Webhooks</h2>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Webhook className="h-4 w-4 text-primary" />
                      <span className="font-medium">{webhook.url}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded text-sm"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${webhook.enabled ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {webhook.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            {webhooks.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No webhooks registered
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WebhooksPage;
