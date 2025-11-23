This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
# or
pnpm build:content // 手动从posts目录下mdx文件生成博客页面内容，指定pnpm dev 后，会自动生成
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 数据库部分

```
npx prisma migrate dev --name init_test // 根据 prisma model 生成sql，操作远程数据库，生成表。本地执行时，由于网络环境问题，可能会出现失败，设置命令行的科学上网，多重试几次，直到成功
npx prisma generate // 生成prisma 客户端

npx prisma migrate deploy // 前两步骤执行结束后，修改.env文件中的DATABASE_URL，替换为生产环境的数据库，执行此命令，将本地数据库的表同步到远程数据库
```

### 数据库连接问题排查

如果遇到 `Can't reach database server` 错误，请按以下步骤排查：

1. **测试数据库连接**

   ```bash
   pnpm test:db
   # 或
   node scripts/test-db-connection.mjs
   ```

2. **检查环境变量配置**

   - 确认 `.env` 或 `.env.local` 文件中存在 `DATABASE_URL`
   - 检查 `DATABASE_URL` 格式是否正确：
     ```
     postgresql://用户名:密码@主机:端口/数据库名?参数
     ```
   - 注意：`.env.local` 的优先级高于 `.env`

3. **常见问题及解决方案**

   **问题 1: 数据库服务器不可达**

   - Railway 数据库：检查 Railway 控制台中的数据库状态和连接信息
   - 确认数据库服务是否正在运行
   - 检查网络连接（可能需要 VPN 或代理）

   **问题 2: 连接字符串错误**

   - 确认主机地址、端口、数据库名是否正确
   - 检查用户名和密码是否正确
   - 注意特殊字符需要进行 URL 编码

   **问题 3: 网络问题**

   - 如果使用 Railway 等云数据库，可能需要配置代理
   - 检查防火墙设置
   - 尝试使用 `npx prisma db pull` 测试连接

   **问题 4: 数据库服务已停止或迁移**

   - Railway 免费服务可能会暂停，需要重新启动
   - 检查数据库服务提供商的控制台

4. **获取最新的连接信息**

   - Railway: 在项目控制台 → Database → Connect 中查看最新的连接字符串
   - 其他服务商: 查看相应的数据库管理界面

5. **验证连接字符串格式**

   ```bash
   # 检查环境变量是否已加载
   echo $DATABASE_URL

   # 或在 Node.js 中测试
   node -e "console.log(process.env.DATABASE_URL)"
   ```

## 多语言

使用了 `next-intl` 实现多语言支持

`src/middleware.ts` 是 `next-intl` 的中间件，用于处理多语言请求

`i18n-config.ts` 是 `next-intl` 的配置文件，用于配置多语言

`src/i18n` 文件夹中是 `next-intl` 的导航和路由配置

## 博客部分

`pnpm build:content` // 手动从 posts 目录下 mdx 文件生成博客页面内容，指定 pnpm dev 后，会自动生成
使用 `contentlayer` 生成博客页面内容，需要手动执行 `pnpm build:content` 命令，生成博客页面内容
`contentlayer.config.ts` 是 `contentlayer` 的配置文件，用于配置博客页面内容,每次新增语言时，需要修改此配置文件

`src/app/[locale]/blog/page.tsx` 是博客页面，使用 `next-intl` 实现多语言支持，使用 `contentlayer` 生成博客页面内容

## 环境变量

### [优先级顺序](https://nextjs.org/docs/app/guides/environment-variables#environment-variable-load-order)

环境变量查找优先级顺序，一旦找到变量，则不再继续查找：

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (Not checked when NODE_ENV is test.)
4. `.env.$(NODE_ENV)`
5. `.env`

## 登录授权

### Github

https://juejin.cn/post/6998348587797053447
