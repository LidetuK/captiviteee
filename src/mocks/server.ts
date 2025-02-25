import { setupServer } from "msw/node";
import { rest } from "msw";

export const server = setupServer(
  rest.post("/api/consultation/request", (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        appointmentId: "123",
      }),
    );
  }),

  rest.get("/api/health", (req, res, ctx) => {
    return res(
      ctx.json({
        status: "healthy",
        version: "1.0.0",
      }),
    );
  }),
);
