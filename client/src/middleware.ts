import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from './app/utils/session';

// 1. Specify protected and public routes
const protectedRoutes = ['/upload', '/home','signout',"/watch/:id"];
const publicRoutes = ['/signin', '/signup'];

export  function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  
console.log(path)
  // 3. Get the session cookie
  const cookieName = process.env.COOKIE_NAME;


  if(isPublicRoute){
    return NextResponse.next();
  }

  if (!cookieName) {
    console.error('COOKIE_NAME environment variable is not set');
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  const cookie = cookies().get(cookieName)?.value;

  if(!cookie){
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }
 



  return NextResponse.next();
}

export const config = {
  matcher: ['/upload', '/home', '/signin', '/signup','/signout'],
};
