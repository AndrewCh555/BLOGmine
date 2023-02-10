import { Storage } from '@google-cloud/storage';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config();

export const getGoogleStorage = (): Storage => {
  const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);

  const config = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    credentials,
  };
  return new Storage(config);
};

export const getBucketName = (): string => {
  return process.env.FIREBASE_BUCKET_NAME;
};
