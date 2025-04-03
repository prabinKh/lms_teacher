import type { AssignmentSubmission } from "@/types";

export const assignmentSubmissions: AssignmentSubmission[] = [
  {
    id: 1,
    studentId: 101,
    assignmentId: 1,
    courseId: 1,
    submissionDate: "2025-04-14",
    content: `
`,
    grade: 95,
    feedback: "Excellent work! Good handling of edge cases. Code is well-documented."
  },
  {
    id: 2,
    studentId: 102,
    assignmentId: 1,
    courseId: 1,
    submissionDate: "2025-04-13",
    content: `
`,
    grade: 80,
    feedback: "Good implementation but missing error handling for empty lists."
  },
  {
    id: 3,
    studentId: 103,
    assignmentId: 2,
    courseId: 1,
    submissionDate: "2025-04-28",
    content: `
`,
    grade: 90,
    feedback: "Very well implemented bubble sort with good documentation."
  },
  {
    id: 4,
    studentId: 101,
    assignmentId: 1,
    courseId: 2,
    submissionDate: "2025-04-18",
    content: `
`,
    grade: 98,
    feedback: "Outstanding work! The website is well-structured, beautifully styled, and has good JavaScript functionality."
  },
  {
    id: 5,
    studentId: 102,
    assignmentId: 2,
    courseId: 2,
    submissionDate: "2025-05-04",
    content: `
`,
    grade: 95,
    feedback: "Excellent work! The form validation is comprehensive and well-implemented. I especially like the password strength meter feature."
  }
];

export const getSubmissionsByCourseId = (courseId: number) => {
  return assignmentSubmissions.filter(submission => submission.courseId === courseId);
};

export const getSubmissionsByStudentId = (studentId: number) => {
  return assignmentSubmissions.filter(submission => submission.studentId === studentId);
};

export const getSubmissionsByAssignmentId = (assignmentId: number, courseId: number) => {
  return assignmentSubmissions.filter(
    submission => submission.assignmentId === assignmentId && submission.courseId === courseId
  );
};

export const getSubmissionById = (id: number) => {
  return assignmentSubmissions.find(submission => submission.id === id);
};
