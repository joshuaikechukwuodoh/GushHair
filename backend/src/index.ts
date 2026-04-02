import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./routers/_app";
import { createContext } from "./context";
import { cors } from "hono/cors";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./lib/uploadthing";

const app = new Hono();

// Middleware
app.use("*", cors());

// tRPC
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

// UploadThing route
const handlers = createRouteHandler({ router: uploadRouter });
app.all("/api/uploadthing", (c) => handlers(c.req.raw));

app.get("/", (c) => {
  return c.text("Backend is running!");
});

export default {
  port: 3000,
  fetch: app.fetch,
};
