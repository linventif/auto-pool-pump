export * from './types';

export const API_ENDPOINTS = {
	PUMP_STATUS: '/api/pump/status',
	PUMP_START: '/api/pump/start',
	PUMP_STOP: '/api/pump/stop',
	PUMP_SCHEDULE: '/api/pump/schedule',
	HEALTH: '/health',
} as const;

export const DEFAULT_API_URL =
	process.env.NODE_ENV === 'production'
		? 'https://your-api-domain.com'
		: 'http://localhost:8080';
