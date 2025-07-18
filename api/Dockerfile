# Use official Node.js 18 LTS slim image
FROM node:18-slim

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy all backend source code
COPY . .

# Optional: copy env file if needed
# COPY .env .

# Expose port
EXPOSE 5000

# Start the app (adjust if entry point is different)
CMD ["node", "index.js"]
