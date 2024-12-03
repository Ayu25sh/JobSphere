import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/db/models/user";
import connectDB from "@/lib/db/connect";
import { getUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectDB();
    
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { 
        name: body.name,
        email: body.email,
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}