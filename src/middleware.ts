import { defineMiddleware } from "astro:middleware";
import { getDBClient } from "./db/client";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.DB = await getDBClient(context.locals.runtime.env.DB);
  return next();
});
