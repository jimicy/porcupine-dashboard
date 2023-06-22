import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});

export const stdSurveillanceRouter = createTRPCRouter({
  getAll: publicProcedure.subscription(({ ctx }) => {
    return ctx.prisma.std_surveillance.findMany();
  }),
});
