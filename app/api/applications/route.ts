import { NextRequest, NextResponse } from "next/server";
import { Application } from "@/lib/db/models/application";
import { Notification } from "@/lib/db/models/notification";
import connectDB from "@/lib/db/connect";
import { getUser } from "@/lib/auth";
import { Job } from "@/lib/db/models/job";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user || user.role !== "jobSeeker") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectDB();
    
    const existingApplication = await Application.findOne({
      jobId: body.jobId,
      applicantId: user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 400 }
      );
    }

    const application = await Application.create({
      ...body,
      applicantId: user.id,
    });

    // Get job details for notification
    const job = await Job.findById(body.jobId).populate("postedBy");

    // Create notification for employer
    await Notification.create({
      userId: job.postedBy._id,
      title: "New Job Application",
      message: `${user.name} has applied for ${job.title}`,
      type: "application",
      relatedId: application._id,
      onModel: "Application",
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Type guard to ensure user.id is a string
    if (typeof user.id !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const query = user.role === "jobSeeker"
      ? { applicantId: user.id }
      : { jobId: { $in: await getEmployerJobIds(user.id) } };

    const applications = await Application.find(query)
      .populate("jobId")
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

async function getEmployerJobIds(employerId: string) {
  const jobs = await Job.find({ postedBy: employerId }).select("_id");
  return jobs.map(job => job._id);
}
