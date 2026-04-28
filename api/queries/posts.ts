import { eq, asc, sql } from "drizzle-orm";
import { getDb } from "./connection";
import { posts } from "@db/schema";
import type { InsertPost } from "@db/schema";

export async function findAllPosts() {
  return getDb()
    .select()
    .from(posts)
    .orderBy(asc(posts.sortOrder));
}

export async function findPostById(id: number) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function createPost(data: InsertPost) {
  const result = await getDb()
    .insert(posts)
    .values(data)
    .$returningId();
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create post");
  return findPostById(id);
}

export async function updatePost(id: number, data: Partial<InsertPost>) {
  await getDb()
    .update(posts)
    .set(data)
    .where(eq(posts.id, id));
  return findPostById(id);
}

export async function deletePost(id: number) {
  await getDb()
    .delete(posts)
    .where(eq(posts.id, id));
}

export async function seedPostsIfEmpty(postsData: InsertPost[]) {
  const existing = await findAllPosts();
  if (existing.length > 0) return { seeded: false, count: existing.length };

  for (const post of postsData) {
    await getDb().insert(posts).values(post);
  }
  return { seeded: true, count: postsData.length };
}

export async function incrementClicks(id: number) {
  await getDb()
    .update(posts)
    .set({ clicksCount: sql`${posts.clicksCount} + 1` })
    .where(eq(posts.id, id));
}

