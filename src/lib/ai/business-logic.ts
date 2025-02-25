import { messaging } from "../messaging";
import { nlp } from "./nlp";

export const businessLogic = {
  handleCustomerQuery: async (query: string, context: any) => {
    // Classify intent
    const intent = await nlp.classifyIntent(query);

    // Extract entities
    const entities = await nlp.extractEntities(query);

    // Get next action
    const nextAction = await nlp.getNextAction({
      query,
      intent,
      entities,
      context,
    });

    // Execute action based on intent
    switch (intent) {
      case "SCHEDULE_APPOINTMENT":
        return businessLogic.handleAppointment(entities);
      case "CHECK_AVAILABILITY":
        return businessLogic.checkAvailability(entities);
      case "CUSTOMER_SUPPORT":
        return businessLogic.routeToSupport(query, context);
      default:
        return businessLogic.generateResponse(query, context);
    }
  },

  handleAppointment: async (entities: any) => {
    // Schedule appointment logic
    const appointment = {
      date: entities.date,
      time: entities.time,
      service: entities.service,
    };

    await messaging.emit("APPOINTMENT_CREATED", appointment);
    return appointment;
  },

  checkAvailability: async (entities: any) => {
    // Check availability logic
    return {
      available: true,
      slots: ["9:00", "10:00", "11:00"],
    };
  },

  routeToSupport: async (query: string, context: any) => {
    const sentiment = await nlp.analyzeSentiment(query);

    if (sentiment < -0.5) {
      // Priority routing for negative sentiment
      await messaging.emit("PRIORITY_SUPPORT_NEEDED", {
        query,
        context,
        sentiment,
      });
    }

    return {
      routed: true,
      priority: sentiment < -0.5,
    };
  },

  generateResponse: async (query: string, context: any) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI support representative for Captivite, an AI-powered business automation platform. Our key features include:
          - Text-Back AI: 24/7 automated customer response system
          - Smart Scheduling: AI-powered appointment management
          - Reputation Management: Monitor and improve online presence
          - Analytics Dashboard: Real-time business insights
          - Integration Hub: Connect with popular tools like Salesforce, HubSpot, etc.
          
          Our pricing includes:
          - Single Service Plan: Choose any one service, starts at $297.99/month
          - Business Bundle: Any three services, starts at $747.99/month
          - Enterprise: All services + custom solutions, starts at $1,497.99/month
          
          All plans include a 45-day money-back guarantee.
          
          Be helpful, professional, and concise in your responses.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  },
};
