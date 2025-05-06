# Use official Node.js image from Docker Hub
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install yt-dlp for YouTube video downloading
RUN apt-get update && apt-get install -y yt-dlp

# Copy the rest of the application
COPY . .

# Expose the port that your app listens on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
