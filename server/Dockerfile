FROM node:20-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files
COPY --from=builder /app/dist ./dist

# Copy environment variables file
COPY .env.example ./.env

# Expose the API port
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
