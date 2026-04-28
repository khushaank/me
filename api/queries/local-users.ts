import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDb } from "./connection";
import { localUsers } from "@db/schema";
import type { LocalUser } from "@db/schema";

export async function findLocalUserByUsername(
  username: string,
): Promise<LocalUser | undefined> {
  const rows = await getDb()
    .select()
    .from(localUsers)
    .where(eq(localUsers.username, username))
    .limit(1);
  return rows.at(0);
}

export async function findLocalUserById(
  id: number,
): Promise<LocalUser | undefined> {
  const rows = await getDb()
    .select()
    .from(localUsers)
    .where(eq(localUsers.id, id))
    .limit(1);
  return rows.at(0);
}

export async function createLocalUser(data: {
  username: string;
  password: string;
  name?: string;
  role?: string;
}): Promise<LocalUser> {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const result = await getDb()
    .insert(localUsers)
    .values({
      username: data.username,
      passwordHash,
      name: data.name ?? data.username,
      role: (data.role ?? "user") as "user" | "admin",
    })
    .$returningId();
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create local user");
  const user = await findLocalUserById(id);
  if (!user) throw new Error("Failed to fetch created user");
  return user;
}

export async function verifyLocalPassword(
  user: LocalUser,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateLocalUser(
  id: number,
  data: {
    username?: string;
    password?: string;
    name?: string;
  },
): Promise<LocalUser> {
  const updateData: Partial<typeof localUsers.$inferInsert> = {};
  if (data.username !== undefined) updateData.username = data.username;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.password !== undefined) {
    updateData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  await getDb()
    .update(localUsers)
    .set(updateData)
    .where(eq(localUsers.id, id));

  const user = await findLocalUserById(id);
  if (!user) throw new Error("User not found after update");
  return user;
}

export async function seedAdminIfNoneExists(): Promise<void> {
  const existing = await getDb().select().from(localUsers).limit(1);
  if (existing.length === 0) {
    await createLocalUser({
      username: "admin",
      password: "123456",
      name: "Admin",
      role: "admin",
    });
    console.log("[seed] Created default admin user (admin / 123456)");
  }
}
