import { localAuthRouter } from "./local-auth-router";
import { blogRouter } from "./blog-router";
import { contactRouter } from "./contact-router";
import { profileRouter } from "./profile-router";
import { cvRouter } from "./cv-router";
import { settingsRouter } from "./settings-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: localAuthRouter,
  blog: blogRouter,
  contact: contactRouter,
  profile: profileRouter,
  cv: cvRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
