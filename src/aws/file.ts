import { S3 } from 'aws-sdk';

export const s3 = new S3({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: import.meta.env.VITE_AWS_REGION,
});

type iFileParams = {
  Bucket: string;
  Key: string;
  Body: File | null;
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
