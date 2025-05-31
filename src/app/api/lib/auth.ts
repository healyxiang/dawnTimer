import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session details:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasEmail: !!session?.user?.email,
      user: session?.user,
    });

    // if (!session?.user?.email) {
    //   throw new Error("No authenticated user found");
    // }
    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
}
