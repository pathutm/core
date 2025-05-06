
import { exec } from 'child_process';
import path from 'path';
import { randomUUID } from 'crypto';

export const downloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    const filename = `video-${randomUUID()}.mp4`;
    const outputPath = path.resolve(`./${filename}`);

    const command = `yt-dlp -f best -o "${outputPath}" --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "${url}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`Download error: ${stderr}`);
      }
      resolve(outputPath);
    });
  });
};
