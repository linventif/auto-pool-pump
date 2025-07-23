export interface PumpStatus {
	isRunning: boolean;
	lastRun: string | null;
	nextScheduled: string | null;
	mode: 'manual' | 'automatic' | 'scheduled';
	temperature?: number;
	pressure?: number;
}

export interface PumpSchedule {
	enabled: boolean;
	times: string[];
	duration: number; // in minutes
	daysOfWeek?: number[]; // 0-6, Sunday = 0
}

export interface PumpCommand {
	action: 'start' | 'stop' | 'schedule';
	duration?: number;
	scheduledTime?: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
}

// Authentication types
// User and Authentication Types
export interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'user';
	isEmailVerified?: boolean;
	createdAt?: number;
	lastLoginAt?: number;
}

export interface AuthSession {
	userId: string;
	token: string;
	expiresAt: number;
	createdAt: number;
	userAgent?: string;
	ipAddress?: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name: string;
}

export interface AuthResponse {
	success: boolean;
	token?: string;
	user?: User;
	error?: string;
}

// Sensor and Pool System Types
export interface SensorReading {
	id: string;
	timestamp: number;
	tempPool: number;
	tempOutdoor: number;
	tempDifference: number;
	relayState: boolean;
	deviceId?: string;
}

export interface CurrentSensorData {
	tempPool: number;
	tempOutdoor: number;
	tempDifference: number;
	relayState: boolean;
	lastUpdate: number;
	unit: 'celsius' | 'fahrenheit';
}

export interface SensorApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	timestamp?: number;
	requestedBy?: string;
	message?: string;
}

export interface SystemStatus {
	isOnline: boolean;
	lastUpdateAge: number;
	lastUpdate: number;
	currentTemp: {
		pool: number;
		outdoor: number;
		difference: number;
	};
	relayState: boolean;
	totalReadings: number;
	systemUptime: number;
}

export interface RelayControlRequest {
	state: boolean;
	override?: boolean;
}

// Pump Control Types
export interface PumpSettings {
	id: string;
	userId: string;
	name: string;
	isActive: boolean;
	schedule?: PumpSchedule[];
	tempThreshold?: number;
	manualOverride?: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface PumpSchedule {
	dayOfWeek: number; // 0-6 (Sunday-Saturday)
	startTime: string; // "HH:MM"
	endTime: string; // "HH:MM"
	isActive: boolean;
}

export interface PumpLog {
	id: string;
	userId: string;
	pumpId: string;
	action: 'start' | 'stop' | 'error';
	reason: 'manual' | 'schedule' | 'temperature' | 'system';
	tempPool?: number;
	tempOutdoor?: number;
	relayState: boolean;
	timestamp: number;
	metadata?: Record<string, any>;
}
