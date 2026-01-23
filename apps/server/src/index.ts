import { env } from "@blaboard/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authMiddleware } from "./middleware/auth.middleware";
import { authPlugin } from "./plugins/auth.plugin";

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
