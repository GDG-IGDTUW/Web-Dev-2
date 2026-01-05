// middleware.js
// import { NextResponse } from "next/server";
// import { verify } from "jsonwebtoken";

// export async function middleware(request) {
//   const token = request.cookies.get("token")?.value;

//   if (request.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     try {
//       verify(token, process.env.JWT_SECRET);
//       return NextResponse.next();
//     } catch (error) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = { matcher: ["/dashboard"] };
