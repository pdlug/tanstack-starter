import { eq } from "drizzle-orm";

import type { DB } from "./db";
import { type NewPost, posts } from "./schema";

export function getPostsForUser(db: DB, userId: string) {
  return db.select().from(posts).where(eq(posts.userId, userId));
}

export function createPostForUser(
  db: DB,
  userId: string,
  post: Omit<NewPost, "userId">,
) {
  return db.insert(posts).values({
    title: post.title,
    content: post.content,
    userId,
  });
}
