import { NextRequest, NextResponse } from "next/server";
import { Job } from "@/lib/db/models/job";
import connectDB from "@/lib/db/connect";
import { getUser } from "@/lib/auth";
import { jobSchema } from "@/lib/validations/job";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user || user.role !== "employer") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);
    
    await connectDB();
    
    const job = await Job.create({
      ...validatedData,
      postedBy: user.id,
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query: any = { status: "active" };

    if (searchParams.get("location")) {
      query.location = new RegExp(searchParams.get("location")!, "i");
    }
    if (searchParams.get("search")) {
      query.$or = [
        { title: new RegExp(searchParams.get("search")!, "i") },
        { companyName: new RegExp(searchParams.get("search")!, "i") },
      ];
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name");

    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}