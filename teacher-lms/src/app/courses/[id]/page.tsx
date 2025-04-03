// src/app/courses/[id]/page.tsx
// Server Component
import { notFound } from "next/navigation";
import { getCourseById, coursesData } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";
import { Suspense } from "react";

// Define the params type for TypeScript
interface Params {
  id: string;
}

// Define Course type (should match your data structure)
interface Course {
  id: number;
  title: string;
  description?: string;
  image?: string;
  level: string;
  department: string;
  enrolled: number;
  duration: string;
  instructor: string;
  curriculum: any[]; // Replace with actual type if available
  videos: any[]; // Replace with actual type if available
  documents: any[]; // Replace with actual type if available
  codeRepositories: any[]; // Replace with actual type if available
  quizzes: any[]; // Replace with actual type if available
  assignments: any[]; // Replace with actual type if available
}

// Static params generation for SSG
export function generateStaticParams(): { id: string }[] {
  return coursesData.map((course) => ({
    id: course.id.toString(),
  }));
}

// Server Component - Async with improved error handling and suspense
export default async function CourseDetailPage({ params }: { params: Promise<Params> }) {
  // Await params to resolve the Promise (Next.js 13+ App Router requirement)
  const { id } = await params;
  const courseId = Number(id);

  // Validate courseId
  if (isNaN(courseId) || courseId <= 0) {
    notFound(); // Trigger Next.js 404 page
  }

  // Fetch course data (could be async if fetching from a DB/API)
  let course: Course | null;
  try {
    course = getCourseById(courseId);
    if (!course) {
      notFound();
    }
  } catch (error) {
    console.error(`Failed to fetch course with ID ${courseId}:`, error);
    notFound();
  }

  // Wrap client component in Suspense for better loading states
  return (
    <Suspense fallback={<CourseLoadingSkeleton />}>
      <CourseDetailClient courseId={courseId} initialCourse={course} />
    </Suspense>
  );
}

// Optional: Generate metadata for SEO with error handling
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const courseId = Number(id);

  if (isNaN(courseId) || courseId <= 0) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  try {
    const course = getCourseById(courseId);
    if (!course) {
      return {
        title: "Course Not Found",
        description: "The requested course could not be found.",
      };
    }

    return {
      title: `${course.title} | Course Details`,
      description: course.description || "Learn more about this course.",
      openGraph: {
        title: course.title,
        description: course.description,
        images: course.image ? [{ url: course.image }] : undefined,
      },
    };
  } catch (error) {
    console.error(`Failed to generate metadata for course ${courseId}:`, error);
    return {
      title: "Error",
      description: "An error occurred while loading the course details.",
    };
  }
}

// Optional: Revalidate interval for ISR (if using dynamic data)
export const revalidate = 3600; // Revalidate every hour (adjust as needed)

// Loading skeleton component
function CourseLoadingSkeleton() {
  return (
    <div className="space-y-8 p-4">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-4">
        <div className="h-48 w-full bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}