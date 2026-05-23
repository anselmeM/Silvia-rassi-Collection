import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { validateEnv } from './src/lib/env-schema'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const env = validateEnv()

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,
    http: {
      storeCors: env.STORE_CORS,
      adminCors: env.ADMIN_CORS,
      authCors: env.AUTH_CORS,
      jwtSecret: env.JWT_SECRET,
      cookieSecret: env.COOKIE_SECRET,
    }
  },
  modules: [
    ...(env.STRIPE_API_KEY ? [
      {
        resolve: "@medusajs/medusa/payment",
        options: {
          providers: [
            {
              resolve: "@medusajs/payment-stripe",
              id: "stripe",
              options: {
                apiKey: env.STRIPE_API_KEY,
                webhookSecret: env.STRIPE_WEBHOOK_SECRET,
              },
            },
          ],
        },
      },
    ] : []),
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          env.S3_URL ? {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: env.S3_URL,
              access_key_id: env.S3_ACCESS_KEY_ID,
              secret_access_key: env.S3_SECRET_ACCESS_KEY,
              region: env.S3_REGION,
              bucket: env.S3_BUCKET,
              endpoint: env.S3_ENDPOINT,
            },
          } : {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: "http://localhost:9000",
            },
          },
        ],
      },
    },
    ...(env.REDIS_URL && process.env.USE_REDIS === 'true' ? [
      {
        resolve: "@medusajs/medusa/cache-redis",
        options: { redisUrl: env.REDIS_URL },
      },
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: { redisUrl: env.REDIS_URL },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: { redisUrl: env.REDIS_URL },
      },
    ] : []),
  ],
})
