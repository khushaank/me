import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
  incrementClicks,
} from "./queries/posts";

export const blogRouter = createRouter({
  list: publicQuery.query(async () => findAllPosts()),

  recordClick: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await incrementClicks(input.id);
      return { success: true };
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await findPostById(input.id);
      return post;
    }),

  create: adminQuery
    .input(
      z.object({
        year: z.string().max(10),
        image: z.string().max(500),
        sortOrder: z.number().optional(),
        zhTitle: z.string().max(255),
        zhSubtitle: z.string().max(255),
        zhCollection: z.string().max(255),
        zhContent: z.string(),
        zhDetailContent: z.string(),
        enTitle: z.string().max(255),
        enSubtitle: z.string().max(255),
        enCollection: z.string().max(255),
        enContent: z.string(),
        enDetailContent: z.string(),
      }),
    )
    .mutation(async ({ input }) => createPost(input)),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        year: z.string().max(10).optional(),
        image: z.string().max(500).optional(),
        sortOrder: z.number().optional(),
        zhTitle: z.string().max(255).optional(),
        zhSubtitle: z.string().max(255).optional(),
        zhCollection: z.string().max(255).optional(),
        zhContent: z.string().optional(),
        zhDetailContent: z.string().optional(),
        enTitle: z.string().max(255).optional(),
        enSubtitle: z.string().max(255).optional(),
        enCollection: z.string().max(255).optional(),
        enContent: z.string().optional(),
        enDetailContent: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updatePost(id, data);
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deletePost(input.id);
      return { success: true };
    }),
});
