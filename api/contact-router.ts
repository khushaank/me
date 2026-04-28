import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  findAllContacts,
  createContact,
  deleteContact,
} from "./queries/contacts";

export const contactRouter = createRouter({
  list: publicQuery.query(async () => {
    return findAllContacts();
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().max(100).optional(),
        message: z.string().min(1, "Message is required").max(5000, "Message too long"),
      }),
    )
    .mutation(async ({ input }) => {
      const contact = await createContact({
        name: input.name || null,
        message: input.message,
      });
      return contact;
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteContact(input.id);
      return { success: true };
    }),
});
