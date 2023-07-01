declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      NODE_ENV: string;
      SEND_CONFIRMATION_EMAIL_QUEUE: string;
      JWT_SECRET: string;
      COUNT_API_BASE_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
