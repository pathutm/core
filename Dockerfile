# Use official Node.js image
FROM node:18

# Install Python and pip (needed for yt-dlp)
RUN apt-get update && \
    apt-get install -y python3 python3-pip pipx && \
    pipx install yt-dlp && \
    rm -rf /var/lib/apt/lists/*



# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
