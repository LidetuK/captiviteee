import { authMiddleware } from "@/lib/api/middleware/auth";
import jwt from "jsonwebtoken";

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

  test("validates JWT token", () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET || "test");
    mockRequest.headers.authorization = `Bearer ${token}`;

    authMiddleware.validateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
  });

  test("rejects invalid token", () => {
    mockRequest.headers.authorization = "Bearer invalid-token";

    authMiddleware.validateToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("validates scopes", () => {
    mockRequest.user = { scopes: ["read:users"] };

    const middleware = authMiddleware.validateScope("read:users");
    middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
