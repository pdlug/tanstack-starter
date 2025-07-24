import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createPostForUser, getPostsForUser } from "@/db/posts";
import { authMiddleware, dbMiddleware } from "@/lib/auth/middleware";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware, dbMiddleware])
  .validator(postSchema)
  .handler(async ({ data: post, context: { db, authSession } }) => {
    await createPostForUser(db, authSession.user.id, post);
  });

const getPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware, dbMiddleware])
  .handler(async ({ context: { db, authSession } }) => {
    return getPostsForUser(db, authSession.user.id);
  });

export const Route = createFileRoute("/_authed/home")({
  component: Home,
  loader: async () => {
    const posts = await getPosts();
    return { posts };
  },
});

function Home() {
  const { authSession } = Route.useRouteContext();
  const { posts } = Route.useLoaderData();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome {authSession.user.email}</h1>
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
