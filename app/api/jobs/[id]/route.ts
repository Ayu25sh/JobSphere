// import { NextRequest, NextResponse } from "next/server";
// import { Job } from "@/lib/db/models/job";
// import connectDB from "@/lib/db/connect";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
    
//     const job = await Job.findById(params.id).populate("postedBy", "name");
    
//     if (!job) {
//       return NextResponse.json(
//         { error: "Job not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(job);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { Job } from "@/lib/db/models/job";
import connectDB from "@/lib/db/connect";

export async function GET(request: NextRequest) {
  try {
    // Extracting the job id from the URL using request.nextUrl.pathname
    const id = request.nextUrl.pathname.split("/").pop(); // Directly assign the value to `id`

    if (!id) {
      return NextResponse.json({ error: "ID is missing" }, { status: 400 });
    }

    await connectDB();

    const job = await Job.findById(id).populate("postedBy", "name");

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
