# Use Node.js 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variable for the port (Hugging Face uses 7860 by default)
ENV PORT=7860

# Expose the port
EXPOSE 7860

# Start the server
CMD ["node", "server.js"]
