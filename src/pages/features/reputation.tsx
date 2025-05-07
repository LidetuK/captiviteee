import { FC, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReputationDashboard from "@/components/reputation/ReputationDashboard";
import ReviewTemplatesManager from "@/components/reputation/ReviewTemplatesManager";
import { ResponseTemplate, ReputationManager } from "@/lib/reputation/reputationManager";

const ReputationPage: FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reputationManager, setReputationManager] = useState<ReputationManager | null>(null);
  const [templates, setTemplates] = useState<ResponseTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be imported directly
    // but for demo purposes we're dynamically importing it
    const loadReputationManager = async () => {
      try {
        setIsLoading(true);
        // Import the reputation manager
        const module = await import("@/lib/reputation/reputationManager");

        // Create an instance of the ReputationManager class
        const manager = new module.ReputationManager();
        setReputationManager(manager);

        // Load demo templates
        setTemplates([
          {
            id: "template_1",
            name: "Positive Review Response",
            category: "positive",
            content:
              "Thank you {{customerName}} for your wonderful {{rating}}-star review! We're thrilled to hear about your positive experience with {{businessName}}. Your feedback means a lot to us, and we look forward to serving you again soon!",
            variables: ["customerName", "rating", "businessName"],
            sentiment: "positive",
            tags: ["thank you", "appreciation"],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "system",
            usageCount: 12,
            successRate: 0.95,
          },
          {
            id: "template_2",
            name: "Negative Review Response",
            category: "negative",
            content:
              "Dear {{customerName}}, we sincerely apologize for your disappointing experience. This falls short of the standards we aim to provide. We'd like to learn more about what happened and make things right. Please contact our customer service team at support@example.com so we can address your concerns personally.",
            variables: ["customerName"],
            sentiment: "negative",
            tags: ["apology", "service recovery"],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "system",
            usageCount: 8,
            successRate: 0.6,
          },
          {
            id: "template_3",
            name: "Neutral Review Response",
            category: "neutral",
            content:
              "Hello {{customerName}}, thank you for taking the time to share your feedback. We appreciate your honest review and are always looking for ways to improve. If you have any specific suggestions, please don't hesitate to let us know directly at feedback@example.com.",
            variables: ["customerName"],
            sentiment: "neutral",
            tags: ["feedback", "improvement"],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "system",
            usageCount: 5,
            successRate: 0.8,
          },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading reputation manager:", error);
        setIsLoading(false);
      }
    };

    loadReputationManager();
  }, []);

  const handleAddTemplate = (
    template: Omit<
      ResponseTemplate,
      "id" | "createdAt" | "updatedAt" | "usageCount" | "successRate"
    >,
  ) => {
    const newTemplate: ResponseTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    setTemplates([...templates, newTemplate]);
  };

  const handleUpdateTemplate = (
    id: string,
    updates: Partial<ResponseTemplate>,
  ) => {
    setTemplates(
      templates.map((template) =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date() }
          : template,
      ),
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Reputation Management</h1>
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="templates">Response Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          {reputationManager && (
            <ReputationDashboard />
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <ReviewTemplatesManager
            templates={templates}
            onTemplatesChanged={() => {
              // Refresh templates if needed
            }}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2>Reputation Management Settings</h2>
            <p className="text-lg text-muted-foreground">
              Configure your reputation management preferences, notification
              settings, and API integrations.
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mt-6">
              <h3>API Integration</h3>
              <p>
                Connect your reputation management system with third-party
                services using our API. You can integrate with CRM systems,
                marketing platforms, and business intelligence tools.
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>
                  {`// Example API usage
const client = new CaptiviteAPI({
  apiKey: "your-api-key",
  endpoint: "https://api.captivite.com/v1/reputation"
});

// Fetch reviews
const reviews = await client.getReviews({
  startDate: "2023-01-01",
  endDate: "2023-12-31",
  sources: ["google", "yelp"]
});

// Respond to a review
await client.respondToReview({
  reviewId: "review-123",
  content: "Thank you for your feedback!",
  status: "published"
});`}
                </code>
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReputationPage;
