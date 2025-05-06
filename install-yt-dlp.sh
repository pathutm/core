#!/bin/bash

# Ensure that Python is installed
apt-get update
apt-get install -y python3 python3-pip

# Install yt-dlp via pip
pip3 install -U yt-dlp
