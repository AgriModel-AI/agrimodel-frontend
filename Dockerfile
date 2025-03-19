FROM node:22.12.0-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy-peer-deps
RUN npm run install:legacy

# Copy the rest of the project files
COPY . .

# Expose the app's port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
