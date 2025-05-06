#!/bin/bash

# Update package list and install necessary dependencies
apt-get update
apt-get install -y python3-pip
pip3 install yt-dlp
