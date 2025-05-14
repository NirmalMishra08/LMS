import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// app/api/uploadthing/route.ts
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    isDev: true
  }
});