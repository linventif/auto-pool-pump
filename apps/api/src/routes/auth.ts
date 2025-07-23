import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware/auth'

const auth = new Hono()

// Mock user database (in production, use Convex or a real database)
const users = new Map<string, {
  id: string
  email: string
  passwordHash: string
  name: string
  role: 'admin' | 'user'
  createdAt: number
}>()

// Mock sessions database
const sessions = new Map<string, {
  userId: string
  token: string
  expiresAt: number
  createdAt: number
}>()

// Initialize with a default admin user
const defaultAdminPassword = await bcrypt.hash('admin123', 10)
users.set('admin@poolcontroller.com', {
  id: 'admin-1',
  email: 'admin@poolcontroller.com',
  passwordHash: defaultAdminPassword,
  name: 'Admin User',
  role: 'admin',
  createdAt: Date.now(),
})

// Register endpoint
auth.post('/register', async (c) => {
  const { email, password, name } = await c.req.json()

  if (!email || !password || !name) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  if (users.has(email)) {
    return c.json({ error: 'User already exists' }, 409)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const userId = `user-${Date.now()}`

  users.set(email, {
    id: userId,
    email,
    passwordHash,
    name,
    role: 'user',
    createdAt: Date.now(),
  })

  return c.json({ 
    success: true, 
    message: 'User registered successfully' 
  })
})

// Login endpoint
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  if (!email || !password) {
    return c.json({ error: 'Email and password required' }, 400)
  }

  const user = users.get(email)
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: '7d' }
  )

  // Store session
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  sessions.set(token, {
    userId: user.id,
    token,
    expiresAt,
    createdAt: Date.now(),
  })

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
})

// Logout endpoint
auth.post('/logout', authMiddleware, async (c) => {
  const authorization = c.req.header('Authorization')
  const token = authorization?.split(' ')[1]
  
  if (token && sessions.has(token)) {
    sessions.delete(token)
  }

  return c.json({ success: true, message: 'Logged out successfully' })
})

// Verify token endpoint
auth.get('/verify', authMiddleware, async (c) => {
  const user = c.get('user')
  const userRecord = Array.from(users.values()).find(u => u.id === user.userId)
  
  if (!userRecord) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    valid: true,
    user: {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
    },
  })
})

// Get current user profile
auth.get('/profile', authMiddleware, async (c) => {
  const user = c.get('user')
  const userRecord = Array.from(users.values()).find(u => u.id === user.userId)
  
  if (!userRecord) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role,
    createdAt: userRecord.createdAt,
  })
})

export default auth
