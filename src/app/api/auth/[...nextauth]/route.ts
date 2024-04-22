import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { promises as fs } from "fs";

const handler = NextAuth({
  secret: "11111",
  providers: [
    CredentialsProvider({
      name: "IGN",
      credentials: {
        username: {
          label: "In Game Name",
          type: "text",
          placeholder: "6LittleTimmy9",
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
