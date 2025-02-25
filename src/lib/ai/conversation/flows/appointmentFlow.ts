import { dialogManager, DialogNode } from "../dialogManager";
import { businessLogic } from "../../business-logic";

const appointmentFlow: Record<string, DialogNode> = {
  start: {
    id: "start",
    message: "What date would you like to schedule your appointment?",
    expectedEntities: ["date"],
    validation: (_, entities) => !!entities.date,
    next: () => "time",
  },
  time: {
    id: "time",
    message: "What time works best for you?",
    expectedEntities: ["time"],
    validation: (_, entities) => !!entities.time,
    next: () => "service",
  },
  service: {
    id: "service",
    message: "What type of service would you like to schedule?",
    expectedEntities: ["service"],
    validation: (_, entities) => !!entities.service,
    next: () => "confirm",
  },
  confirm: {
    id: "confirm",
    message: "Would you like me to schedule this appointment?",
    validation: (input) => ["yes", "no"].includes(input.toLowerCase()),
    action: async (input, entities) => {
      if (input.toLowerCase() === "yes") {
        await businessLogic.handleAppointment(entities);
      }
    },
    next: (input) => (input.toLowerCase() === "yes" ? "success" : "cancel"),
  },
  success: {
    id: "success",
    message:
      "Great! Your appointment has been scheduled. You will receive a confirmation email shortly.",
  },
  cancel: {
    id: "cancel",
    message:
      "No problem. Let me know if you would like to schedule an appointment at a different time.",
  },
};

dialogManager.registerFlow("SCHEDULE_APPOINTMENT", appointmentFlow);
