import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const correlationId =
    req.headers['x-correlation-id']?.toString() ?? uuid();

  req['correlationId'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  next();
}