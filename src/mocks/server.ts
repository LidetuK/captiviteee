import { setupServer } from "msw/node";
import { http } from "msw";

export const server = setupServer(
  http.post("/api/consultation/request", () => {
    return new Response(
      JSON.stringify({
        success: true,
        appointmentId: "123",
      })
    );
  }),

  http.get("/api/health", () => {
    return new Response(
      JSON.stringify({
        status: "healthy",
        version: "1.0.0",
      })
    );
  }),
);
