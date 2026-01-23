import { Elysia } from "elysia";
import { auth } from "@beroboard/auth";

export const authPlugin = new Elysia({ name: "auth" }).all(
  "/api/auth/*",
  async ({ request }) => {
    return auth.handler(request);
  },
);
