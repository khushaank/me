import { eq, asc } from "drizzle-orm";
import { getDb } from "./connection";
import { cvEntries } from "@db/schema";
import type { InsertCvEntry } from "@db/schema";

export async function findAllCvEntries() {
  return getDb()
    .select()
    .from(cvEntries)
    .orderBy(asc(cvEntries.sortOrder));
}

export async function findCvEntryById(id: number) {
  const rows = await getDb()
    .select()
    .from(cvEntries)
    .where(eq(cvEntries.id, id))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function createCvEntry(data: InsertCvEntry) {
  const result = await getDb()
    .insert(cvEntries)
    .values(data)
    .$returningId();
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create CV entry");
  return findCvEntryById(id);
}

export async function updateCvEntry(id: number, data: Partial<InsertCvEntry>) {
  await getDb()
    .update(cvEntries)
    .set(data)
    .where(eq(cvEntries.id, id));
  return findCvEntryById(id);
}

export async function deleteCvEntry(id: number) {
  await getDb()
    .delete(cvEntries)
    .where(eq(cvEntries.id, id));
}
