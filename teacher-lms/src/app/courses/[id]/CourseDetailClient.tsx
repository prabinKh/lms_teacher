// src/app/courses/[id]/CourseDetailClient.tsx
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { getCourseById } from "@/data/courses";
import { getStudentsByEnrolledCourse } from "@/data/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  Calendar,
  BookOpen,
  Video as VideoIcon,
  FileText,
  Code,
  CheckSquare,
  FileQuestion,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  Course,
  Video,
  Document,
  CodeRepository,
  Quiz,
  QuizQuestion,
  Assignment,
  AssignmentSubmission,
  Student,
} from "@/types";

import CurriculumTab from "@/components/courses/CurriculumTab";
import VideosTab from "@/components/courses/VideosTab";
import DocumentsTab from "@/components/courses/DocumentsTab";
import CodeRepositoriesTab from "@/components/courses/CodeRepositoriesTab";
import QuizzesTab from "@/components/courses/QuizzesTab";
import AssignmentsTab from "@/components/courses/AssignmentsTab";

interface CourseDetailClientProps {
  courseId: number;
  initialCourse: Course | null;
}

export default function CourseDetailClient({ courseId, initialCourse }: CourseDetailClientProps) {
  const course = initialCourse || getCourseById(courseId);
  const enrolledStudents: Student[] = getStudentsByEnrolledCourse(courseId) || [];
  const [quizzes, setQuizzes] = useState<Quiz[]>(course?.quizzes || []);
  const [assignments, setAssignments] = useState<Assignment[]>(course?.assignments || []);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);

  if (!course) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="mb-6">The course you are looking for does not exist.</p>
          <Link href="/courses">
            <Button>Go Back to Courses</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const updateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes((prev) =>
      prev.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
    );
  };

  const addQuiz = (newQuiz: Omit<Quiz, "id">) => {
    const newId = Math.max(...quizzes.map((q) => q.id), 0) + 1;
    setQuizzes((prev) => [...prev, { ...newQuiz, id: newId }]);
  };

  const deleteQuiz = (quizId: number) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  };

  const fetchSubmissionsSafely = async (assignmentId: number): Promise<AssignmentSubmission[]> => {
    return submissions.filter((submission) => submission.assignmentId === assignmentId);
  };

  const addAssignment = (newAssignment: Assignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const updateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
    );
  };

  const deleteAssignment = (assignmentId: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== assignmentId));
  };

  const addSubmission = (newSubmission: AssignmentSubmission) => {
    setSubmissions((prev) => [...prev, newSubmission]);
  };

  const updateSubmission = (updatedSubmission: AssignmentSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSubmission.id ? updatedSubmission : s))
    );
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        <Link href="/courses" className="inline-flex items-center">
          <Button variant="ghost" className="gap-1 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        <Card className="overflow-hidden">
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${course.image || "/default-course-image.jpg"})` }}
          />
          <CardHeader>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription className="mt-2">
                  {course.description || "No description available."}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  {course.level}
                </Badge>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  {course.department}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="font-medium">{course.enrolled}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="curriculum" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 w-full h-auto">
            <TabsTrigger value="curriculum" className="gap-2 py-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Curriculum</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2 py-2">
              <VideoIcon className="h-4 w-4" />
              <span className="hidden md:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 py-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2 py-2">
              <Code className="h-4 w-4" />
              <span className="hidden md:inline">Code</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="gap-2 py-2">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden md:inline">Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="gap-2 py-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden md:inline">Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="submitassignments" className="gap-2 py-2">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden md:inline">Submit Assignments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <CurriculumTab curriculum={course.curriculum} />
          </TabsContent>
          <TabsContent value="videos">
            <VideosTab videos={course.videos} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab documents={course.documents} />
          </TabsContent>
          <TabsContent value="code">
            <CodeRepositoriesTab codeRepositories={course.codeRepositories} />
          </TabsContent>
          <TabsContent value="quizzes">
            <QuizzesTab
              quizzes={quizzes}
              updateQuiz={updateQuiz}
              addQuiz={addQuiz}
              deleteQuiz={deleteQuiz}
            />
          </TabsContent>
          <TabsContent value="assignments">
            <AssignmentsTab
              assignments={assignments}
              courseId={courseId}
              getSubmissions={fetchSubmissionsSafely}
              addAssignment={addAssignment}
              updateAssignment={updateAssignment}
              deleteAssignment={deleteAssignment}
              addSubmission={addSubmission}
              updateSubmission={updateSubmission}
              userRole="teacher" // Adjust based on your auth logic
              studentId={undefined} // Adjust based on your auth logic
            />
          </TabsContent>
        </Tabs>

        <div>
          <h2 className="text-2xl font-bold mb-6">Enrolled Students ({enrolledStudents.length})</h2>
          <Card>
            <CardContent className="p-6">
              {enrolledStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrolledStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No students enrolled yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}