FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file first
COPY package*.json ./

# Install deps
RUN npm install

# Copy rest of app
COPY . .

# Expose dev server port
EXPOSE 5173

# Start Vite
CMD ["npm", "run", "dev"]
