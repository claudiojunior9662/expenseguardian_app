import GetUserAuthorizationService from "@/modules/auth/services/get-user-authorization.service";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials.");
        }

        const getUserAuthorizationService = new GetUserAuthorizationService();
        const userAuthorizationToken = await getUserAuthorizationService.execute({
          email: credentials.email,
          password: credentials.password,
        });

        if (!userAuthorizationToken) {
          throw new Error("Invalid credentials.");
        }

        const user = {
          id: "1",
          email: credentials.email,
          name: "John Doe",
          role: "admin",
          token: userAuthorizationToken.data.token
        };

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 55 * 60 * 2,
    updateAge: 5 * 60
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adicione o token de autorização ao JWT quando o usuário for autenticado
      if (user) {
        token.authorizationToken = user.token;
      }
  
      return token;
    },
    async session({ session, token }) {
      if (token.authorizationToken) {
        session.authorizationToken = token.authorizationToken;
      }
      return session;
    },
  },
};

export default authOptions;
