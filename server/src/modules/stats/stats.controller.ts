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
      // Number() rejects "3.5" and "5abc", which parseInt would quietly turn into 3 and 5
      const parsedLimit = Number(req.query.limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 10) {
        throw new ValidationError('limit must be a whole number between 1 and 10');
      }
      limit = parsedLimit;
    }
    const result = await statsService.getRecent(limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
