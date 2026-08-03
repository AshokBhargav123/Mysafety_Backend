# Use Node.js 22 LTS
FROM node:22

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Compile TypeScript
RUN npm run build

# Expose application port
EXPOSE 5000

# Start application
CMD ["npm", "start"]