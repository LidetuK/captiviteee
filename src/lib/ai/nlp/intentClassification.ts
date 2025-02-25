import { pipeline } from "@xenova/transformers";

let classifierPipeline: any = null;

export const intentClassification = {
  initialize: async () => {
    if (!classifierPipeline) {
      classifierPipeline = await pipeline(
        "text-classification",
        "Xenova/bert-base-uncased",
      );
    }
  },

  // Pre-defined business intents
  intents: {
    SCHEDULE_APPOINTMENT: "schedule_appointment",
    CHECK_AVAILABILITY: "check_availability",
    CANCEL_APPOINTMENT: "cancel_appointment",
    GET_SUPPORT: "get_support",
    CHECK_STATUS: "check_status",
    PROVIDE_FEEDBACK: "provide_feedback",
  },

  classifyIntent: async (text: string) => {
    // Rule-based intent classification
    const lowerText = text.toLowerCase();

    if (lowerText.includes("schedule") || lowerText.includes("book")) {
      return intentClassification.intents.SCHEDULE_APPOINTMENT;
    }

    if (lowerText.includes("available") || lowerText.includes("when")) {
      return intentClassification.intents.CHECK_AVAILABILITY;
    }

    if (lowerText.includes("cancel") || lowerText.includes("reschedule")) {
      return intentClassification.intents.CANCEL_APPOINTMENT;
    }

    if (lowerText.includes("help") || lowerText.includes("support")) {
      return intentClassification.intents.GET_SUPPORT;
    }

    if (lowerText.includes("status") || lowerText.includes("check")) {
      return intentClassification.intents.CHECK_STATUS;
    }

    if (lowerText.includes("feedback") || lowerText.includes("review")) {
      return intentClassification.intents.PROVIDE_FEEDBACK;
    }

    // Fallback to ML classification
    await intentClassification.initialize();
    const result = await classifierPipeline(text);
    return result[0].label;
  },
};
