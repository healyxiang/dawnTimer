// import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prima"; // 确保路径正确
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import type { NextAuthOptions } from "next-auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile) {
        console.log("Google Profile:", profile);
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.image,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      async profile(profile) {
        console.log("GitHub Profile:", profile);
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    // 其他提供者...
  ],
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, token }) {
      console.log("token in callback:", token);
      return { ...session, user: { ...session.user, id: token.sub } };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // async redirect({ url, baseUrl }) {
    //   console.log('url in redirect:', url)
    //   console.log('url in baseUrl:', baseUrl)

    //   if (url.startsWith('/')) return `${baseUrl}${url}`
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url
    //   return baseUrl
    // },
  },
};
