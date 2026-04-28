import { eq } from "drizzle-orm";
import { getDb } from "./connection";
import { siteSettings } from "@db/schema";
import type { InsertSiteSetting } from "@db/schema";

export async function getSiteSettings() {
  const rows = await getDb()
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  return rows.at(0) ?? null;
}

export async function upsertSiteSettings(data: Partial<InsertSiteSetting>) {
  const existing = await getSiteSettings();
  if (existing) {
    await getDb()
      .update(siteSettings)
      .set(data)
      .where(eq(siteSettings.id, 1));
  } else {
    await getDb()
      .insert(siteSettings)
      .values({ ...data, id: 1 });
  }
  return getSiteSettings();
}
