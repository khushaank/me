import * as jose from "jose";
import { env } from "./lib/env";

const JWT_ALG = "HS256";

export type LocalSessionPayload = {
  username: string;
  userId: number;
};

export async function signLocalSessionToken(
  payload: LocalSessionPayload,
): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifyLocalSessionToken(
  token: string,
): Promise<LocalSessionPayload | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (!payload.username || !payload.userId) return null;
    return { username: payload.username as string, userId: payload.userId as number };
  } catch {
    return null;
  }
}
