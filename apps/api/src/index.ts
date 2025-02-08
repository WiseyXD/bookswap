import { Hono } from "hono";
import { getPrisma } from "./db";
import { logger } from "hono/logger";
import { verifyToken } from "./middleware";
import { UserData } from "./lib/types/user";

type Bindings = {};

interface Variables {
  USER: UserData;
}

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

app.use(logger());
app.use("/auth/*", verifyToken);

app.get("/auth/protected", async (c) => {
  const userData = c.get("USER");
  const prisma = getPrisma(c);
  console.log("userData", userData);
  const user = await prisma.user.findUnique({
    where: {
      id: userData.id,
    },
  });
  return c.json({
    ok: true,
    message: "Hello protected API!",
    user: "User from db" + user,
  });
});

export default app;
