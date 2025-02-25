import { messaging } from "@/lib/messaging";
import { nlp } from "@/lib/ai/nlp";

describe("Backend Load Tests", () => {
  test("handles high message throughput", async () => {
    const messages = Array(1000)
      .fill(null)
      .map((_, i) => ({
        id: `msg-${i}`,
        text: `Test message ${i}`,
      }));

    const start = Date.now();
    await Promise.all(
      messages.map((msg) => messaging.publish("test-channel", msg)),
    );
    const end = Date.now();

    const timePerMessage = (end - start) / messages.length;
    expect(timePerMessage).toBeLessThan(10); // Less than 10ms per message
  });

  test("handles concurrent NLP requests", async () => {
    const queries = Array(100)
      .fill(null)
      .map((_, i) => `Test query ${i} for intent classification`);

    const start = Date.now();
    await Promise.all(queries.map((query) => nlp.classifyIntent(query)));
    const end = Date.now();

    const timePerQuery = (end - start) / queries.length;
    expect(timePerQuery).toBeLessThan(100); // Less than 100ms per query
  });
});
