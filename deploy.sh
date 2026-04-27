#!/bin/bash

echo "Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "Error: .env.production file not found"
    exit 1
fi

# Load environment variables
export $(cat .env.production | xargs)

# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

echo "Deployment complete. Check logs with: docker-compose -f docker-compose.prod.yml logs -f"
