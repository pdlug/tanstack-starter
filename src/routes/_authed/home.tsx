import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";

import { PostForm, type PostFormValues } from "@/components/post-form";
import { createPostForUser, getPostsForUser } from "@/db/posts";
import { authMiddleware } from "@/lib/auth/middleware";
import { dbMiddleware } from "@/lib/middleware";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePostSubmit(data: PostFormValues) {
    setIsSubmitting(true);
    try {
      await createPost({ data });
      // Refresh the page to show the new post
      globalThis.location.reload();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome {authSession.user.email}</h1>
      </div>

      <div className="mb-8">
        <PostForm onSubmit={handlePostSubmit} isSubmitting={isSubmitting} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Posts</h2>
        {posts.length === 0 ?
          <p className="text-gray-500">
            No posts yet. Create your first post above!
          </p>
        : posts.map((post) => (
            <div key={post.id} className="rounded-lg border p-4">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="whitespace-pre-wrap text-gray-600">
                {post.content}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
