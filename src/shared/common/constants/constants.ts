//#defaultPort
export const defaultPort = 8001;

//#AuthValidation
export const minLengthAuthValidation = 8;

//#AuthVerification
export const minLengthAuthVerification = 4;

export const authConstants = {
  secret: process.env.AUTH_SECRET || 'SECRET',
  expiresIn: process.env.AUTH_EXPIRES_IN || '1d',
  google: {
    clientID:
      process.env.AUTH_GOOGLE_CLIENT_ID ||
      '403751639889-gcavhasv088bov14n2s70dht40d98as2.apps.googleusercontent.com',
    clientSecret:
      process.env.AUTH_GOOGLE_CLIENT_SECRET ||
      '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',
    callbackURL:
      process.env.AUTH_GOOGLE_CALLBACK_URL ||
      'http://localhost:8080/auth/google/redirect',
  },
   recovery: {
    expiresIn: process.env.AUTH_RECOVERY_EXPIRES_IN || '1h',
    url:
      process.env.AUTH_RECOVERY_URL ||
      'http://localhost:3000/auth/recovery?token=',
    cmsUrl:
      process.env.AUTH_RECOVERY_CMS_URL ||
      'http://localhost:3001/auth/recovery?token=',
  },
};
