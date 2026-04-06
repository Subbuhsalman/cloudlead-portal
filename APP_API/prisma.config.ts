import path from "node:path";
import "dotenv/config";                  // ← load your .env if needed
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,                     // required during Early Access
  schema: path.join("prisma", "schema"), // ← point at your schema **folder**
  migrations: {
    path: path.join("prisma", "schema", "migrations"),
  },
  // you can also add `views`, `typedSql`, `studio`, etc.
});
