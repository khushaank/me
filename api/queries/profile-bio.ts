import { eq } from "drizzle-orm";
import { getDb } from "./connection";
import { profileBio } from "@db/schema";
import type { InsertProfileBio } from "@db/schema";

export async function getProfileBio() {
  const rows = await getDb()
    .select()
    .from(profileBio)
    .where(eq(profileBio.id, 1))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function upsertProfileBio(data: Partial<InsertProfileBio>) {
  const existing = await getProfileBio();
  if (existing) {
    await getDb()
      .update(profileBio)
      .set(data)
      .where(eq(profileBio.id, 1));
  } else {
    await getDb()
      .insert(profileBio)
      .values({ ...data, id: 1, zhText: "", enText: "" });
  }
  return getProfileBio();
}
