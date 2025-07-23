import { Component, createSignal, createResource, Show } from 'solid-js';
import { useAuth } from '../lib/auth';

// Constante pour l'URL de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface PumpStatus {
	isRunning: boolean;
	lastRun: string | null;
	nextScheduled: string | null;
	mode: string;
}

interface PumpSchedule {
	enabled: boolean;
	times: string[];
	duration: number;
}

const Dashboard = () => {
	const auth = useAuth();
	const [isLoading, setIsLoading] = createSignal(false);

	const fetchPumpStatus = async (): Promise<PumpStatus> => {
		const token = auth.session()?.token;
		if (!token) throw new Error('No authentication token');

		const response = await fetch(`${API_URL}/api/pump/status`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch pump status');
		}

		return response.json();
	};

	const fetchPumpSchedule = async (): Promise<PumpSchedule> => {
		const token = auth.session()?.token;
		if (!token) throw new Error('No authentication token');

		const response = await fetch(`${API_URL}/api/pump/schedule`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch pump schedule');
		}

		return response.json();
	};

	const [pumpStatus, { refetch: refetchStatus }] =
		createResource(fetchPumpStatus);
	const [pumpSchedule] = createResource(fetchPumpSchedule);

	const startPump = async () => {
		const token = auth.session()?.token;
		if (!token) return;

		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/pump/start`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				// Refresh status after successful action
				refetchStatus();
			} else {
				console.error('Failed to start pump');
			}
		} catch (error) {
			console.error('Failed to start pump:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const stopPump = async () => {
		const token = auth.session()?.token;
		if (!token) return;

		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/pump/stop`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				// Refresh status after successful action
				refetchStatus();
			} else {
				console.error('Failed to stop pump');
			}
		} catch (error) {
			console.error('Failed to stop pump:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div class='space-y-6'>
			<div class='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
				<h2 class='text-2xl font-bold text-gray-900'>Dashboard</h2>
				<div class='mt-4 sm:mt-0 flex space-x-3'>
					<button
						onClick={startPump}
						disabled={isLoading()}
						class='btn-primary disabled:opacity-50'
					>
						{isLoading() ? 'Starting...' : 'Start Pump'}
					</button>
					<button
						onClick={stopPump}
						disabled={isLoading()}
						class='btn-danger disabled:opacity-50'
					>
						{isLoading() ? 'Stopping...' : 'Stop Pump'}
					</button>
				</div>
			</div>

			<div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{/* Pump Status Card */}
				<div class='card'>
					<h3 class='text-lg font-semibold text-gray-900 mb-4'>
						Pump Status
					</h3>
					<Show
						when={!pumpStatus.loading}
						fallback={
							<div class='animate-pulse bg-gray-200 h-4 rounded'></div>
						}
					>
						<div class='space-y-3'>
							<div class='flex items-center justify-between'>
								<span class='text-gray-600'>Status:</span>
								<span
									class={`px-2 py-1 rounded-full text-xs font-medium ${
										pumpStatus()?.isRunning
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
									}`}
								>
									{pumpStatus()?.isRunning
										? 'Running'
										: 'Stopped'}
								</span>
							</div>
							<div class='flex items-center justify-between'>
								<span class='text-gray-600'>Mode:</span>
								<span class='font-medium capitalize'>
									{pumpStatus()?.mode}
								</span>
							</div>
							<div class='flex items-center justify-between'>
								<span class='text-gray-600'>Last Run:</span>
								<span class='text-sm'>
									{pumpStatus()?.lastRun || 'Never'}
								</span>
							</div>
						</div>
					</Show>
				</div>

				{/* Schedule Card */}
				<div class='card'>
					<h3 class='text-lg font-semibold text-gray-900 mb-4'>
						Schedule
					</h3>
					<Show
						when={!pumpSchedule.loading}
						fallback={
							<div class='animate-pulse bg-gray-200 h-4 rounded'></div>
						}
					>
						<div class='space-y-3'>
							<div class='flex items-center justify-between'>
								<span class='text-gray-600'>Enabled:</span>
								<span
									class={`px-2 py-1 rounded-full text-xs font-medium ${
										pumpSchedule()?.enabled
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}
								>
									{pumpSchedule()?.enabled ? 'Yes' : 'No'}
								</span>
							</div>
							<div class='flex items-center justify-between'>
								<span class='text-gray-600'>Times:</span>
								<span class='text-sm'>
									{pumpSchedule()?.times?.join(', ') ||
										'None'}
								</span>
							</div>
							<div class='flex items-center justify-between'>
								<span class='text-gray-600'>Duration:</span>
								<span class='text-sm'>
									{pumpSchedule()?.duration} minutes
								</span>
							</div>
						</div>
					</Show>
				</div>

				{/* System Info Card */}
				<div class='card'>
					<h3 class='text-lg font-semibold text-gray-900 mb-4'>
						System Info
					</h3>
					<div class='space-y-3'>
						<div class='flex items-center justify-between'>
							<span class='text-gray-600'>API:</span>
							<span class='px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
								Connected
							</span>
						</div>
						<div class='flex items-center justify-between'>
							<span class='text-gray-600'>Device:</span>
							<span class='text-sm'>Arduino Pool Controller</span>
						</div>
						<div class='flex items-center justify-between'>
							<span class='text-gray-600'>Version:</span>
							<span class='text-sm'>v1.0.0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
