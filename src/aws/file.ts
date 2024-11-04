import { S3Client } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
import { config } from '../config';

export const s3 = new S3({
  accessKeyId: config.aws_key_id,
  secretAccessKey: config.aws_secretAccessKey,
  region: config.aws_region,
});

export const ss3 = new S3Client({
  region: config.aws_region,
  credentials: {
    accessKeyId: config.aws_key_id,
    secretAccessKey: config.aws_secretAccessKey,
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
  Bucket: config.aws_bucket,
  Key: '',
  Body: null,
};

export const getFileParams: iGetFileParams = {
  Bucket: config.aws_bucket,
  Key: '',
  Expires: 0,
};
