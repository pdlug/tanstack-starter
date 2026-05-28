import "@tanstack/react-start/server-only";

import { eq } from "drizzle-orm";

import { DatabaseError } from "@/lib/errors";
import { safe } from "@/lib/result";

import type { DB } from "./db";
import type { NewPost } from "./schema";
import { posts } from "./schema";

export function getPostsForUser(db: DB, userId: string) {
  return safe(
    () => db.select().from(posts).where(eq(posts.userId, userId)),
    (cause) => new DatabaseError("Failed to retrieve posts", { cause }),
  );
}

export function createPostForUser(
  db: DB,
  userId: string,
  post: Omit<NewPost, "userId">,
) {
  return safe(
    async () => {
      const [created] = await db
        .insert(posts)
        .values({ ...post, userId })
        .returning();
      if (!created) throw new Error("insert returned no rows");
      return created;
    },
    (cause) => new DatabaseError("Failed to create post", { cause }),
  );
}
