import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/utils/db";

// Map NextAuth user to our Prisma schema
const CustomPrismaAdapter = PrismaAdapter(prisma);
CustomPrismaAdapter.createUser = async (data: any) => {
  const baseUsername = data.email?.split("@")[0] || "user";
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const username = `${baseUsername}_${randomSuffix}`;

  return prisma.user.create({
    data: {
      email: data.email,
      emailVerified: data.emailVerified,
      firstName: data.name?.split(" ")[0] || "User",
      lastName: data.name?.split(" ").slice(1).join(" ") || null,
      profilePhoto: data.image,
      username: username,
      registered: true,
    },
  }) as any;
};

export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Ensure profile photo is updated if it's missing on existing users
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          const updateData: any = {};
          
          if (!dbUser.profilePhoto && user.image) {
            updateData.profilePhoto = user.image;
          }
          
          // Auto-register existing users who haven't completed it
          if (!dbUser.registered) {
            updateData.registered = true;
          }

          if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: updateData,
            });
          }
        }
      }
      // If no existing user, the PrismaAdapter will create a new one automatically

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string || token.sub as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // After sign-in, check if user needs onboarding
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/`;
      }
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
