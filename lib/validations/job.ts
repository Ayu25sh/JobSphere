import * as z from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  salary: z.string().min(1, "Salary is required"),
  location: z.string().min(1, "Location is required"),
  companyName: z.string().min(1, "Company name is required"),
  applicationDeadline: z
    .preprocess((value) => (typeof value === "string" ? new Date(value) : value), z.date({
      required_error: "Application deadline is required",
    })),
});