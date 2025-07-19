import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { connectToDB } from "@/db/db";
import { posts } from "@/db/schema";
import { getBindings } from "@/utils/bindings";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const createPost = createServerFn({ method: "GET" })
  .validator(postSchema)
  .handler(async ({ data: post }) => {
    const env = getBindings();
    const db = connectToDB(env.DB);
    await db.insert(posts).values({
      id: crypto.randomUUID(),
      title: post.title,
      content: post.content,
    });
  });

const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const env = getBindings();
  const db = connectToDB(env.DB);
  return db.select().from(posts);
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => {
    const posts = await getPosts();
    return { posts };
  },
});

function Home() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hello World</h1>
        <div className="space-x-4">
          <a
            href="/sign-in"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            Sign In
          </a>
          <a
            href="/sign-up"
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
          >
            Sign Up
          </a>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>

      <button
        className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
        onClick={() => {
          void createPost({ data: { title: "Hello", content: "World" } });
        }}
      >
        Add Post
      </button>
    </div>
  );
}
