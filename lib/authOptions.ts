import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const user = await client
          .db()
          .collection("users")
          .findOne({ email: credentials?.email });

        if (!user) throw new Error("No user found");

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          profile_url: user.profile_url,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user._id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
