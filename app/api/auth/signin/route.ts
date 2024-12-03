import { NextResponse } from "next/server";
import { User } from "@/lib/db/models/user";
import connectDB from "@/lib/db/connect";
import { createToken } from "@/lib/auth";
import { signInSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = signInSchema.parse(body);
    
    await connectDB();
    
    const user = await User.findOne({ email: validatedData.email }).select("+password");
    if (!user || !(await user.comparePassword(validatedData.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      { message: "Signed in successfully" },
      { status: 200 }
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