"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVarse = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariable = ["PORT",
        "DB_URL",
        "NODE_ENV",
        "JWT_ACCES_SECRET",
        "JWT_ACCES_EXPIRE",
        "BCRYPT_SALT_ROUNDE",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CLIENT_ID",
        "EXPRESS_SESSION_SECRECT",
        "GOOGLE_CALL_BACK_URL",
        "FRONT_END_URL",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
        "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_FORM",
    ];
    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`missing required environment variable ${key}`);
        }
    });
    return {
        PORT: Number(process.env.PORT),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUNDE: process.env.BCRYPT_SALT_ROUNDE,
        JWT_ACCES_EXPIRE: process.env.JWT_ACCES_EXPIRE,
        JWT_ACCES_SECRET: process.env.JWT_ACCES_SECRET,
        CLOUDINARY: {
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        },
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        EXPRESS_SESSION_SECRECT: process.env.EXPRESS_SESSION_SECRECT,
        GOOGLE_CALL_BACK_URL: process.env.GOOGLE_CALL_BACK_URL,
        FRONT_END_URL: process.env.FRONT_END_URL,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        EMAIL_SENDER: {
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_FORM: process.env.SMTP_FORM,
        }
    };
};
exports.envVarse = loadEnvVariables();
