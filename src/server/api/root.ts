import {
  exampleRouter,
  stdSurveillanceRouter,
} from "y/server/api/routers/example";
import { createTRPCRouter } from "y/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  stdSurveillanceRouter: stdSurveillanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
