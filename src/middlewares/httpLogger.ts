import { Request, Response, NextFunction } from 'express';
import Logger from '../config/logger';

const LOG = new Logger(__filename);

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  LOG.info(`Incoming Request ${req.method} ${req.originalUrl}`);

  next();
}

export const responseLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    LOG.info(
      `Outgoing Response ${req.method} ${req.originalUrl}, Status: ${res.statusCode}, Response Time: ${duration}ms`
    );
  });

  next();
};
