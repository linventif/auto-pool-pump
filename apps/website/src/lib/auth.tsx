import {
	createContext,
	useContext,
	createSignal,
	createEffect,
	JSX,
} from 'solid-js';
import {
	User,
	AuthSession,
	LoginCredentials,
	RegisterData,
} from '@auto-pool-pump/shared';

interface AuthContextType {
	user: () => User | null;
	session: () => AuthSession | null;
	isAuthenticated: () => boolean;
	login: (credentials: LoginCredentials) => Promise<boolean>;
	register: (data: RegisterData) => Promise<boolean>;
	logout: () => Promise<void>;
	loading: () => boolean;
}

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

interface AuthProviderProps {
	children: JSX.Element;
}

export const AuthProvider = (props: AuthProviderProps) => {
	const [user, setUser] = createSignal<User | null>(null);
	const [session, setSession] = createSignal<AuthSession | null>(null);
	const [loading, setLoading] = createSignal(true);

	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

	// Check for existing session on mount
	createEffect(async () => {
		const savedSession = localStorage.getItem('auth_session');
		if (savedSession) {
			try {
				const sessionData: AuthSession = JSON.parse(savedSession);

				// Verify session is still valid
				if (sessionData.expiresAt > Date.now()) {
					// Verify with server
					const response = await fetch(`${API_URL}/api/auth/verify`, {
						headers: {
							Authorization: `Bearer ${sessionData.token}`,
						},
					});

					if (response.ok) {
						const userData = await response.json();
						setUser(userData.user);
						setSession(sessionData);
					} else {
						localStorage.removeItem('auth_session');
					}
				} else {
					localStorage.removeItem('auth_session');
				}
			} catch (error) {
				console.error('Failed to restore session:', error);
				localStorage.removeItem('auth_session');
			}
		}
		setLoading(false);
	});

	const login = async (credentials: LoginCredentials): Promise<boolean> => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			});

			if (response.ok) {
				const data = await response.json();
				const authSession: AuthSession = {
					token: data.token,
					user: data.user,
					expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
				};

				setUser(data.user);
				setSession(authSession);
				localStorage.setItem(
					'auth_session',
					JSON.stringify(authSession)
				);
				return true;
			} else {
				const error = await response.json();
				throw new Error(error.message || 'Login failed');
			}
		} catch (error) {
			console.error('Login error:', error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const register = async (data: RegisterData): Promise<boolean> => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				// Auto-login after registration
				return await login({
					email: data.email,
					password: data.password,
				});
			} else {
				const error = await response.json();
				throw new Error(error.message || 'Registration failed');
			}
		} catch (error) {
			console.error('Registration error:', error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const logout = async (): Promise<void> => {
		const currentSession = session();
		if (currentSession) {
			try {
				await fetch(`${API_URL}/api/auth/logout`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${currentSession.token}`,
					},
				});
			} catch (error) {
				console.error('Logout error:', error);
			}
		}

		setUser(null);
		setSession(null);
		localStorage.removeItem('auth_session');
	};

	const isAuthenticated = () => {
		const currentSession = session();
		return currentSession !== null && currentSession.expiresAt > Date.now();
	};

	const authValue: AuthContextType = {
		user,
		session,
		isAuthenticated,
		login,
		register,
		logout,
		loading,
	};

	return (
		<AuthContext.Provider value={authValue}>
			{props.children}
		</AuthContext.Provider>
	);
};
