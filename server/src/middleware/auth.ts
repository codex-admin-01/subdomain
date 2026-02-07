import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/tokens.js';

export type AuthRequest = Request & { user?: { userId: string; role: 'ADMIN' | 'USER' } };

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
};
