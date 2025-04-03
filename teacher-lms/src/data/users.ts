import type { Student, User } from "@/types";

export const users: User[] = [
  {
    id: 1,
    name: "Dr. Alan Smith",
    email: "alan.smith@university.edu",
    role: "teacher",
    profilePicture: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200"
  },
  {
    id: 2,
    name: "Prof. Jessica Lee",
    email: "jessica.lee@university.edu",
    role: "teacher",
    profilePicture: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200"
  },
  {
    id: 101,
    name: "John Miller",
    email: "john.miller@university.edu",
    role: "student",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200"
  },
  {
    id: 102,
    name: "Emily Wilson",
    email: "emily.wilson@university.edu",
    role: "student",
    profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200"
  },
  {
    id: 103,
    name: "Michael Brown",
    email: "michael.brown@university.edu",
    role: "student",
    profilePicture: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200"
  }
];

export const students: Student[] = [
  {
    id: 101,
    name: "John Miller",
    email: "john.miller@university.edu",
    enrolledCourses: [1, 2],
    submittedAssignments: []
  },
  {
    id: 102,
    name: "Emily Wilson",
    email: "emily.wilson@university.edu",
    enrolledCourses: [1, 2],
    submittedAssignments: []
  },
  {
    id: 103,
    name: "Michael Brown",
    email: "michael.brown@university.edu",
    enrolledCourses: [1],
    submittedAssignments: []
  }
];

export const getTeachers = () => {
  return users.filter(user => user.role === "teacher");
};

export const getStudents = () => {
  return users.filter(user => user.role === "student");
};

export const getUserById = (id: number) => {
  return users.find(user => user.id === id);
};

export const getTeacherById = (id: number) => {
  return users.find(user => user.id === id && user.role === "teacher");
};

export const getStudentById = (id: number) => {
  return students.find(student => student.id === id);
};

export const getStudentsByEnrolledCourse = (courseId: number) => {
  return students.filter(student =>
    student.enrolledCourses.includes(courseId)
  );
};
