"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  FileText,
  Calendar,
  Mail,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function ApplicationDetails() {
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { toast } = useToast();

  useEffect(() => {
    fetchApplication();
  }, []);

  async function fetchApplication() {
    try {
      const response = await fetch(`/api/applications/${params.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      setApplication(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  async function updateStatus(status: string) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications/${params.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setApplication({ ...application, status });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
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

  if (!application) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p className="font-medium">{application.applicantId.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{application.applicantId.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Applied Date</p>
                  <p className="font-medium">
                    {format(new Date(application.createdAt), "PPP")}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Title</p>
                  <p className="font-medium">{application.jobId.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Resume</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href={application.resume} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{application.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Cover Letter</p>
            <p className="whitespace-pre-line">{application.coverLetter}</p>
          </div>

          {application.status === "pending" && (
            <div className="flex gap-4">
              <Button
                onClick={() => updateStatus("accepted")}
                disabled={isLoading}
                className="flex-1"
              >
                Accept Application
              </Button>
              <Button
                onClick={() => updateStatus("rejected")}
                variant="destructive"
                disabled={isLoading}
                className="flex-1"
              >
                Reject Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}