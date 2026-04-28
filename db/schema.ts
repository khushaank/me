import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull(),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Local Users (username/password auth) ──────────────────────

export const localUsers = pgTable("localUsers", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull(),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// ── Blog Posts ────────────────────────────────────────────────

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  year: varchar("year", { length: 10 }).notNull(),
  image: varchar("image", { length: 500 }).notNull(),
  sortOrder: integer("sortOrder").default(0),
  clicksCount: integer("clicks_count").default(0).notNull(),
  zhTitle: varchar("zhTitle", { length: 255 }).notNull(),
  zhSubtitle: varchar("zhSubtitle", { length: 255 }).notNull(),
  zhCollection: varchar("zhCollection", { length: 255 }).notNull(),
  zhContent: text("zhContent").notNull(),
  zhDetailContent: text("zhDetailContent").notNull(),
  enTitle: varchar("enTitle", { length: 255 }).notNull(),
  enSubtitle: varchar("enSubtitle", { length: 255 }).notNull(),
  enCollection: varchar("enCollection", { length: 255 }).notNull(),
  enContent: text("enContent").notNull(),
  enDetailContent: text("enDetailContent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// ── Contact Messages (guestbook) ──────────────────────────────

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ── Profile Bio (editable, single row) ────────────────────────

export const profileBio = pgTable("profileBio", {
  id: integer("id").default(1).primaryKey(),
  zhText: text("zhText").notNull(),
  enText: text("enText").notNull(),
  email: varchar("email", { length: 320 }),
  instagram: varchar("instagram", { length: 500 }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull(),
});

export type ProfileBio = typeof profileBio.$inferSelect;
export type InsertProfileBio = typeof profileBio.$inferInsert;

// ── CV Entries (editable) ─────────────────────────────────────

export const cvEntries = pgTable("cvEntries", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  zhTitle: varchar("zhTitle", { length: 255 }).notNull(),
  zhSubtitle: varchar("zhSubtitle", { length: 255 }),
  enTitle: varchar("enTitle", { length: 255 }).notNull(),
  enSubtitle: varchar("enSubtitle", { length: 255 }),
  year: varchar("year", { length: 50 }).notNull(),
  sortOrder: integer("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull(),
});

export type CvEntry = typeof cvEntries.$inferSelect;
export type InsertCvEntry = typeof cvEntries.$inferInsert;

// ── Site Settings (avatar, etc.) ──────────────────────────────

export const siteSettings = pgTable("siteSettings", {
  id: integer("id").default(1).primaryKey(),
  avatarImage: varchar("avatarImage", { length: 500 }).default("/images/portrait.jpg"),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

