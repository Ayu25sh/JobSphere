"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SearchIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, [search, location]);

  async function fetchJobs() {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location) params.append("location", location);

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      setJobs(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search jobs or companies"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              icon={<SearchIcon className="h-4 w-4" />}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
              icon={<MapPinIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job: any) => (
          <Card key={job._id}>
            <CardHeader>
              <CardTitle className="line-clamp-2">{job.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{job.companyName}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.skills.slice(0, 3).map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link href={`/jobs/${job._id}`}>
                  <Button className="w-full mt-4">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}