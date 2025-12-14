import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: {
  strategy: "jwt" as const,
},
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const client = await clientPromise;
        const db = client.db("recipe-app");

        // Find the user by email
        const user = await db.collection("users").findOne({ username: credentials.username });
        if (!user) throw new Error("No user found");

        // Compare password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        // Return user object (this becomes session.user)
        return { id: user._id.toString(), name: user.name, username: user.username };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
