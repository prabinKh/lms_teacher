"use client";

import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import { coursesData } from "@/data/courses";
import { assignmentSubmissions } from "@/data/assignments";
import { getStudents } from "@/data/users";

export default function Home() {
  // Get course count
  const courseCount = coursesData.length;

  // Get total enrolled students
  const totalEnrolled = coursesData.reduce((acc, course) => acc + course.enrolled, 0);

  // Get total assignments
  const totalAssignments = coursesData.reduce(
    (acc, course) => acc + course.assignments.length,
    0
  );

  // Get pending submissions (mock data for now)
  const pendingSubmissions = assignmentSubmissions.filter(submission => submission.grade === undefined).length;

  return (
    <PageLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
          <p className="text-gray-500">Welcome back, Dr. Alan Smith!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{courseCount}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalEnrolled}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalAssignments}</div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{pendingSubmissions}</div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Link href="/courses">
              <Button variant="outline" size="sm">
                View All Courses
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2 relative">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg absolute top-0 left-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pt-48"></div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolled} students</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{course.level}</Badge>
                      <Badge variant="outline">{course.duration}</Badge>
                      <Badge variant="outline">{course.department}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          <span className="text-amber-500">★</span>
                          <span className="ml-1 text-sm font-medium">{course.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Manage <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activities Section - can be expanded in the future */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500 py-8">
                No recent activities to display
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
