// import { NextRequest, NextResponse } from "next/server";
// import { Application } from "@/lib/db/models/application";
// import connectDB from "@/lib/db/connect";
// import { getUser } from "@/lib/auth";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const user = await getUser(request);
//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     await connectDB();
    
//     const application = await Application.findById(params.id)
//       .populate("jobId")
//       .populate("applicantId", "name email");

//     if (!application) {
//       return NextResponse.json(
//         { error: "Application not found" },
//         { status: 404 }
//       );
//     }

//     // Verify user has permission to view this application
//     const isEmployer = user.role === "employer";
//     const isApplicant = user.id === application.applicantId._id.toString();
    
//     if (!isEmployer && !isApplicant) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(application);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { Application } from "@/lib/db/models/application";
import connectDB from "@/lib/db/connect";
import { getUser } from "@/lib/auth";

// The GET function receives the request and context as arguments
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the id from the URL params using request.nextUrl
    const { id } = request.nextUrl.pathname.split("/").pop()!; // Assumes ID is at the end of the URL

    await connectDB();
    
    const application = await Application.findById(id)
      .populate("jobId")
      .populate("applicantId", "name email");

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Verify user has permission to view this application
    const isEmployer = user.role === "employer";
    const isApplicant = user.id === application.applicantId._id.toString();
    
    if (!isEmployer && !isApplicant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
