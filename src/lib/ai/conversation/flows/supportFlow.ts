import { dialogManager, DialogNode } from "../dialogManager";
import { businessLogic } from "../../business-logic";

const supportFlow: Record<string, DialogNode> = {
  start: {
    id: "start",
    message: "What can I help you with today?",
    next: () => "category",
  },
  category: {
    id: "category",
    message:
      "Is this related to technical support, billing, or general inquiries?",
    validation: (input) =>
      ["technical", "billing", "general"].includes(input.toLowerCase()),
    action: async (input, entities) => {
      await businessLogic.routeToSupport(input, {
        category: input.toLowerCase(),
      });
    },
    next: (input) => {
      switch (input.toLowerCase()) {
        case "technical":
          return "technical";
        case "billing":
          return "billing";
        default:
          return "general";
      }
    },
  },
  technical: {
    id: "technical",
    message:
      "I'll connect you with our technical support team. Please describe your issue.",
  },
  billing: {
    id: "billing",
    message:
      "I'll connect you with our billing department. Please provide your account number if available.",
  },
  general: {
    id: "general",
    message:
      "I'll do my best to help. Please describe what you need assistance with.",
  },
};

dialogManager.registerFlow("GET_SUPPORT", supportFlow);
