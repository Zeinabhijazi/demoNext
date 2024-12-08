import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
// Initialize and Export NextAuth
export default NextAuth(authConfig).auth; // NextAuth(authConfig): This initializes NextAuth with the provided configuration.
 
// Configuring Middleware Matcher
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], 
  // matcher: 
  //   - This defines the routes that the middleware should apply to. 
  //   - Is a regular expression pattern that tells Next.js middleware which routes to apply to
};