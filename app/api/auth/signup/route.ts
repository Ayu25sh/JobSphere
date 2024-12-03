import { NextResponse } from "next/server";
import { User } from "@/lib/db/models/user";
import connectDB from "@/lib/db/connect";
import { createToken } from "@/lib/auth";
import { signUpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = signUpSchema.parse(body);
    
    await connectDB();
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const user = await User.create(validatedData);
    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}