import { env } from "@blaboard/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authMiddleware } from "./middleware/auth.middleware";
import { columnsRouter } from "./modules/columns/router";
import { tasksRouter } from "./modules/tasks/router";
import { authPlugin } from "./plugins/auth.plugin";

const app = new Elysia()
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(authPlugin)
	.use(authMiddleware)
	.get("/", () => ({ message: "API is running" }))
	.use(columnsRouter)
	.use(tasksRouter)
	.listen(env.PORT, () => {
		console.log(`Server is running on http://localhost:${env.PORT}`);
	});

export type App = typeof app;
