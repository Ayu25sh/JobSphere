import { NextRequest, NextResponse } from "next/server";
import { Application } from "@/lib/db/models/application";
import { Notification } from "@/lib/db/models/notification";
import connectDB from "@/lib/db/connect";
import { getUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(request);
    if (!user || user.role !== "employer") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectDB();
    
    const application = await Application.findById(params.id)
      .populate("jobId")
      .populate("applicantId");

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    application.status = body.status;
    await application.save();

    // Create notification for the applicant
    await Notification.create({
      userId: application.applicantId._id,
      title: "Application Status Updated",
      message: `Your application for ${application.jobId.title} has been ${body.status}`,
      type: "status_update",
      relatedId: application._id,
      onModel: "Application",
    });

    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}