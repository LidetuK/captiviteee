// API endpoints and base URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = {
  chat: {
    send: async (_message: string) => {
      try {
        // For demo purposes, return a mock response
        return {
          message:
            "Thank you for your message. A representative will get back to you shortly.",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Chat error:", error);
        throw error;
      }
    },
  },
  consultation: {
    request: async (data: any) => {
      try {
        // For demo purposes, simulate a successful request
        return {
          success: true,
          message: "Consultation request received",
          appointmentId: Math.random().toString(36).substring(7),
          scheduledTime: data.date,
        };
      } catch (error) {
        console.error("Consultation request error:", error);
        throw error;
      }
    },
  },
  demo: {
    request: async (data: any) => {
      try {
        // For demo purposes, simulate a successful request
        return {
          success: true,
          message: "Demo request received",
          demoId: Math.random().toString(36).substring(7),
          scheduledTime: data.preferredDate,
        };
      } catch (error) {
        console.error("Demo request error:", error);
        throw error;
      }
    },
  },
};
