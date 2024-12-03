"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon } from "lucide-react";
import UserMenu from "./user-menu";
import Notifications from "./notifications";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          if (data?.role === "employer" && pathname === "/") {
            router.push("/employer/applications");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    checkAuth();
  }, [pathname]);

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BriefcaseIcon className="h-6 w-6" />
            <span className="text-xl font-bold">JobSphere</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user?.role === "jobSeeker" && (
              <Link href="/jobs">
                <Button
                  variant="ghost"
                  className={pathname === "/jobs" ? "bg-accent" : ""}
                >
                  Browse Jobs
                </Button>
              </Link>
            )}
            {user ? (
              <>
                <Notifications />
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}