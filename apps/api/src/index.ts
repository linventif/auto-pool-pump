import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import auth from './routes/auth';
import sensors from './routes/sensors';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

// WebSocket setup
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

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

// WebSocket endpoint for Arduino connection
app.get(
	'/api/ws',
	upgradeWebSocket((c) => {
		console.log('WebSocket connection requested');

		return {
			onOpen(evt, ws) {
				console.log('Arduino WebSocket connected');
				ws.send(
					JSON.stringify({
						type: 'connection',
						message: 'Welcome Arduino! WebSocket connected',
						timestamp: new Date().toISOString(),
						server: 'Pool Monitor API v1.0',
					})
				);
			},

			onMessage(evt, ws) {
				console.log('Received WebSocket message:', evt.data);

				try {
					const data = JSON.parse(evt.data.toString());
					console.log('Parsed Arduino data:', data);

					// Respond based on message type
					if (data.type === 'hello') {
						ws.send(
							JSON.stringify({
								type: 'hello_response',
								success: true,
								message: 'Hello Arduino! Test successful',
								timestamp: new Date().toISOString(),
								receivedData: data,
							})
						);
					} else if (data.type === 'sensor_data') {
						// Process sensor data
						console.log('Sensor data received:', {
							tempPool: data.tempPool,
							tempOutdoor: data.tempOutdoor,
							relayState: data.relayState,
							deviceId: data.deviceId,
						});

						ws.send(
							JSON.stringify({
								type: 'sensor_response',
								success: true,
								message: 'Sensor data received successfully',
								timestamp: new Date().toISOString(),
							})
						);
					} else {
						ws.send(
							JSON.stringify({
								type: 'error',
								message: 'Unknown message type',
								timestamp: new Date().toISOString(),
							})
						);
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
					ws.send(
						JSON.stringify({
							type: 'error',
							message: 'Invalid JSON format',
							timestamp: new Date().toISOString(),
						})
					);
				}
			},

			onClose(evt, ws) {
				console.log('Arduino WebSocket disconnected');
			},

			onError(evt, ws) {
				console.error('WebSocket error:', evt);
			},
		};
	})
);

// Test endpoint for Arduino connection (with authentication)
app.post('/api/hello', authMiddleware, async (c) => {
	const body = await c.req.json();
	console.log('Arduino test connection:', body);

	return c.json({
		success: true,
		message: 'Hello Arduino! Connection successful',
		timestamp: new Date().toISOString(),
		receivedData: body,
		server: 'Pool Monitor API v1.0',
	});
});

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
console.log(`� WebSocket endpoint available at ws://localhost:${port}/api/ws`);
console.log(`�📝 Default admin credentials:`);
console.log(`   Email: admin@poolcontroller.com`);
console.log(`   Password: admin123`);

const server = serve({
	fetch: app.fetch,
	port: Number(port),
});

// Inject WebSocket support
injectWebSocket(server);

export default app;
