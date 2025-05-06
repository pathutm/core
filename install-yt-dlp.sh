#!/bin/bash

# Install yt-dlp via pip (Python package manager)
curl -sSL https://yt-dl.org/downloads/latest/yt-dlp.tar.gz | tar xz
chmod +x yt-dlp
mv yt-dlp /usr/local/bin/
