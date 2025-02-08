import { createMiddleware } from "hono/factory";
import { jwt, verify } from "hono/jwt";
import { jwtVerify, importJWK, JWTPayload } from "jose";
import { JWTUserPayload, UserData } from "./lib/types/user";

interface Variables {
  USER: UserData;
}

type Bindings = {
  AUTH_SECRET: string;
};

export const verifyToken = createMiddleware<{
  Bindings: Bindings;
  Variables: Variables;
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const token = authHeader.split(" ")[1];
    const secret = c.env.AUTH_SECRET;
    const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
    const { payload } = await jwtVerify(token, jwk);
    c.set("USER", payload as JWTUserPayload);
    await next();
  } catch (error) {
    console.log(error);
    return c.json({ error: "Invalid token" }, 403);
  }
});
