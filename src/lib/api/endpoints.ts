import { CustomRequest, CustomResponse, CustomNextFunction } from "./types";

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
