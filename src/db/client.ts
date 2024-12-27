import { type AnyD1Database, drizzle, DrizzleD1Database } from "drizzle-orm/d1";

export const getDBClient = async (
  DB: AnyD1Database
): Promise<DrizzleD1Database> => {
  let drizzleInstance = drizzle(DB);
  return drizzleInstance;
};
