# Use an appropriate base image
FROM node:16

# Install required dependencies for yt-dlp
RUN apt-get update && apt-get install -y \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp via pip
RUN pip3 install yt-dlp

# Set the working directory
WORKDIR /opt/render/project/src

# Copy the current directory contents into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Command to run your app
CMD ["node", "index.js"]
