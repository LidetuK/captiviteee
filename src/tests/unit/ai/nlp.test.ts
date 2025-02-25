import { nlp } from "@/lib/ai/nlp";

describe("NLP Module", () => {
  test("classifies intent", async () => {
    const intent = await nlp.classifyIntent(
      "I want to schedule an appointment",
    );
    expect(intent).toBeDefined();
  });

  test("extracts entities", async () => {
    const entities = await nlp.extractEntities(
      "Schedule a meeting tomorrow at 2pm",
    );
    expect(entities).toHaveProperty("datetime");
  });

  test("analyzes sentiment", async () => {
    const sentiment = await nlp.analyzeSentiment("This is great service!");
    expect(sentiment).toBeGreaterThan(0);
  });
});
