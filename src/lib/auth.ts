import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { connectDB } from './db';
import { User } from './models/User';
import { verifyPassword } from './utils/hash';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null;

        const isValid = await verifyPassword(credentials!.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(), // ✅ this is key to get into token
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ✅ make sure it's stored in JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id; // ✅ so we can access it in client
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
