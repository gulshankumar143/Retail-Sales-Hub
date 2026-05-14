FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy project files
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=7000

# Expose backend port
EXPOSE 7000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7000 || exit 1

# Start server
CMD ["node", "src/index.js"]