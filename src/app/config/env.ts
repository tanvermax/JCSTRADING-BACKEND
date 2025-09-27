import dotenv from "dotenv"

dotenv.config();


interface EnvConfig {
    PORT: number,
    DB_URL: string,
    NODE_ENV: "devolopment" | "production",
    JWT_ACCES_SECRET: string,
    JWT_ACCES_EXPIRE: string,
    BCRYPT_SALT_ROUNDE: string,
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_API_SECRET: string
    }
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariable: string[] = ["PORT",
        "DB_URL",
        "NODE_ENV",
        "JWT_ACCES_SECRET",
        "JWT_ACCES_EXPIRE",
        "BCRYPT_SALT_ROUNDE",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET"
    ];

    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`missing required environment variable ${key}`)
        }
    })

    return {
        PORT: Number(process.env.PORT),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL!,
        NODE_ENV: process.env.NODE_ENV as "devolopment",
        BCRYPT_SALT_ROUNDE: process.env.BCRYPT_SALT_ROUNDE as string,
        JWT_ACCES_EXPIRE: process.env.JWT_ACCES_EXPIRE as string,
        JWT_ACCES_SECRET: process.env.JWT_ACCES_SECRET as string,
        CLOUDINARY: {
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        }


    }
}

export const envVarse = loadEnvVariables();
