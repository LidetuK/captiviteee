import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
  user?: any;
}

export interface CustomResponse extends Response {}

export interface CustomNextFunction extends NextFunction {}

export interface CustomEndpoint {
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
