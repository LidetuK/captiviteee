import { Request, Response, NextFunction } from "express";
import { rateLimiter } from "@/lib/api/rateLimit";

export const securityMiddleware = {
  rateLimit: rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  }),

  cors: (_req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    next();
  },

  helmet: (_req: Request, res: Response, next: NextFunction) => {
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    res.header("X-Content-Type-Options", "nosniff");
    res.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
    res.header("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  },

  validateContentType: (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "POST" || req.method === "PUT") {
      if (!req.is("application/json")) {
        return res.status(415).json({
          error: "Content-Type must be application/json",
        });
      }
    }
    next();
  },
};
