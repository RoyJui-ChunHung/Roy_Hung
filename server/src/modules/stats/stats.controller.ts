import { Request, Response, NextFunction } from 'express';
import * as statsService from './stats.service.js';
import { ValidationError } from '../../shared/errors.js';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await statsService.getStats();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let limit = 5; // default value
    if (req.query.limit !== undefined) {
      const parsedLimit = parseInt(req.query.limit as string, 10);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 10) {
        throw new ValidationError('limit must be a whole number between 1 and 10');}
      limit = parsedLimit;
    }
    // 🔴 TODO: Read the optional ?limit= query param (default 5). It must be a whole number from 1 to 10, otherwise throw a ValidationError (400). Pass it to the service.
    const result = await statsService.getRecent(limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
