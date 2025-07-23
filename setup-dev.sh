#!/bin/bash

# Auto Pool Pump Development Setup Script

echo "🏊‍♂️ Setting up Auto Pool Pump development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build shared package first
echo "🔧 Building shared package..."
cd packages/shared && bun run build && cd ../..

# Create environment files if they don't exist
if [ ! -f "apps/api/.env" ]; then
    echo "⚙️ Creating API environment file..."
    cp apps/api/.env.example apps/api/.env
    echo "Please edit apps/api/.env with your configuration"
fi

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start development:"
echo "  bun dev              # Start all services"
echo "  bun run dev:api      # Start API only"
echo "  bun run dev:web      # Start website only"
echo ""
echo "🔗 Services will be available at:"
echo "  API:     http://localhost:8080"
echo "  Website: http://localhost:3000"
