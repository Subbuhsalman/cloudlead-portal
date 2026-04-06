import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import * as AWS from "@aws-sdk/client-s3";
import { getExtensionFromMimetype } from "../Utility/FileUtils";
const multer = require('multer')
const multerS3 = require('multer-s3')

export const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  // dialect: process.env.DB_TYPE as Dialect,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiry: process.env.JWT_EXPIRES_IN || '7d',
  saltRound: 3,
};
export const smtpConfig = {
  host:process.env.MAIL_ENVIRONMENT === 'local' ? process.env.MAILCATCHER_HOST : process.env.SMTP_HOST,
  port: process.env.MAIL_ENVIRONMENT === 'local' ? Number(process.env.MAILCATCHER_SMTP_PORT) : Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
  }
}
export const emailConfig = {
  emailService: process.env.EMAIL_SERVICE,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM,
};

export const otpConfig = {
  otpExpiry: process.env.OTP_EXPIRY_MIN,
  otpSecret: process.env.OTP_SECRET,
};

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_ID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  serviceSid: process.env.TWILIO_SERVICE_SID
}

export const s3 = new AWS.S3({
  region: process.env.AWS_DEFAULT_REGION,
});

export const uploadS3 =  multer({
  limits: { fieldSize: 20 * 1024 * 1024 },
  storage: multerS3({
    s3: s3,
    acl: "public-read", // Ensure the file is publicly accessible
    bucket: process.env.AWS_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const folderName = file.fieldname || "default-folder"; // Optional folder field in the request body
      //const fileName = `${folderName}/${Date.now()}-${file.originalname}`;
      const fileName = `${folderName}/${Date.now()}.${getExtensionFromMimetype(file.mimetype)}`;
      cb(null, fileName);
    }
  })
})

export const openAIConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
};

const config = {
  db: dbConfig,
  jwt: jwtConfig,
  smtp: smtpConfig,
  email: emailConfig,
  otp: otpConfig,
  twilio: twilioConfig,
  s3,
  uploadS3,
  openAI: openAIConfig,
};

export default config;