import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  created_at: text("created_at").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});
