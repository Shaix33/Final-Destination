# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build production assets
RUN npm run build

# Expose port
EXPOSE 5173

# Run dev server (or serve built assets via nginx for prod)
CMD ["npm", "run", "dev", "--", "--host"]
