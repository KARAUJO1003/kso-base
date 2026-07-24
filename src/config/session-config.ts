import { parseCookies } from "nookies";
import { siteConfig } from "./site-config";
import { parseExpirationTime } from "@/lib/session/utils";

const mode = process.env.APP_ENV === "production" ? "prod" : "dev";

const rawCompanyName =
  process.env.NEXT_PUBLIC_COOKIE_NAME ||
  `${siteConfig.name}-${process.env.NEXT_PUBLIC_PORT_DASH}`;
const COMPANY_NAME = rawCompanyName.replace(/[^A-Za-z0-9._-]/g, "-");
export const CURRENT_VERSION = "v1.0.0";
export const key = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_AUTH_SECRET,
);
export const secretKey = process.env.NEXT_PUBLIC_AUTH_SECRET;

export const sessionConfig = {
  SESSION_NAME: `@${COMPANY_NAME}-${CURRENT_VERSION}:session`,
  TOKEN_NAME: `@${COMPANY_NAME}-${CURRENT_VERSION}:auth.token`,
  TOKEN_NAME_CLIENT: `@${COMPANY_NAME}-${CURRENT_VERSION}:auth.token.client`,
  ABILITIES: `@${COMPANY_NAME}-${CURRENT_VERSION}:abilities`,
  REFRESH_TOKEN_NAME: `@${COMPANY_NAME}-${CURRENT_VERSION}:auth.refreshtoken`,
  SELECTED_STORE: `@${COMPANY_NAME}-${CURRENT_VERSION}:selected.store`,
  CONFIG_SESSION_EXPIRES: parseExpirationTime("1d", "milliseconds"), // 1 dia
  CONFIG_TOKEN_EXPIRES: parseExpirationTime("1h", "milliseconds"), // 1 hora
  CONFIG_REFRESH_TOKEN_EXPIRES: parseExpirationTime("8h", "milliseconds"), // 8 horas
  CONFIG_EXPIRATION_TIME_JWT: "8 hours",
  CONFIG_ALGORITMS_JWT: "HS256",
  CONFIG_PATH: "/",
};

export const legacySessionConfig = {
  TOKEN_NAME: "@sso_front_local:auth.token",
  TOKEN_NAME_CLIENT: "@sso_front_local:auth.token.client",
  REFRESH_TOKEN_NAME: "@sso_front_local:auth.refreshtoken",
  ABILITIES: "@sso_front_local:abilities",
} as const;

export const sessionCookieNames = {
  token: [
    sessionConfig.TOKEN_NAME,
    sessionConfig.TOKEN_NAME_CLIENT,
    legacySessionConfig.TOKEN_NAME,
    legacySessionConfig.TOKEN_NAME_CLIENT,
  ],
  refreshToken: [
    sessionConfig.REFRESH_TOKEN_NAME,
    legacySessionConfig.REFRESH_TOKEN_NAME,
  ],
} as const;

export function getFirstCookieValue(
  cookies: Partial<Record<string, string>>,
  names: readonly string[],
) {
  return names.map((name) => cookies[name]).find(Boolean) || "";
}

export async function getUser() {
  const cookies = parseCookies();
  const session = cookies[sessionConfig.SESSION_NAME];
  if (!session) return null;
  // ...
}
