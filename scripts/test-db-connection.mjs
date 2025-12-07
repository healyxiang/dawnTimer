#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 用于诊断数据库连接问题
 */

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";

// 加载环境变量
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

const prisma = new PrismaClient({
  log: ["error", "warn"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function testConnection() {
  console.log("🔍 开始测试数据库连接...\n");

  // 检查环境变量
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ 错误: DATABASE_URL 环境变量未设置");
    console.log("\n请确保在 .env 或 .env.local 文件中设置了 DATABASE_URL");
    process.exit(1);
  }

  // 隐藏密码，只显示连接信息
  const maskedUrl = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");
  console.log(`📋 数据库连接字符串: ${maskedUrl}\n`);

  try {
    // 测试连接
    console.log("⏳ 正在连接数据库...");
    await prisma.$connect();
    console.log("✅ 数据库连接成功！\n");

    // 测试查询
    console.log("⏳ 正在测试查询...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ 查询测试成功！", result);

    // 获取数据库信息
    console.log("\n📊 数据库信息:");
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        version() as version,
        current_database() as database,
        current_user as user
    `;
    console.log(JSON.stringify(dbInfo, null, 2));

    console.log("\n✅ 所有测试通过！数据库连接正常。");
  } catch (error) {
    console.error("\n❌ 数据库连接失败！\n");
    console.error("错误详情:", error.message);
    console.error("\n可能的原因:");
    console.error("1. 数据库服务器地址或端口不正确");
    console.error("2. 数据库服务器不可达（网络问题或服务器关闭）");
    console.error("3. 数据库凭据（用户名/密码）错误");
    console.error("4. 数据库名称不存在");
    console.error("5. 防火墙或安全组阻止了连接");
    console.error("\n解决方案:");
    console.error("1. 检查 .env 或 .env.local 文件中的 DATABASE_URL 是否正确");
    console.error("2. 确认数据库服务器是否正在运行");
    console.error("3. 检查网络连接（可能需要使用 VPN 或代理）");
    console.error("4. 联系数据库管理员确认服务器状态");
    console.error("5. 如果是 Railway 数据库，检查 Railway 控制台中的连接信息");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch((error) => {
  console.error("未预期的错误:", error);
  process.exit(1);
});
