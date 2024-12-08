import type { NextAuthConfig } from 'next-auth'; // This object contain the configuration options for NextAuth.js
 
export const authConfig = {
  pages: {
    signIn: '/login', // redirect to login page
  },
  // protecting your routes with Next.js Middleware
  callbacks: {
    // Is uset to verify if the request is authorized to access a page. 
    // It is called before a request is completed
    // It receives an object with the auth and request properties.
    // auth: contain the user's session
    // request: contain the incoming request
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
