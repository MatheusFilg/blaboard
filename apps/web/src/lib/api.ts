import { treaty } from "@elysiajs/eden";
import type { App } from "server/src/index";
import { env } from "@blaboard/env/web";

export const api = treaty<App>(env.NEXT_PUBLIC_SERVER_URL, {
	fetch: {
		credentials: "include",
	},
});
