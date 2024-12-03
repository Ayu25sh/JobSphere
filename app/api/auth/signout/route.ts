import { NextResponse } from "next/server";
import { removeUserCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json(
    { message: "Signed out successfully" },
    { status: 200 }
  );
  
  await removeUserCookie();
  
  // Clear all cookies to ensure complete sign-out
  response.cookies.delete("token");
  
  return response;
}