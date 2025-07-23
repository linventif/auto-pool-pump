import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

interface JWTPayload {
	userId: string;
	email: string;
	role: string;
}

const sensors = new Hono();

// Mock sensor data storage (in production, use Convex or a real database)
const sensorData = new Map<
	string,
	{
		id: string;
		timestamp: number;
		tempPool: number;
		tempOutdoor: number;
		tempDifference: number;
		relayState: boolean;
		deviceId?: string;
	}
>();

// Mock current sensor readings
let currentReading = {
	tempPool: 22.5,
	tempOutdoor: 25.3,
	tempDifference: -2.8,
	relayState: false,
	lastUpdate: Date.now(),
};

// GET /sensors/current - Get current sensor readings (protected)
sensors.get('/current', authMiddleware, async (c) => {
	try {
		const user = c.get('user') as JWTPayload;

		return c.json({
			success: true,
			data: {
				tempPool: currentReading.tempPool,
				tempOutdoor: currentReading.tempOutdoor,
				tempDifference: currentReading.tempDifference,
				relayState: currentReading.relayState,
				lastUpdate: currentReading.lastUpdate,
				unit: 'celsius',
			},
			timestamp: Date.now(),
			requestedBy: user.email,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Failed to fetch sensor data',
			},
			500
		);
	}
});

// GET /sensors/history - Get sensor history (protected)
sensors.get('/history', authMiddleware, async (c) => {
	try {
		const user = c.get('user') as JWTPayload;
		const limit = parseInt(c.req.query('limit') || '100');
		const since = c.req.query('since')
			? parseInt(c.req.query('since') || '0')
			: 0;

		// Filter and sort sensor data
		const filteredData = Array.from(sensorData.values())
			.filter((reading) => reading.timestamp >= since)
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, Math.min(limit, 1000)); // Max 1000 records

		return c.json({
			success: true,
			data: filteredData,
			count: filteredData.length,
			timestamp: Date.now(),
			requestedBy: user.email,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Failed to fetch sensor history',
			},
			500
		);
	}
});

// POST /sensors/data - Update sensor data from Arduino (protected)
sensors.post('/data', authMiddleware, async (c) => {
	try {
		const user = c.get('user') as JWTPayload;
		const { tempPool, tempOutdoor, relayState, deviceId } =
			await c.req.json();

		// Validate required fields
		if (typeof tempPool !== 'number' || typeof tempOutdoor !== 'number') {
			return c.json(
				{
					success: false,
					error: 'Missing or invalid temperature data',
				},
				400
			);
		}

		// Calculate temperature difference
		const tempDifference = tempPool - tempOutdoor;

		// Update current reading
		currentReading = {
			tempPool,
			tempOutdoor,
			tempDifference,
			relayState: relayState || false,
			lastUpdate: Date.now(),
		};

		// Store in history
		const readingId = `reading-${Date.now()}`;
		sensorData.set(readingId, {
			id: readingId,
			timestamp: Date.now(),
			tempPool,
			tempOutdoor,
			tempDifference,
			relayState: relayState || false,
			deviceId,
		});

		// Keep only last 1000 readings in memory
		if (sensorData.size > 1000) {
			const oldestKey = Array.from(sensorData.keys())[0];
			sensorData.delete(oldestKey);
		}

		return c.json({
			success: true,
			message: 'Sensor data updated successfully',
			data: {
				id: readingId,
				tempPool,
				tempOutdoor,
				tempDifference,
				relayState: relayState || false,
				timestamp: Date.now(),
			},
			updatedBy: user.email,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Failed to update sensor data',
			},
			500
		);
	}
});

// GET /sensors/status - Get system status (protected)
sensors.get('/status', authMiddleware, async (c) => {
	try {
		const user = c.get('user') as JWTPayload;
		const now = Date.now();
		const lastUpdateAge = now - currentReading.lastUpdate;
		const isOnline = lastUpdateAge < 30000; // Consider offline if no update for 30s

		return c.json({
			success: true,
			data: {
				isOnline,
				lastUpdateAge,
				lastUpdate: currentReading.lastUpdate,
				currentTemp: {
					pool: currentReading.tempPool,
					outdoor: currentReading.tempOutdoor,
					difference: currentReading.tempDifference,
				},
				relayState: currentReading.relayState,
				totalReadings: sensorData.size,
				systemUptime:
					now -
					(Array.from(sensorData.values())[0]?.timestamp || now),
			},
			timestamp: now,
			requestedBy: user.email,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Failed to fetch system status',
			},
			500
		);
	}
});

// PUT /sensors/relay - Control relay state manually (admin only)
sensors.put('/relay', authMiddleware, async (c) => {
	try {
		const user = c.get('user') as JWTPayload;

		// Check if user is admin
		if (user.role !== 'admin') {
			return c.json(
				{
					success: false,
					error: 'Admin access required',
				},
				403
			);
		}

		const { state, override } = await c.req.json();

		if (typeof state !== 'boolean') {
			return c.json(
				{
					success: false,
					error: 'Invalid relay state. Must be boolean.',
				},
				400
			);
		}

		// Update relay state
		currentReading.relayState = state;
		currentReading.lastUpdate = Date.now();

		return c.json({
			success: true,
			message: `Relay ${state ? 'activated' : 'deactivated'} manually`,
			data: {
				relayState: state,
				override: override || false,
				timestamp: Date.now(),
			},
			controlledBy: user.email,
		});
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Failed to control relay',
			},
			500
		);
	}
});

export default sensors;
