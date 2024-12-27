import type { APIRoute } from "astro";
import { todoDb } from "../../../db";

export const prerender = false;

// Update
export const PUT: APIRoute = async ({ request, params, locals }) => {
  try {
    const { DB } = locals;
    if (!params.id)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    const id = parseInt(params.id);
    await todoDb.update(DB, id, { title, description });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Toggle
export const PATCH: APIRoute = async ({ params, locals }) => {
  try {
    const { DB } = locals;

    if (!params.id)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );

    const id = parseInt(params.id);
    await todoDb.toggleComplete(DB, id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Delete
export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const { DB } = locals;

    if (!params.id)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );

    const id = parseInt(params.id!);
    await todoDb.delete(DB, id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
