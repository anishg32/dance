import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect /admin routes
    if (path.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.rewrite(new URL('/unauthorized', req.url));
      }
    }
    
    // Protect /dashboard routes
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      
      const role = token.role;
      // If parent tries to access student dashboard or vice-versa
      if (path === '/dashboard' && role === 'PARENT') {
        return NextResponse.redirect(new URL('/dashboard/parent', req.url));
      }
      
      if (path.startsWith('/dashboard/parent') && role !== 'PARENT') {
        if (role === 'ADMIN') {
          // Admins might want to test but normally they go to /admin
          // we can allow or redirect
          return NextResponse.rewrite(new URL('/unauthorized', req.url));
        } else {
          return NextResponse.rewrite(new URL('/unauthorized', req.url));
        }
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If it's an admin or dashboard route, require a token. 
        // We handle exact role logic inside the middleware function above.
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
          return !!token;
        }
        return true; // Other routes are public by default
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
