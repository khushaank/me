import * as cookie from "cookie";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery } from "./middleware";
import {
  findLocalUserByUsername,
  findLocalUserById,
  verifyLocalPassword,
  createLocalUser,
  updateLocalUser,
} from "./queries/local-users";
import {
  signLocalSessionToken,
  verifyLocalSessionToken,
} from "./local-auth-session";

export const localAuthRouter = createRouter({
  me: publicQuery.query(async ({ ctx }) => {
    const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
    const token = cookies[Session.cookieName];
    if (!token) return null;

    const claim = await verifyLocalSessionToken(token);
    if (!claim) return null;

    const user = await findLocalUserById(claim.userId);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };
  }),

  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findLocalUserByUsername(input.username);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const valid = await verifyLocalPassword(user, input.password);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const token = await signLocalSessionToken({
        username: user.username,
        userId: user.id,
      });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      };
    }),

  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(6).max(100),
        name: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await findLocalUserByUsername(input.username);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      const user = await createLocalUser({
        username: input.username,
        password: input.password,
        name: input.name,
      });

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      };
    }),

  updateCredentials: publicQuery
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newUsername: z.string().min(3).max(100).optional(),
        newPassword: z.string().min(6).max(100).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Get current user from session
      const cookies = cookie.parse(ctx.req.headers.get("cookie") || "");
      const token = cookies[Session.cookieName];
      if (!token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
      }

      const claim = await verifyLocalSessionToken(token);
      if (!claim) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
      }

      const user = await findLocalUserById(claim.userId);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Verify current password
      const valid = await verifyLocalPassword(user, input.currentPassword);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      // Check username uniqueness if changing
      if (input.newUsername && input.newUsername !== user.username) {
        const existing = await findLocalUserByUsername(input.newUsername);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already taken",
          });
        }
      }

      // Update user
      const updated = await updateLocalUser(user.id, {
        username: input.newUsername,
        password: input.newPassword,
      });

      // Re-issue session token with new username
      const newToken = await signLocalSessionToken({
        username: updated.username,
        userId: updated.id,
      });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, newToken, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return {
        id: updated.id,
        username: updated.username,
        name: updated.name,
        role: updated.role,
      };
    }),

  logout: publicQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
