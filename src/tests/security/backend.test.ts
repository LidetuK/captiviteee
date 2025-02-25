import { authMiddleware } from "@/lib/api/middleware/auth";
import { rateLimiter } from "@/lib/api/rateLimit";

describe("Backend Security Tests", () => {
  describe("Authentication", () => {
    const mockRequest = {
      headers: {},
      user: null,
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockNext = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("validates JWT tokens", () => {
      mockRequest.headers.authorization = "Bearer invalid-token";
      authMiddleware.validateToken(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    test("validates scopes", () => {
      mockRequest.user = { scopes: ["read:users"] };
      const middleware = authMiddleware.validateScope("read:users");
      middleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("Rate Limiting", () => {
    test("limits request rate", () => {
      const limiter = rateLimiter.createLimiter({
        windowMs: 1000,
        maxRequests: 5,
      });

      const requests = Array(10)
        .fill(null)
        .map(() => limiter({ ip: "127.0.0.1" }));

      expect(requests.filter(Boolean).length).toBe(5);
    });
  });
});
