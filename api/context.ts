import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { LocalUser } from "@db/schema";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { verifyLocalSessionToken } from "./local-auth-session";
import { findLocalUserById } from "./queries/local-users";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: LocalUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  try {
    const cookies = cookie.parse(opts.req.headers.get("cookie") || "");
    const token = cookies[Session.cookieName];
    if (token) {
      const claim = await verifyLocalSessionToken(token);
      if (claim) {
        const user = await findLocalUserById(claim.userId);
        if (user) {
          ctx.user = user;
        }
      }
    }
  } catch {
    // Authentication is optional
  }

  return ctx;
}
