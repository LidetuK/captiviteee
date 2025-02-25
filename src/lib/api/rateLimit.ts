import { Request, Response, NextFunction } from "express";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const rateLimiter = (config: RateLimitConfig) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this IP
    const userRequests = requests.get(clientIp) || [];

    // Filter requests within the current window
    const recentRequests = userRequests.filter((time) => time > windowStart);

    if (recentRequests.length >= config.maxRequests) {
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((windowStart + config.windowMs - now) / 1000),
      });
    }

    // Add current request
    recentRequests.push(now);
    requests.set(clientIp, recentRequests);

    next();
  };
};
