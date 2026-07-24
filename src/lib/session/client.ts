import {
  getFirstCookieValue,
  legacySessionConfig,
  sessionConfig,
  sessionCookieNames,
} from "@/config/session-config";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { encrypt, decrypt, ISessionData, encryptNoExpire } from "./utils";

export const secretKey = process.env.NEXT_PUBLIC_AUTH_SECRET;
export const key = new TextEncoder().encode(secretKey);

export async function createSessionToken(data: ISessionData) {
  const SESSION_NAME = sessionConfig.SESSION_NAME;
  const session = await encryptNoExpire({ data });
  if (!session) return;
  setCookie(null, SESSION_NAME, session, {
    path: sessionConfig.CONFIG_PATH,
  });
}

export async function updateUserSession(newUser: any) {
  const SESSION_NAME = sessionConfig.SESSION_NAME;
  const cookies = parseCookies();
  const session = cookies[SESSION_NAME];
  if (!session) return null;

  const tokenData = await decrypt(session);
  if (!tokenData) return null;

  tokenData.data.user = newUser;

  const updatedSession = await encrypt({ data: tokenData.data });
  if (!updatedSession) return;
  // setCookie(null, SESSION_NAME, updatedSession);

  return tokenData.data.user;
}

export async function clearSession(ctx = undefined) {
  const options = { path: sessionConfig.CONFIG_PATH };

  destroyCookie(ctx, sessionConfig.SESSION_NAME, options);
  destroyCookie(ctx, sessionConfig.TOKEN_NAME, options);
  destroyCookie(ctx, sessionConfig.TOKEN_NAME_CLIENT, options);
  destroyCookie(ctx, sessionConfig.REFRESH_TOKEN_NAME, options);
  destroyCookie(ctx, legacySessionConfig.TOKEN_NAME, options);
  destroyCookie(ctx, legacySessionConfig.TOKEN_NAME_CLIENT, options);
  destroyCookie(ctx, legacySessionConfig.REFRESH_TOKEN_NAME, options);
  destroyCookie(ctx, sessionConfig.ABILITIES, options);
  destroyCookie(ctx, legacySessionConfig.ABILITIES, options);
  destroyCookie(ctx, "nextauth.token", options);
  destroyCookie(ctx, "nextauth.refreshToken", options);
}

export async function getTokenPayload() {
  const cookies = parseCookies();
  const token = getFirstCookieValue(cookies, sessionCookieNames.token);
  if (!token) return null;

  return token;
}

export async function getRefreshTokenPayload() {
  const cookies = parseCookies();
  const refresh = getFirstCookieValue(cookies, sessionCookieNames.refreshToken);
  if (!refresh) return null;
  return refresh;
}

export async function getUser() {
  const SESSION_NAME = sessionConfig.SESSION_NAME;
  const cookies = parseCookies();
  const session = cookies[SESSION_NAME];
  if (!session) return null;

  const { data } = await decrypt(session);
  if (!data) return null;
  const { user } = JSON.parse(JSON.stringify(data));
  return user;
}

export async function getSession() {
  const SESSION_NAME = sessionConfig.SESSION_NAME;
  const cookies = parseCookies();
  const session = cookies[SESSION_NAME];
  if (!session) return null;
  const data = await decrypt(session);
  if (!data) return null;
  return JSON.parse(JSON.stringify(data.data));
}
