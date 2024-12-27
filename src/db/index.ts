import { type DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { todos } from "./schema";

// Define types for database operations
type TodoInsert = typeof todos.$inferInsert;
type TodoSelect = typeof todos.$inferSelect;

export const todoDb = {
  // Fetch all todos
  getAll: async (db: DrizzleD1Database): Promise<TodoSelect[]> => {
    try {
      return await db.select().from(todos).all();
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw new Error("Could not fetch todos");
    }
  },

  // Create a new todo
  create: async (
    db: DrizzleD1Database,
    data: {
      title: string;
      description: string;
      created_at: string;
      completed?: boolean;
    }
  ): Promise<number> => {
    try {
      const result = await db
        .insert(todos)
        .values({
          title: data.title,
          description: data.description,
          created_at: data.created_at,
          completed: data.completed ?? false,
        })
        .returning()
        .get();

      console.log("Created todo:", result);
      return result.id;
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw new Error("Could not create todo");
    }
  },

  // Update an existing todo
  update: async (
    db: DrizzleD1Database,
    id: number,
    data: Partial<TodoInsert>
  ): Promise<TodoSelect | undefined> => {
    try {
      const updatedTodo = await db
        .update(todos)
        .set(data)
        .where(eq(todos.id, id))
        .returning()
        .get();

      if (!updatedTodo) {
        console.warn("Todo not found for update:", id);
      } else {
        console.log("Updated todo:", updatedTodo);
      }
      return updatedTodo;
    } catch (error) {
      console.error("Failed to update todo:", error);
      throw new Error("Could not update todo");
    }
  },

  // Delete a todo
  delete: async (
    db: DrizzleD1Database,
    id: number
  ): Promise<TodoSelect | undefined> => {
    try {
      const deletedTodo = await db
        .delete(todos)
        .where(eq(todos.id, id))
        .returning()
        .get();

      if (!deletedTodo) {
        console.warn("Todo not found for deletion:", id);
      } else {
        console.log("Deleted todo:", deletedTodo);
      }
      return deletedTodo;
    } catch (error) {
      console.error("Failed to delete todo:", error);
      throw new Error("Could not delete todo");
    }
  },

  // Toggle the completion status of a todo
  toggleComplete: async (
    db: DrizzleD1Database,
    id: number
  ): Promise<TodoSelect | undefined> => {
    try {
      const todo = await db.select().from(todos).where(eq(todos.id, id)).get();

      if (!todo) {
        console.warn("Todo not found for toggleComplete:", id);
        return undefined;
      }

      const updatedTodo = await db
        .update(todos)
        .set({ completed: !todo.completed })
        .where(eq(todos.id, id))
        .returning()
        .get();

      console.log("Toggled completion status for todo:", updatedTodo);
      return updatedTodo;
    } catch (error) {
      console.error("Failed to toggle completion status:", error);
      throw new Error("Could not toggle completion status");
    }
  },
};
