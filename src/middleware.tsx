/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET, // Certifique-se de configurar o mesmo segredo usado no NextAuth
    });
  
    const { pathname } = req.nextUrl;
  
    // Se o usuário está logado e tenta acessar a página de login, redirecione para a Home
    if (session && pathname === '/login') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  
    // Se o usuário não está logado e tenta acessar uma rota protegida, redirecione para o login
    if (!session && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    // Permita que a requisição prossiga
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|static).*)'], // Aplica o middleware a todas as rotas, exceto as específicas (API, estáticas, etc.)
};