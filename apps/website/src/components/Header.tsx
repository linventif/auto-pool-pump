import { Component } from 'solid-js';
import { useAuth } from '../lib/auth';

const Header: Component = () => {
	const auth = useAuth();

	const handleLogout = async () => {
		await auth.logout();
	};

	return (
		<header class='bg-white shadow-sm border-b border-gray-200'>
			<div class='container mx-auto px-4 py-4'>
				<div class='flex items-center justify-between'>
					<div class='flex items-center space-x-3'>
						<div class='w-8 h-8 bg-pool-600 rounded-lg flex items-center justify-center'>
							<svg
								class='w-5 h-5 text-white'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
							</svg>
						</div>
						<h1 class='text-xl font-bold text-gray-900'>
							Pool Pump Controller
						</h1>
					</div>
					<div class='flex items-center space-x-4'>
						<div class='hidden md:flex items-center space-x-4'>
							<div class='flex items-center space-x-2'>
								<div class='w-2 h-2 bg-green-500 rounded-full'></div>
								<span class='text-sm text-gray-600'>
									Connected
								</span>
							</div>
							<div class='text-sm text-gray-600'>
								Welcome, {auth.user()?.name}
							</div>
						</div>
						<button
							onClick={handleLogout}
							class='text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
