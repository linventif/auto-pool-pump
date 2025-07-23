import { Component, Show } from 'solid-js';
import { AuthProvider, useAuth } from './lib/auth';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import LoginForm from './components/LoginForm';

const AppContent: Component = () => {
	const auth = useAuth();

	return (
		<Show
			when={!auth.loading()}
			fallback={
				<div class='min-h-screen flex items-center justify-center'>
					<div class='animate-spin rounded-full h-32 w-32 border-b-2 border-pool-600'></div>
				</div>
			}
		>
			<Show when={auth.isAuthenticated()} fallback={<LoginForm />}>
				<div class='min-h-screen bg-gray-50'>
					<Header />
					<main class='container mx-auto px-4 py-8'>
						<Dashboard />
					</main>
				</div>
			</Show>
		</Show>
	);
};

const App: Component = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
};

export default App;
