import { parseExpirationTime } from "@/lib/session/utils";

const mode = process.env.APP_ENV === "production" ? "prod" : "dev";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME;
const sessionConfig = {
  MODE: mode,
  SESSION_NAME: `@${COMPANY_NAME}:session`,
  TOKEN_NAME: `@${COMPANY_NAME}:auth.token`,
  TOKEN_NAME_CLIENT: `@${COMPANY_NAME}:auth.token.client`,
  ABILITIES: `@${COMPANY_NAME}:abilities`,
  REFRESH_TOKEN_NAME: `@${COMPANY_NAME}:auth.refreshtoken`,
  CONFIG_SESSION_EXPIRES: parseExpirationTime("1d", "milliseconds"),
  CONFIG_TOKEN_EXPIRES: parseExpirationTime("1h", "milliseconds"),
  CONFIG_REFRESH_TOKEN_EXPIRES: parseExpirationTime("8h", "milliseconds"),
  CONFIG_EXPIRATION_TIME_JWT: "8 hours",
  CONFIG_ALGORITMS_JWT: "HS256",
  CONFIG_PATH: "/",
};

export const AUTH_CONFIG = {
  ssoBaseUrlFront: process.env.NEXT_PUBLIC_ENDPOINT_DASH,
  ssoUrlFront: process.env.NEXT_PUBLIC_SSO_FRONT,
  ssoBaseUrl: process.env.NEXT_PUBLIC_AUTH_API_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
  apiRoutes: {
    login: "/login",
    callback: "/callback",
    postLogin: "/mapa",
    logout: `/auth/logout`,
  },
  public_routes: [
    "/mapa",
    "/login",
    "/_next",
    "/favicon.ico",
    "/callback",
    "/api",
  ],
  cookies: sessionConfig,
} as const;
