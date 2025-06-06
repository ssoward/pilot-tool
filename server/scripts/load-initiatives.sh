#!/bin/bash

# Script to load initiatives from JSON file into the database
# Run this from the server directory

echo "Loading initiatives from JSON file..."

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the server directory"
    exit 1
fi

# Check if the JSON file exists
if [ ! -f "data/initiatives.json" ]; then
    echo "Error: initiatives.json file not found in data/ directory"
    exit 1
fi

# Make a POST request to load the initiatives
curl -X POST \
  http://localhost:3001/api/initiatives/load-from-json \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"

if [ $? -eq 0 ]; then
    echo "Successfully loaded initiatives from JSON file"
else
    echo "Error loading initiatives from JSON file"
    exit 1
fi
