import { pipeline } from "@xenova/transformers";

let nerPipeline: any = null;

export const entityRecognition = {
  initialize: async () => {
    if (!nerPipeline) {
      nerPipeline = await pipeline(
        "token-classification",
        "Xenova/bert-base-NER",
      );
    }
  },

  extractEntities: async (text: string) => {
    await entityRecognition.initialize();
    const results = await nerPipeline(text);

    // Group entities by type
    const entities: Record<string, string[]> = {};
    results.forEach((entity: any) => {
      const type = entity.entity_group;
      const value = text.slice(entity.start, entity.end);
      if (!entities[type]) entities[type] = [];
      if (!entities[type].includes(value)) {
        entities[type].push(value);
      }
    });

    return entities;
  },

  // Custom entity extraction for business terms
  extractBusinessEntities: async (text: string) => {
    const businessTerms = {
      services: ["consultation", "appointment", "booking", "review", "support"],
      actions: ["schedule", "book", "cancel", "reschedule", "update"],
      timeframes: ["today", "tomorrow", "next week", "this month"],
    };

    const entities: Record<string, string[]> = {};

    Object.entries(businessTerms).forEach(([category, terms]) => {
      const found = terms.filter((term) =>
        text.toLowerCase().includes(term.toLowerCase()),
      );
      if (found.length > 0) {
        entities[category] = found;
      }
    });

    return entities;
  },
};
