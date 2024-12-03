import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { User } from "@/lib/db/models/user";
import connectDB from "@/lib/db/connect";

export async function GET(request: Request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const userData = await User.findById(user.id).select("-password");
    
    return NextResponse.json(userData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}