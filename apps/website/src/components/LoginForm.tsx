import { Component, createSignal, Show } from 'solid-js';
import { useAuth } from '../lib/auth';

const LoginForm: Component = () => {
	const auth = useAuth();
	const [email, setEmail] = createSignal('');
	const [password, setPassword] = createSignal('');
	const [error, setError] = createSignal('');
	const [isLoading, setIsLoading] = createSignal(false);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		const success = await auth.login({
			email: email(),
			password: password(),
		});

		if (!success) {
			setError('Invalid email or password');
		}
		setIsLoading(false);
	};

	return (
		<div class='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div class='max-w-md w-full space-y-8'>
				<div>
					<div class='mx-auto h-12 w-12 bg-pool-600 rounded-lg flex items-center justify-center'>
						<svg
							class='w-8 h-8 text-white'
							fill='currentColor'
							viewBox='0 0 20 20'
						>
							<path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
						</svg>
					</div>
					<h2 class='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Sign in to Pool Controller
					</h2>
					<p class='mt-2 text-center text-sm text-gray-600'>
						Access your automated pool pump system
					</p>
				</div>

				<form class='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div class='rounded-md shadow-sm -space-y-px'>
						<div>
							<label for='email-address' class='sr-only'>
								Email address
							</label>
							<input
								id='email-address'
								name='email'
								type='email'
								autocomplete='email'
								required
								class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-pool-500 focus:border-pool-500 focus:z-10 sm:text-sm'
								placeholder='Email address'
								value={email()}
								onInput={(e) => setEmail(e.currentTarget.value)}
							/>
						</div>
						<div>
							<label for='password' class='sr-only'>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								autocomplete='current-password'
								required
								class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-pool-500 focus:border-pool-500 focus:z-10 sm:text-sm'
								placeholder='Password'
								value={password()}
								onInput={(e) =>
									setPassword(e.currentTarget.value)
								}
							/>
						</div>
					</div>

					<Show when={error()}>
						<div
							class='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'
							role='alert'
						>
							<span class='block sm:inline'>{error()}</span>
						</div>
					</Show>

					<div>
						<button
							type='submit'
							disabled={isLoading()}
							class='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pool-600 hover:bg-pool-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pool-500 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							<Show when={isLoading()} fallback='Sign in'>
								<svg
									class='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										class='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										stroke-width='4'
									></circle>
									<path
										class='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
								Signing in...
							</Show>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
