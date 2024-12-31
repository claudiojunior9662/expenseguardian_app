/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: any) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET, // Certifique-se de configurar o mesmo segredo usado no NextAuth
    });
    const { pathname } = req.nextUrl;
    
    if(session) {
      await jwtVerify(session.authorizationToken as string, new TextEncoder()
        .encode(process.env.NEXTAUTH_SECRET))
        .catch((error) => {
          if(error.code === "ERR_JWT_EXPIRED") {
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.set("next-auth.session-token", "", {
              httpOnly: true,
              //secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
              expires: new Date(0), // Define a expiração para o passado
            });

            return response;
          }
        });
    }

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