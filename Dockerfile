# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on (default for NestJS is 3000)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
