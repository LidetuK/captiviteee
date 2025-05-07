import { features, specializedSolutions, industryUseCases } from "./features";
import { CustomRequest, CustomResponse, CustomNextFunction } from "./types";

// API endpoints for the frontend to consume
export const endpoints = {
  features: {
    getAll: async () => {
      return { data: features, status: 200 };
    },
    getById: async (id: string) => {
      const feature = features.find((f) => f.id === id);
      if (!feature) {
        return { error: "Feature not found", status: 404 };
      }
      return { data: feature, status: 200 };
    },
  },
  solutions: {
    getAll: async () => {
      return { data: specializedSolutions, status: 200 };
    },
    getById: async (id: string) => {
      const solution = specializedSolutions.find((s) => s.id === id);
      if (!solution) {
        return { error: "Solution not found", status: 404 };
      }
      return { data: solution, status: 200 };
    },
  },
  industries: {
    getAll: async () => {
      return { data: industryUseCases, status: 200 };
    },
    getById: async (id: string) => {
      const industry = industryUseCases.find((i) => i.id === id);
      if (!industry) {
        return { error: "Industry not found", status: 404 };
      }
      return { data: industry, status: 200 };
    },
    getFeatures: async (industryId: string) => {
      const industry = industryUseCases.find((i) => i.id === industryId);
      if (!industry) {
        return { error: "Industry not found", status: 404 };
      }

      // In a real implementation, this would use more sophisticated matching logic
      const relevantFeatures = features.filter((feature) => {
        // This is a simplified example - in reality, you'd have a more complex matching algorithm
        return Math.random() > 0.3; // Randomly select features for demo purposes
      });

      return { data: relevantFeatures, status: 200 };
    },
    getSolutions: async (industryId: string) => {
      const industry = industryUseCases.find((i) => i.id === industryId);
      if (!industry) {
        return { error: "Industry not found", status: 404 };
      }

      // Find solutions that mention this industry in their industries array
      const relevantSolutions = specializedSolutions.filter((solution) => {
        return solution.industries.some(
          (ind) =>
            ind.toLowerCase() === industry.industry.toLowerCase() ||
            ind.includes(industry.industry),
        );
      });

      return { data: relevantSolutions, status: 200 };
    },
  },
};

interface CustomEndpoint {
  path: string;
  method: string;
  handler: (req: CustomRequest, res: CustomResponse) => Promise<void> | void;
  middleware?: ((
    req: CustomRequest,
    res: CustomResponse,
    next: CustomNextFunction,
  ) => void)[];
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
}

export const endpointManager = {
  endpoints: new Map<string, CustomEndpoint>(),

  register: (endpoint: CustomEndpoint) => {
    const key = `${endpoint.method}:${endpoint.path}`;
    endpointManager.endpoints.set(key, endpoint);
    return endpoint;
  },

  getEndpoint: (method: string, path: string) => {
    return endpointManager.endpoints.get(`${method}:${path}`);
  },

  listEndpoints: () => {
    return Array.from(endpointManager.endpoints.values());
  },

  createEndpoint: (config: CustomEndpoint) => {
    if (!config.path || !config.method || !config.handler) {
      throw new Error("Invalid endpoint configuration");
    }

    const endpoint = {
      ...config,
      middleware: [
        async (
          _req: CustomRequest,
          _res: CustomResponse,
          next: CustomNextFunction,
        ) => {
          next();
        },
        ...(config.rateLimit
          ? [
              async (
                _req: CustomRequest,
                _res: CustomResponse,
                next: CustomNextFunction,
              ) => {
                next();
              },
            ]
          : []),
        ...(config.middleware || []),
      ],
    };

    return endpointManager.register(endpoint);
  },
};

// Register API endpoints for features, solutions, and industries
endpointManager.createEndpoint({
  path: "/api/features",
  method: "GET",
  handler: async (_req, res) => {
    const result = await endpoints.features.getAll();
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/features/:id",
  method: "GET",
  handler: async (req, res) => {
    const result = await endpoints.features.getById(req.params.id);
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/solutions",
  method: "GET",
  handler: async (_req, res) => {
    const result = await endpoints.solutions.getAll();
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/solutions/:id",
  method: "GET",
  handler: async (req, res) => {
    const result = await endpoints.solutions.getById(req.params.id);
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/industries",
  method: "GET",
  handler: async (_req, res) => {
    const result = await endpoints.industries.getAll();
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/industries/:id",
  method: "GET",
  handler: async (req, res) => {
    const result = await endpoints.industries.getById(req.params.id);
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/industries/:id/features",
  method: "GET",
  handler: async (req, res) => {
    const result = await endpoints.industries.getFeatures(req.params.id);
    res.status(result.status).json(result);
  },
});

endpointManager.createEndpoint({
  path: "/api/industries/:id/solutions",
  method: "GET",
  handler: async (req, res) => {
    const result = await endpoints.industries.getSolutions(req.params.id);
    res.status(result.status).json(result);
  },
});
