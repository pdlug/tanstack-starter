import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { PostFormValues } from "@/components/PostForm";
import { PostForm } from "@/components/PostForm";
import { createPostForUser, getPostsForUser } from "@/db/posts";
import type { Post } from "@/db/schema";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  DatabaseError,
  PostCreationError,
  UnauthorizedError,
} from "@/lib/errors";
import { dbMiddleware } from "@/lib/middleware";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware, dbMiddleware])
  .inputValidator(postSchema)
  .handler(async ({ data: post, context }) => {
    if (!context.authSession || !context.authSession.user?.id) {
      throw new UnauthorizedError("Authentication required");
    }
    if (!context.db) {
      throw new DatabaseError("Database connection unavailable");
    }

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
    if (!context.authSession || !context.authSession.user?.id) {
      throw new UnauthorizedError("Authentication required");
    }
    if (!context.db) {
      throw new DatabaseError("Database connection unavailable");
    }

    const result = await getPostsForUser(
      context.db,
      context.authSession.user.id,
    );

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  });

// Zero-arg consumer wrapper to keep callsites clean
const fetchPosts = () =>
  getPosts({ data: undefined } as unknown as Parameters<typeof getPosts>[0]);

export const Route = createFileRoute("/_authed/home")({
  component: Home,
  loader: async () => {
    const posts = (await fetchPosts()) as Post[];
    return { posts };
  },
});

const createPostFetch = (data: PostFormValues) =>
  createPost({ data } as Parameters<typeof createPost>[0]);

function Home() {
  const { authSession } = Route.useRouteContext();
  const { posts } = Route.useLoaderData();

  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (_options: { data: PostFormValues }) =>
      createPostFetch(_options.data),
    onSuccess: () => {
      void router.invalidate();
    },
  });

  async function handlePostSubmit(data: PostFormValues) {
    try {
      await mutateAsync({ data });
    } catch (error) {
      throw new PostCreationError("Failed to submit post", { cause: error });
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
