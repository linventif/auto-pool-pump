# # Auto Pool Pump Controller

A modern monorepo setup for controlling pool pumps with IoT integration.

## Architecture

This project is structured as a monorepo using **Turbo** and **Bun** with the following packages:

- **apps/api** - TypeScript API using Hono framework
- **apps/website** - SolidJS frontend with Tailwind CSS
- **packages/shared** - Shared types and utilities
- **arduino/** - Arduino/IoT device code

## Tech Stack

### API (`apps/api`)

- **Hono** - Lightweight web framework
- **TypeScript** - Type-safe JavaScript
- **Bun** - Fast JavaScript runtime and package manager

### Website (`apps/website`)

- **SolidJS** - Reactive UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool

### DevOps & Tools

- **Turbo** - Monorepo build system
- **TypeScript** - Shared type definitions
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime and package manager
- Node.js 18+ (for some dependencies)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd auto-pool-pump
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
# Edit the .env file with your configuration
```

### Development

Start all services in development mode:

```bash
bun dev
```

This will start:

- API server on http://localhost:8080
- Website on http://localhost:3000

### Individual Services

Run individual services:

```bash
# API only
cd apps/api && bun dev

# Website only
cd apps/website && bun dev

# Build shared package
cd packages/shared && bun run build
```

### Building for Production

Build all packages:

```bash
bun run build
```

Or build individual packages:

```bash
# Build API
cd apps/api && bun run build

# Build website
cd apps/website && bun run build
```

## Project Structure

```
auto-pool-pump/
├── apps/
│   ├── api/                 # Hono API server
│   │   ├── src/
│   │   │   └── index.ts     # API entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── website/             # SolidJS frontend
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── App.tsx      # Main app component
│       │   └── index.tsx    # Entry point
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
├── packages/
│   └── shared/              # Shared utilities
│       ├── src/
│       │   ├── types.ts     # TypeScript interfaces
│       │   └── index.ts     # Exports
│       └── package.json
├── arduino/
│   ├── arduino.ino          # Arduino sketch
│   └── config.example.h     # Configuration template
├── package.json             # Root package.json
├── turbo.json              # Turbo configuration
└── README.md
```

## API Endpoints

- `GET /` - API info and health check
- `GET /health` - System health status
- `GET /api/pump/status` - Current pump status
- `POST /api/pump/start` - Start the pump
- `POST /api/pump/stop` - Stop the pump
- `GET /api/pump/schedule` - Get pump schedule

## Features

- 🚀 **Fast Development** - Hot reload for both API and frontend
- 🔧 **Type Safety** - Shared TypeScript types across packages
- 🎨 **Modern UI** - SolidJS with Tailwind CSS
- 📱 **Responsive** - Mobile-first design
- 🔌 **IoT Ready** - Arduino integration for hardware control
- 🏗️ **Monorepo** - Organized codebase with Turbo
- ⚡ **Performant** - Bun runtime for fast execution
- 🔐 **Authentication** - Secure user authentication with JWT
- 📊 **Self-hosted Backend** - Convex for data management
- 👥 **User Management** - Role-based access control

## Authentication

The system includes a secure authentication system with the following features:

- **JWT-based authentication** - Secure token-based authentication
- **Role-based access control** - Admin and user roles
- **Session management** - Secure session handling
- **Password hashing** - bcrypt for secure password storage

### Default Admin Account

For initial setup, a default admin account is created:

- **Email**: admin@poolcontroller.com
- **Password**: admin123

⚠️ **Important**: Change the default admin password immediately after first login.

### API Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile

All pump control endpoints require authentication via Bearer token.

## Arduino Integration

The Arduino code in the `arduino/` directory provides the hardware interface for controlling the pool pump. See the Arduino README for setup instructions.

## Deployment

### API Deployment

The API can be deployed to any platform that supports Node.js/Bun:

- Railway
- Render
- DigitalOcean App Platform
- AWS/GCP/Azure

### Website Deployment

The SolidJS website can be deployed to:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.p

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
