import { eq, desc } from "drizzle-orm";
import { getDb } from "./connection";
import { contacts } from "@db/schema";
import type { InsertContact } from "@db/schema";

export async function findAllContacts() {
  return getDb()
    .select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt));
}

export async function findContactById(id: number) {
  const rows = await getDb()
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function createContact(data: InsertContact) {
  const result = await getDb()
    .insert(contacts)
    .values(data)
    .$returningId();
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create contact");
  return findContactById(id);
}

export async function deleteContact(id: number) {
  await getDb()
    .delete(contacts)
    .where(eq(contacts.id, id));
}
