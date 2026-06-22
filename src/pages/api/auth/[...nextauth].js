import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || 'dummy_github_id',
      clientSecret: process.env.GITHUB_SECRET || 'dummy_github_secret',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || 'dummy_facebook_id',
      clientSecret: process.env.FACEBOOK_SECRET || 'dummy_facebook_secret',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_google_client_secret',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'shopvibe_fallback_nextauth_secret_key',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
