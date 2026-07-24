export function buildLoginUrl(redirectUrl: string) {
  const loginUrl = new URL("/login", window.location.origin);
  loginUrl.searchParams.set("redirect", redirectUrl);
  return loginUrl.toString();
}
