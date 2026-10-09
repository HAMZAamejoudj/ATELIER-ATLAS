import * as bcryptModule from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { ensureAuthEnv } from "@/lib/ensure-auth-env";
import { supabaseAdmin } from "@/lib/supabase-admin";

ensureAuthEnv();

const bcrypt =
  ((bcryptModule as Record<string, unknown>).default as typeof bcryptModule) ||
  bcryptModule;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const { data: user, error } = await supabaseAdmin
          .from("User")
          .select("id, email, name, role")
          .eq("email", email)
          .single();

        if (error || !user) {
          return null;
        }

        const { data: credential } = await supabaseAdmin
          .from("UserCredential")
          .select("passwordHash")
          .eq("userId", user.id)
          .single();

        if (!credential?.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          credential.passwordHash,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        if (token.role) session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
};
