import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	users: defineTable({
		email: v.string(),
		passwordHash: v.string(),
		name: v.string(),
		role: v.union(v.literal('admin'), v.literal('user')),
		isEmailVerified: v.boolean(),
		createdAt: v.number(),
		lastLoginAt: v.optional(v.number()),
	})
		.index('by_email', ['email'])
		.index('by_role', ['role']),

	sessions: defineTable({
		userId: v.id('users'),
		token: v.string(),
		expiresAt: v.number(),
		createdAt: v.number(),
		userAgent: v.optional(v.string()),
		ipAddress: v.optional(v.string()),
	})
		.index('by_token', ['token'])
		.index('by_user', ['userId'])
		.index('by_expires', ['expiresAt']),

	pumpLogs: defineTable({
		userId: v.id('users'),
		action: v.union(
			v.literal('start'),
			v.literal('stop'),
			v.literal('schedule_update')
		),
		timestamp: v.number(),
		details: v.optional(v.string()),
		success: v.boolean(),
	})
		.index('by_user', ['userId'])
		.index('by_timestamp', ['timestamp']),

	pumpSettings: defineTable({
		userId: v.id('users'),
		scheduleEnabled: v.boolean(),
		scheduleTimes: v.array(v.string()),
		duration: v.number(),
		autoMode: v.boolean(),
		updatedAt: v.number(),
	}).index('by_user', ['userId']),
});
