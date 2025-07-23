import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import auth from './routes/auth';
import sensors from './routes/sensors';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
	'*',
	cors({
		origin: [
			'http://localhost:4001',
			'http://localhost:3000',
			'http://localhost:5173',
			'https://iot.linv.dev',
		],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowHeaders: ['Content-Type', 'Authorization'],
	})
);

// Auth routes (no authentication required)
app.route('/api/auth', auth);

// Sensor routes (authentication required)
app.route('/api/sensors', sensors);

// Routes
app.get('/', (c) => {
	return c.json({
		message: 'Auto Pool Pump API with Authentication',
		version: '1.0.0',
		timestamp: new Date().toISOString(),
	});
});

app.get('/health', (c) => {
	return c.json({ status: 'healthy', uptime: process.uptime() });
});

// Protected pool pump routes
app.get('/api/pump/status', authMiddleware, (c) => {
	// This would connect to your Arduino/IoT device
	return c.json({
		isRunning: false,
		lastRun: null,
		nextScheduled: null,
		mode: 'manual',
	});
});

app.post('/api/pump/start', authMiddleware, async (c) => {
	// This would send command to Arduino/IoT device
	// Log the action for the authenticated user
	return c.json({ success: true, message: 'Pump started' });
});

app.post('/api/pump/stop', authMiddleware, async (c) => {
	// This would send command to Arduino/IoT device
	// Log the action for the authenticated user
	return c.json({ success: true, message: 'Pump stopped' });
});

app.get('/api/pump/schedule', authMiddleware, (c) => {
	return c.json({
		enabled: true,
		times: ['06:00', '18:00'],
		duration: 120, // minutes
	});
});

const port = process.env.PORT || 4000;

console.log(`🚀 API Server with Authentication is running on port ${port}`);
console.log(`📝 Default admin credentials:`);
console.log(`   Email: admin@poolcontroller.com`);
console.log(`   Password: admin123`);

serve({
	fetch: app.fetch,
	port: Number(port),
});

export default app;
