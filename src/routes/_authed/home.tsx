import {
  createFileRoute,
  type ErrorComponentProps,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { PostForm } from "@/components/PostForm";
import { createPostForUser, getPostsForUser } from "@/db/posts";
import type { Post } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/middleware";
import { PostCreationError } from "@/lib/errors";
import { dbMiddleware } from "@/lib/middleware";
import { type PostFormValues, postSchema } from "@/lib/validation";

const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware, dbMiddleware])
  .inputValidator(postSchema)
  .handler(async ({ data: post, context }) => {
    const result = await createPostForUser(
      context.db,
      context.authSession.user.id,
      post,
    );

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  });

const getPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware, dbMiddleware])
  .handler(async ({ context }): Promise<Post[]> => {
    const result = await getPostsForUser(
      context.db,
      context.authSession.user.id,
    );

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  });

export const Route = createFileRoute("/_authed/home")({
  component: Home,
  loader: async () => {
    const posts = await getPosts();
    return { posts };
  },
  pendingComponent: HomePending,
  errorComponent: HomeErrorBoundary,
});

function Home() {
  const { authSession } = Route.useRouteContext();
  const { posts } = Route.useLoaderData();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handlePostSubmit(data: PostFormValues) {
    setIsPending(true);
    try {
      await createPost({ data });
      void router.invalidate();
    } catch (error) {
      throw new PostCreationError("Failed to submit post", { cause: error });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome {authSession.user.email}</h1>
      </div>

      <div className="mb-8">
        <PostForm onSubmit={handlePostSubmit} isSubmitting={isPending} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Posts</h2>
        {posts.length === 0 ?
          <p className="text-gray-500">
            No posts yet. Create your first post above!
          </p>
        : posts.map((post: Post) => (
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

function HomePending() {
  return (
    <div className="mx-auto max-w-4xl p-8" aria-busy="true">
      <div className="mb-8 h-9 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 space-y-3 rounded-lg border p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-28 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="space-y-4">
        <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function HomeErrorBoundary(props: ErrorComponentProps) {
  return <DefaultCatchBoundary {...props} />;
}
