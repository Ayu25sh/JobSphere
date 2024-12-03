"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPinIcon,
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
} from "lucide-react";
import { format } from "date-fns";

export default function JobDetails() {
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchJob();
  }, []);

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      setJob(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  async function handleApply() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          resume: "https://example.com/resume.pdf", // In a real app, handle file upload
          coverLetter: "I am interested in this position", // In a real app, add a form for this
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Application submitted successfully",
      });

      router.push("/applications");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{job.title}</CardTitle>
          <p className="text-lg text-muted-foreground">{job.companyName}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="mr-2 h-5 w-5" />
              {job.location}
            </div>
            <div className="flex items-center text-muted-foreground">
              <DollarSignIcon className="mr-2 h-5 w-5" />
              {job.salary}
            </div>
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
            </div>
            <div className="flex items-center text-muted-foreground">
              <BriefcaseIcon className="mr-2 h-5 w-5" />
              {job.status}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {job.description}
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleApply}
            disabled={isLoading}
          >
            {isLoading ? "Submitting Application..." : "Apply Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}