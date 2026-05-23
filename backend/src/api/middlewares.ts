import { defineMiddlewares } from "@medusajs/framework/http"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})

export default defineMiddlewares({
  routes: [
    {
      matcher: "*",
      middlewares: [helmet() as any],
    },
    {
      matcher: "/admin/auth/*",
      middlewares: [authRateLimit as any],
    },
    {
      matcher: "/store/auth/*",
      middlewares: [authRateLimit as any],
    },
  ],
})
