# Use official Node.js 22.12.0 base image
FROM node:22.12.0-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies using npm
RUN npm install --omit=dev --force

# Copy the entire project (excluding files in .dockerignore)
COPY . .

# Build the React application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app using a static server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
