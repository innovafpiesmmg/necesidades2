FROM node:20-alpine

WORKDIR /app

# Install dependencies first (caching layer)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Install production dependencies only
RUN npm ci --only=production

# Create required directories
RUN mkdir -p server/database server/uploads && \
    chown -R node:node server/database server/uploads

# Switch to non-root user
USER node

# Expose only the backend port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]