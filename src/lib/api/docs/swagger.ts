export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Captivite API",
    version: "1.0.0",
    description: "API documentation for Captivite platform",
  },
  servers: [
    {
      url: "https://api.captivite.ai/v1",
      description: "Production server",
    },
    {
      url: "https://staging-api.captivite.ai/v1",
      description: "Staging server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
  },
  paths: {
    "/auth/token": {
      post: {
        summary: "Get access token",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  clientId: { type: "string" },
                  clientSecret: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    accessToken: { type: "string" },
                    expiresIn: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
