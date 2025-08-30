import { eq } from "drizzle-orm";

import type { Result } from "@/lib/errors";
import { DatabaseError } from "@/lib/errors";

import type { DB } from "./db";
import type { NewPost, Post } from "./schema";
import { posts } from "./schema";

export async function getPostsForUser(
  db: DB,
  userId: string,
): Promise<Result<Post[], DatabaseError>> {
  try {
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId));
    return { success: true, data: userPosts };
  } catch (error) {
    return {
      success: false,
      error: new DatabaseError("Failed to retrieve posts", { cause: error }),
    };
  }
}

export async function createPostForUser(
  db: DB,
  userId: string,
  post: Omit<NewPost, "userId">,
): Promise<Result<Post, DatabaseError>> {
  try {
    const [newPost] = await db
      .insert(posts)
      .values({
        title: post.title,
        content: post.content,
        userId,
      })
      .returning();

    if (!newPost) {
      return {
        success: false,
        error: new DatabaseError("Failed to create post - no data returned"),
      };
    }

    return { success: true, data: newPost };
  } catch (error) {
    return {
      success: false,
      error: new DatabaseError("Failed to create post", { cause: error }),
    };
  }
}
