import NextAuth from "next-auth";
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import prisma from '@/lib/prima' // 确保路径正确
// import GoogleProvider from 'next-auth/providers/google'
// import GithubProvider from 'next-auth/providers/github'

// import type { NextAuthOptions } from 'next-auth'

import { authOptions } from "./config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
