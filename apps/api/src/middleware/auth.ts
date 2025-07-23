import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

interface JWTPayload {
	userId: string;
	email: string;
	role: string;
}

export const authMiddleware = async (c: Context, next: Next) => {
	const authorization = c.req.header('Authorization');

	if (!authorization || !authorization.startsWith('Bearer ')) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	const token = authorization.split(' ')[1];

	try {
		const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
		const payload = jwt.verify(token, jwtSecret) as JWTPayload;

		// Add user info to context
		c.set('user', payload);
		await next();
	} catch (error) {
		return c.json({ error: 'Invalid token' }, 401);
	}
};

export const adminOnly = async (c: Context, next: Next) => {
	const user = c.get('user') as JWTPayload;

	if (user?.role !== 'admin') {
		return c.json({ error: 'Admin access required' }, 403);
	}

	await next();
};
