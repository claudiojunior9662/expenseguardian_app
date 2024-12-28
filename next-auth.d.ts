// next-auth.d.ts
import { User as NextAuthUser, Session as NextAuthSession } from "next-auth";

// Estendendo a interface `User` do NextAuth
declare module "next-auth" {
  interface User {
    token: string; // Adiciona a propriedade `token` ao User
  }

  // Estendendo a interface `Session` do NextAuth
  interface Session {
    authorizationToken?: string; // Adiciona a propriedade `authorizationToken` à Session
  }
}
