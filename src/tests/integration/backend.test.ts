import { messaging } from "@/lib/messaging";
import { nlp } from "@/lib/ai/nlp";
import { businessLogic } from "@/lib/ai/business-logic";
import { abTestManager } from "@/lib/innovation/abTesting";
import { featureManager } from "@/lib/innovation/featureFlags";
import { betaManager } from "@/lib/innovation/betaTesting";

describe("Backend Integration Tests", () => {
  describe("Messaging System", () => {
    test("publishes and subscribes to channels", async () => {
      const message = { text: "Test message" };
      const received: any[] = [];

      await messaging.subscribe("test-channel", (msg) => {
        received.push(msg);
      });

      await messaging.publish("test-channel", message);
      expect(received).toContainEqual(message);
    });

    test("handles queue operations", async () => {
      const message = { text: "Test queue message" };
      await messaging.enqueue("test-queue", message);
      const received = await messaging.dequeue("test-queue");
      expect(received).toEqual(message);
    });
  });

  describe("AI/NLP System", () => {
    test("classifies intent", async () => {
      const text = "I want to schedule an appointment";
      const intent = await nlp.classifyIntent(text);
      expect(intent).toBeDefined();
    });

    test("extracts entities", async () => {
      const text = "Schedule a meeting tomorrow at 2pm";
      const entities = await nlp.extractEntities(text);
      expect(entities).toBeDefined();
    });

    test("handles customer queries", async () => {
      const query = "What are your business hours?";
      const response = await businessLogic.handleCustomerQuery(query, {});
      expect(response).toBeDefined();
    });
  });

  describe("Innovation Systems", () => {
    test("manages A/B tests", async () => {
      const experiment = abTestManager.createExperiment({
        name: "Test Experiment",
        description: "Testing feature variants",
        variants: [
          { id: "A", name: "Control", weight: 0.5, config: {} },
          { id: "B", name: "Test", weight: 0.5, config: {} },
        ],
        metrics: ["conversion", "engagement"],
        startDate: new Date(),
      });

      const variant = abTestManager.assignVariant(experiment.id, "user123");
      expect(variant).toBeDefined();
    });

    test("manages feature flags", () => {
      const flag = featureManager.createFlag({
        name: "new-feature",
        description: "Test feature",
        enabled: true,
      });

      const isEnabled = featureManager.isEnabled("new-feature", {
        userId: "user123",
        environment: "test",
      });
      expect(isEnabled).toBeDefined();
    });

    test("manages beta testing", async () => {
      const program = betaManager.createProgram({
        name: "Beta Test",
        description: "Testing new features",
        features: ["feature1", "feature2"],
        startDate: new Date(),
        maxParticipants: 100,
      });

      await betaManager.addParticipant(program.id, "user123");
      const feedback = await betaManager.submitFeedback(program.id, "user123", {
        feature: "feature1",
        rating: 5,
        comment: "Great feature!",
      });

      expect(feedback).toBeDefined();
    });
  });
});
