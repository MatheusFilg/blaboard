import { Elysia } from "elysia";
import { auth } from "@blaboard/auth";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
	.derive(async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		return {
			user: session?.user ?? null,
			session: session?.session ?? null,
		};
	})
	.macro(({ onBeforeHandle }) => ({
		isAuthenticated(enabled: boolean) {
			if (!enabled) return;

			onBeforeHandle(
				({ user, error }: { user: unknown; error: (status: number, body: { message: string }) => Response }) => {
					if (!user) {
						return error(401, {
							message: "Unauthorized - Authentication required",
						});
					}
				},
			);
		},
	}));
