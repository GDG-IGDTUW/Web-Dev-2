// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { error } from "console";

// import { hash } from "bcrypt";
// import * as z from "zod";

// const userSchema = z.object({
//   username: z.string().min(1, "Username is required").max(100),
//   email: z.string().min(1, "Email is required ").email("invalid email"),
//   password: z
//     .string()
//     .min(1, "password is required")
//     .min(8, "password must have 8 characters"),

// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, username, password } = userSchema.parse(body) ;
//     //check if email already exists
//     const existingUserByEmail = await db.user.findUnique({
//       where: { email: email },
//     });
//     if (existingUserByEmail) {
//       return NextResponse.json(
//         { user: null, message: "user with this email already exists" },
//         { status: 409 }
//       );
//     }

//     //check if username already exists
//     const existingUserByUsername = await db.user.findUnique({
//       where: { username: username },
//     });
//     if (existingUserByUsername) {
//       return NextResponse.json(
//         { user: null, message: "user with this username already exists" },
//         { status: 410 }
//       );
//     }

//     //creating new user:
//     const hashPassword = await hash(password, 10);
//     const newUser = await db.user.create({
//       data: {
//         username,
//         email,
//         password: hashPassword,
//       },
//     });
//     const { password: newUserPassword, ...rest } = newUser;

//     return NextResponse.json(
//       { user: rest, message: "User created successfully!" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "something went wrong in creating user!" },
//       { status: 500 }
//     );
//   }
// }

// /api/user/routeModule.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required ").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  level: z.string().min(1, "Experience level is required"),
  goals: z.array(z.string()).nonempty("At least one goal is required"),
  learningStyle: z.string().min(1, "Learning style is required"),
  timeCommitment: z.string().min(1, "Time commitment is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      username,
      password,
      level,
      goals,
      learningStyle,
      timeCommitment,
      experienceLevel,
    } = userSchema.parse(body);

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        { status: 409 }
      );
    }

    const hashPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        level,
        goals,
        learningStyle,
        experienceLevel,
        timeCommitment,
      },
    });

    const { password: _password, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating user!" },
      { status: 500 }
    );
  }
}
