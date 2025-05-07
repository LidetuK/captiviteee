import { authMiddleware } from "@/lib/api/middleware/auth";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface MockRequest extends Partial<Request> {
  headers: {
    authorization?: string;
  };
  user: any;
}

interface MockResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

describe("Authentication", () => {
  const mockRequest: MockRequest = {
    headers: {},
    user: null,
  };

  const mockResponse: MockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockNext: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates JWT token", () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET || "test");
    mockRequest.headers.authorization = `Bearer ${token}`;

    authMiddleware.validateToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
  });

  test("rejects invalid token", () => {
    mockRequest.headers.authorization = "Bearer invalid-token";

    authMiddleware.validateToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("validates scopes", () => {
    mockRequest.user = { scopes: ["read:users"] };

    const middleware = authMiddleware.validateScope("read:users");
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
