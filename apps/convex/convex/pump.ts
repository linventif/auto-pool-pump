import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Log pump actions
export const logPumpAction = mutation({
	args: {
		token: v.string(),
		action: v.union(
			v.literal('start'),
			v.literal('stop'),
			v.literal('schedule_update')
		),
		details: v.optional(v.string()),
		success: v.boolean(),
	},
	handler: async (ctx, { token, action, details, success }) => {
		// Import auth function (we'll need to handle this differently)
		const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

		try {
			// Verify session (simplified for now)
			const session = await ctx.db
				.query('sessions')
				.withIndex('by_token', (q) => q.eq('token', token))
				.first();

			if (!session || session.expiresAt < Date.now()) {
				throw new Error('Invalid session');
			}

			await ctx.db.insert('pumpLogs', {
				userId: session.userId,
				action,
				timestamp: Date.now(),
				details,
				success,
			});

			return { success: true };
		} catch (error) {
			throw new Error('Failed to log pump action');
		}
	},
});

// Get pump logs for user
export const getPumpLogs = query({
	args: {
		token: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, { token, limit = 50 }) => {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', (q) => q.eq('token', token))
			.first();

		if (!session || session.expiresAt < Date.now()) {
			throw new Error('Invalid session');
		}

		const logs = await ctx.db
			.query('pumpLogs')
			.withIndex('by_user', (q) => q.eq('userId', session.userId))
			.order('desc')
			.take(limit);

		return logs;
	},
});

// Save pump settings
export const savePumpSettings = mutation({
	args: {
		token: v.string(),
		scheduleEnabled: v.boolean(),
		scheduleTimes: v.array(v.string()),
		duration: v.number(),
		autoMode: v.boolean(),
	},
	handler: async (
		ctx,
		{ token, scheduleEnabled, scheduleTimes, duration, autoMode }
	) => {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', (q) => q.eq('token', token))
			.first();

		if (!session || session.expiresAt < Date.now()) {
			throw new Error('Invalid session');
		}

		// Check if settings exist
		const existingSettings = await ctx.db
			.query('pumpSettings')
			.withIndex('by_user', (q) => q.eq('userId', session.userId))
			.first();

		const settingsData = {
			scheduleEnabled,
			scheduleTimes,
			duration,
			autoMode,
			updatedAt: Date.now(),
		};

		if (existingSettings) {
			await ctx.db.patch(existingSettings._id, settingsData);
		} else {
			await ctx.db.insert('pumpSettings', {
				userId: session.userId,
				...settingsData,
			});
		}

		return { success: true };
	},
});

// Get pump settings
export const getPumpSettings = query({
	args: {
		token: v.string(),
	},
	handler: async (ctx, { token }) => {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', (q) => q.eq('token', token))
			.first();

		if (!session || session.expiresAt < Date.now()) {
			throw new Error('Invalid session');
		}

		const settings = await ctx.db
			.query('pumpSettings')
			.withIndex('by_user', (q) => q.eq('userId', session.userId))
			.first();

		return (
			settings || {
				scheduleEnabled: false,
				scheduleTimes: [],
				duration: 120,
				autoMode: false,
			}
		);
	},
});
