import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  getFirstCookieValue,
  legacySessionConfig,
  sessionConfig,
  sessionCookieNames,
} from "@/config/session-config";
import { encrypt, decrypt, ISessionData } from "./utils";

const SESSION_NAME = sessionConfig.SESSION_NAME;

export async function createSessionToken(data: ISessionData) {
  const session = await encrypt({ data });

  (await cookies()).set(SESSION_NAME, session, {
    path: "/",
  });
}

export async function updateUserSessionServer(newUser: any) {
  const session = (await cookies()).get(SESSION_NAME)?.value;
  if (!session) return;

  const parsedSession = await decrypt(session);
  if (!parsedSession) return;
  parsedSession.data.user = newUser;

  const updatedSession = await encrypt(parsedSession);
  if (!updatedSession) return;
  const res = new NextResponse();
  res.cookies.set({
    name: SESSION_NAME,
    value: updatedSession,
  });

  return res;
}

export async function clearSession() {
  (await cookies()).delete(sessionConfig.SESSION_NAME);
  (await cookies()).delete(sessionConfig.TOKEN_NAME);
  (await cookies()).delete(sessionConfig.TOKEN_NAME_CLIENT);
  (await cookies()).delete(sessionConfig.REFRESH_TOKEN_NAME);
  (await cookies()).delete(legacySessionConfig.TOKEN_NAME);
  (await cookies()).delete(legacySessionConfig.TOKEN_NAME_CLIENT);
  (await cookies()).delete(legacySessionConfig.REFRESH_TOKEN_NAME);
  (await cookies()).delete(sessionConfig.ABILITIES);
  (await cookies()).delete(legacySessionConfig.ABILITIES);
  (await cookies()).delete("nextauth.token");
  (await cookies()).delete("nextauth.refreshToken");
}

export async function getTokenPayload(request: NextRequest | null = null) {
  const cookieStore = request?.cookies || (await cookies());
  const token = getFirstCookieValue(
    Object.fromEntries(cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])),
    sessionCookieNames.token,
  );
  if (!token) return null;

  return token;
}

export async function getUser() {
  const session = (await cookies()).get(SESSION_NAME)?.value;
  if (!session) return null;

  const tokenData = await decrypt(session);
  if (!tokenData) return null;

  const { user } = JSON.parse(JSON.stringify(tokenData.data));
  if (!user) return null;
  return user;
}

export async function getSession(request: NextRequest | null = null) {
  const session = request
    ? request.cookies.get(SESSION_NAME)?.value
    : (await cookies()).get(SESSION_NAME)?.value;
  if (!session) return null;
  return JSON.parse(JSON.stringify(await decrypt(session)));
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(sessionConfig.SESSION_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  if (!parsed) return null;
  parsed.expires = new Date(Date.now() + sessionConfig.CONFIG_SESSION_EXPIRES);
  const res = NextResponse.next();
  if (!parsed) return res;
  if (!res.cookies.has(sessionConfig.SESSION_NAME)) {
    res.cookies.set({
      name: sessionConfig.SESSION_NAME,
      value: await encrypt(parsed),
    });
  }
  return res;
}
