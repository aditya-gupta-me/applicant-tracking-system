declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            DATABASE_URL: string;
            RESEND_EMAIL_API: string;
            BETTER_AUTH_SECRET: string;
            BETTER_AUTH_URL: string;
            POSTGRES_DB: string;
            POSTGRES_DB: string;
            POSTGRES_DB: string;
            WEB_URL: string;
            NODE_ENV: 'development', 'production', 'test';
        }
    }
}

export {};