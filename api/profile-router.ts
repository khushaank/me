import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getProfileBio, upsertProfileBio } from "./queries/profile-bio";

export const profileRouter = createRouter({
  get: publicQuery.query(async () => getProfileBio()),

  update: adminQuery
    .input(
      z.object({
        zhText: z.string().optional(),
        enText: z.string().optional(),
        email: z.string().max(320).optional(),
        instagram: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ input }) => upsertProfileBio(input)),
});
