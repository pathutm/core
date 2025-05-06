import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const s3 = new S3Client({
  region: process.env.AWS_REGION,  // AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // AWS Access Key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY  // AWS Secret Key
  }
});

export const uploadToS3 = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    console.log(`Uploading to S3 bucket: ${process.env.S3_BUCKET_NAME}`);  // Debug log to ensure bucket name is correct
    console.log(`Uploading file: ${filePath}`);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,  // Ensure this points to the correct bucket from the .env file
      Key: `videos/${fileName}`,
      Body: fileContent,
      ContentType: 'video/mp4'
      // Removed ACL: 'public-read'
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const s3Url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log(`File uploaded to S3: ${s3Url}`);
    return s3Url;
  } catch (err) {
    console.error('S3 upload error:', err);  // Log the error
    throw new Error('Failed to upload video to S3');
  }
};
