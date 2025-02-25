#!/bin/bash

# Get version to rollback to
VERSION=$1

if [ -z "$VERSION" ]
then
  echo "Please provide version to rollback to"
  exit 1
 fi

# Checkout version
git checkout $VERSION

# Install dependencies
npm ci

# Build
npm run build

# Deploy
echo "Rolling back to version $VERSION..."
# Add deployment commands here

echo "Rollback complete!"