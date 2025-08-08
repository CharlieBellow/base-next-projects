import type { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

// Use json-server adapter in development for testing
const useJsonServer =
  process.env.NODE_ENV === "development" && process.env.USE_JSON_SERVER === "true";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", // Uma página de login simples
  },
  debug: process.env.NODE_ENV === "development",
};
