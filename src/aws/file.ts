import { S3Client } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';

export const s3 = new S3({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: import.meta.env.VITE_AWS_REGION,
});

export const ss3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

type iFileParams = {
  Bucket: string;
  Key: string;
  Body: any;
};

type iGetFileParams = {
  Bucket: string;
  Key: string;
  Expires: number;
};

export const fileParams: iFileParams = {
  Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
  Key: '',
  Body: null,
};

export const getFileParams: iGetFileParams = {
  Bucket: import.meta.env.VITE_AWS_S3_BUCKET_NAME,
  Key: '',
  Expires: 0,
};
