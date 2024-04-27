import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { promises as fs } from "fs";

const handler = NextAuth({
  secret: "11111",
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "someone@gmail.com",
        },
        password: {
          label: "Password",
        },
      },

      async authorize(credentials, req) {
        const fileContents: Record<string, string[]> = JSON.parse(
          await fs.readFile("json/data.json", "utf8")
        );

        const name = String(credentials?.username);

        if (fileContents[name]) {
          return { id: name, name: name };
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
