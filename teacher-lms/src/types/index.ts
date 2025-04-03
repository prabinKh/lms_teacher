export interface CourseWeek {
  week: number;
  topic: string;
  details: string[];
}

export interface Video {
  id: number;
  title: string;
  duration: string;
  url: string;
  description: string;
}

export interface Document {
  id: number;
  title: string;
  type: string;
  url: string;
  size: string;
}

export interface CodeRepository {
  id: number;
  title: string;
  description: string;
  language: string;
  url: string;
  code: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: number;
  title: string;
  totalQuestions: number;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  points: number;
}

export interface AssignmentSubmission {
  id: number;
  studentId: number;
  assignmentId: number;
  courseId: number;
  submissionDate: string;
  content: string;
  grade?: number;
  feedback?: string;
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  department: string;
  level: string;
  duration: string;
  enrolled: number;
  rating: number;
  image: string;
  curriculum: CourseWeek[];
  videos: Video[];
  documents: Document[];
  codeRepositories: CodeRepository[];
  quizzes: Quiz[];
  assignments: Assignment[];
}

export interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourses: number[];
  submittedAssignments: AssignmentSubmission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  profilePicture?: string;
}
