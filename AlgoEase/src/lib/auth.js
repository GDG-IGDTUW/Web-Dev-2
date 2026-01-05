// import NextAuth from "next-auth"

import { NextAuthOptions } from "next-auth";

// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import {PrismaAdapter} from '@next-auth/prisma-adapter';
// import { db } from '@/lib/db';

// export const authOptions: NextAuthOptions = {
//   secret: process.env.NEXTAUTH_SECRET,
//   adapter: PrismaAdapter(db),

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder:"johndoe@gmail.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Example of authentication logic
//         if(!credentials?.email || !credentials?.password){
//           return null
//         }
//         const existinguser = await db.user.findUnique({
//           where: {email: credentials?.email}
//         });
//         if(!existinguser){
//           return null;
//         }
//         const passwordMatch = await compare(credentials?.password, existinguser.password);
        
//         if(!passwordMatch){
//           return null;
//         }
        
//         return {
//           id :` ${existinguser.id}`,
//           username : existinguser.username,
//           email : existinguser.email
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
//   session: {
//     strategy : 'jwt'
//   },
  
//   secret: process.env.JWT_SECRET,
// };


// /lib/auth.js
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

// export const signJWT = (payload) => {
//   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
//   return token;
// };

// export const verifyJWT = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (error) {
//     return null;
//   }
// };

// export const setAuthCookie = (token) => {
//   cookies().set('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   });
// };

// export const getAuthCookie = () => {
//   return cookies().get('token')?.value;
// };

// export const removeAuthCookie = () => {
//   cookies().delete('token');
// };

// // /app/api/auth/login/route.js
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import prisma from '@/lib/prisma';
// import { signJWT, setAuthCookie } from '@/lib/auth';

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     const user = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);
    
//     if (!isValidPassword) {
//       return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
//     }

//     // Create token
//     const token = signJWT({ userId: user.id, email: user.email });
    
//     // Set cookie
//     setAuthCookie(token);

//     // Return user data (excluding sensitive information)
//     const { password: _, ...userWithoutPassword } = user;
    
//     return NextResponse.json({
//       user: userWithoutPassword,
//       message: 'Login successful'
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'An error occurred during login' },
//       { status: 500 }
//     );
//   }
// }

// // /app/api/auth/register/route.js
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import prisma from '@/lib/prisma';
// import { signJWT, setAuthCookie } from '@/lib/auth';

// export async function POST(req) {
//   try {
//     const { name, email, password } = await req.json();

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       }
//     });

//     // Create token
//     const token = signJWT({ userId: user.id, email: user.email });
    
//     // Set cookie
//     setAuthCookie(token);

//     // Return user data (excluding password)
//     const { password: _, ...userWithoutPassword } = user;
    
//     return NextResponse.json({
//       user: userWithoutPassword,
//       message: 'Registration successful'
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'An error occurred during registration' },
//       { status: 500 }
//     );
//   }
// }

// // /app/api/auth/logout/route.js
// import { NextResponse } from 'next/server';
// import { removeAuthCookie } from '@/lib/auth';

// export async function POST() {
//   removeAuthCookie();
//   return NextResponse.json({ message: 'Logged out successfully' });
// }

// // middleware.js
// import { NextResponse } from 'next/server';
// import { verifyJWT } from './lib/auth';

// export async function middleware(request) {
//   // Get token from cookie
//   const token = request.cookies.get('token')?.value;

//   // Check if the route requires authentication
//   if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     const payload = verifyJWT(token);
//     if (!payload) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*']
// };


// /lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {

    providers: [
        CredentialsProvider({
          name: "Credentials",

          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // Add logic here to look up the user from the credentials supplied
            const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
      
            if (user) {
              // Any object returned will be saved in `user` property of the JWT
              return user
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null
      
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          }
        })
      ]

}