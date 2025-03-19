# Use official Node.js 22.12.0 base image
FROM node:22.12.0-alpine

# set for base and all layer that inherit from it
ENV NODE_ENV production


# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev --force --frozen-lockfile --prod=false

# Copy the entire project
COPY . .

# Expose port
EXPOSE 3000

# Build the app at runtime using environment variables
CMD ["sh", "-c", "REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL npm run build && npx serve -s build -l 3000"]
