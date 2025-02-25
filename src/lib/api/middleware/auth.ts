import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = {
  validateToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "",
      ) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  },

  validateScope: (requiredScope: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const scopes = req.user?.scopes || [];

      if (!scopes.includes(requiredScope)) {
        return res.status(403).json({ error: "Insufficient scope" });
      }

      next();
    };
  },
};
