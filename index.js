import express from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { uploadToS3 } from './utils/uploadToS3.js';

dotenv.config();  // Load environment variables

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Create a 'downloads' folder if not exists
const downloadsFolder = path.resolve('./downloads');
if (!fs.existsSync(downloadsFolder)) {
  fs.mkdirSync(downloadsFolder);
}

// Function to download video using yt-dlp
const downloadVideo = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = `yt-dlp -f best -o "${outputPath}" "${url}"`;

    console.log(`Running command: ${command}`); // Add log to show the command being run

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Download error: ${stderr}`);
        return reject(error);
      }
      console.log(`Download successful: ${stdout}`); // Log successful download
      resolve();
    });
  });
};

app.post('/upload', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    const videoId = uuidv4();
    const outputPath = path.join(downloadsFolder, `${videoId}.mp4`);

    // Download the video
    console.log(`Starting video download for URL: ${url}`);
    await downloadVideo(url, outputPath);

    // Check if video exists locally
    console.log(`Downloaded video at: ${outputPath}`);
    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({ error: 'Video file not found after download' });
    }

    // Upload video to S3
    console.log('Uploading video to S3...');
    const s3Url = await uploadToS3(outputPath);

    // Optional: delete local file after upload
    fs.unlinkSync(outputPath);
    console.log(`Local file deleted: ${outputPath}`);

    res.json({
      message: 'Uploaded successfully',
      s3Url
    });
  } catch (err) {
    console.error('Error occurred during processing:', err);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
