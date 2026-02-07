import jwt from 'jsonwebtoken';

export type JwtPayload = { userId: string; role: 'ADMIN' | 'USER' };

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

export const verifyToken = (token: string, secret: string) => jwt.verify(token, secret) as JwtPayload;
