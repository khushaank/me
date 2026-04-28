import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findAllCvEntries,
  createCvEntry,
  updateCvEntry,
  deleteCvEntry,
} from "./queries/cv-entries";

export const cvRouter = createRouter({
  list: publicQuery.query(async () => findAllCvEntries()),

  create: adminQuery
    .input(
      z.object({
        category: z.string().max(50),
        zhTitle: z.string().max(255),
        zhSubtitle: z.string().max(255).optional(),
        enTitle: z.string().max(255),
        enSubtitle: z.string().max(255).optional(),
        year: z.string().max(50),
        sortOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => createCvEntry(input)),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        category: z.string().max(50).optional(),
        zhTitle: z.string().max(255).optional(),
        zhSubtitle: z.string().max(255).optional(),
        enTitle: z.string().max(255).optional(),
        enSubtitle: z.string().max(255).optional(),
        year: z.string().max(50).optional(),
        sortOrder: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateCvEntry(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCvEntry(input.id);
      return { success: true };
    }),
});
