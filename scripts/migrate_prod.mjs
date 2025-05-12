// migrate.js
import dotenv from "dotenv";
import path from "path";
import { execSync } from "child_process";

dotenv.config({ path: path.resolve(process.cwd(), ".env.prod") });

// 使用 execSync 执行 Prisma 的迁移命令
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  console.log("Migration completed successfully.");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exit(1); // 如果迁移失败，退出程序
}
