import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: text().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
});
