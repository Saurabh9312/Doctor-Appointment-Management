#!/usr/bin/env bash
# Exit on error
set -e

echo "Building the project..."

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
python -m pip install -r backend/requirements.txt

# Run migrations
echo "Running migrations..."
python backend/manage.py migrate

# Collect static files
echo "Collecting static files..."
python backend/manage.py collectstatic --noinput

echo "Build completed successfully!"
