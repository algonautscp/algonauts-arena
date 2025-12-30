type JWTPayload = {
  userId: string;
  role: "ADMIN" | "MENTOR" | "MEMBER";
  iat: number;
  exp: number;
};

export function decodeJWT(token: string): JWTPayload {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export function isTokenExpired(token: string): boolean {
  const { exp } = decodeJWT(token);
  return Date.now() >= exp * 1000;
}
