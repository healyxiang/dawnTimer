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
npx prisma migrate dev --name init_test // 根据 prisma model 生成sql，操作远程数据库，生成表
npx prisma generate // 生成prisma 客户端
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
