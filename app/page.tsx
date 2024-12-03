import { Button } from "@/components/ui/button";
import { BriefcaseIcon, BuildingIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-6xl">
          Find Your Next Career Opportunity
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Connect with top employers and discover exciting job opportunities that match your skills and aspirations.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/jobs">
          <Button size="lg" className="text-lg">
            Browse Jobs
            <BriefcaseIcon className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="lg" variant="outline" className="text-lg">
            Post a Job
            <BuildingIcon className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-16">
        <div className="bg-card p-6 rounded-lg text-center space-y-4">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Latest Jobs</h3>
          <p className="text-muted-foreground">
            Access thousands of job listings from top companies across industries.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg text-center space-y-4">
          <BuildingIcon className="mx-auto h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Top Companies</h3>
          <p className="text-muted-foreground">
            Connect with leading employers looking for talented professionals.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg text-center space-y-4">
          <UsersIcon className="mx-auto h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Career Growth</h3>
          <p className="text-muted-foreground">
            Find opportunities that align with your career goals and aspirations.
          </p>
        </div>
      </div>
    </div>
  );
}