import { env } from "@beroboard/env/server";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authPlugin } from "./plugins/auth.plugin";
import { authMiddleware } from "./middleware/auth.middleware";

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(authPlugin)
  .use(authMiddleware)
  .get("/", () => ({ message: "API is running" }))
  .listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });

export type App = typeof app;
