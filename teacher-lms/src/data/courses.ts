import type { Course } from "@/types";

export const coursesData: Course[] = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    instructor: "Dr. Alan Smith",
    description: "Learn the foundational concepts of computer science and programming.",
    department: "Computer Science",
    level: "Beginner",
    duration: "12 weeks",
    enrolled: 1243,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500",
    curriculum: [
      {
        week: 1,
        topic: "Introduction to Programming Concepts",
        details: [
          "What is programming?",
          "Basic computer architecture",
          "Introduction to algorithms",
          "Setting up development environment"
        ]
      },
      {
        week: 2,
        topic: "Basic Data Structures",
        details: [
          "Arrays and lists",
          "Stacks and queues",
          "Basic data manipulation",
          "Performance considerations"
        ]
      },
      {
        week: 3,
        topic: "Algorithms Fundamentals",
        details: [
          "Sorting algorithms",
          "Search techniques",
          "Time and space complexity",
          "Algorithm design principles"
        ]
      }
    ],
    videos: [
      {
        id: 1,
        title: "What is Computer Science?",
        duration: "45:30",
        url: "https://example.com/video1",
        description: "An introductory lecture on computer science fundamentals"
      },
      {
        id: 2,
        title: "Programming Basics",
        duration: "1:02:15",
        url: "https://example.com/video2",
        description: "Learn the basic syntax and concepts of programming"
      }
    ],
    documents: [
      {
        id: 1,
        title: "Course Syllabus",
        type: "PDF",
        url: "https://example.com/syllabus.pdf",
        size: "2.5 MB"
      },
      {
        id: 2,
        title: "Assignment Guidelines",
        type: "DOCX",
        url: "https://example.com/assignments.docx",
        size: "1.2 MB"
      }
    ],
    codeRepositories: [
      {
        id: 1,
        title: "Week 1 Exercises",
        description: "Basic programming exercises",
        language: "Python",
        url: "https://github.com/example/week1-exercises",
        code: `
# Basic Python Exercise
def hello_world():
    """Simple hello world function"""
    return "Hello, Computer Science!"

def calculate_average(numbers):
    """Calculate average of a list of numbers"""
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)

# Example usage
print(hello_world())
numbers = [10, 20, 30, 40, 50]
print(f"Average: {calculate_average(numbers)}")
        `
      }
    ],
    quizzes: [
      {
        id: 1,
        title: "Programming Basics Quiz",
        totalQuestions: 3,
        passingScore: 2,
        questions: [
          {
            question: "What is an algorithm?",
            options: [
              "A cooking recipe",
              "A step-by-step procedure to solve a problem",
              "A type of computer hardware",
              "A programming language"
            ],
            correctAnswer: 1
          },
          {
            question: "What does CPU stand for?",
            options: [
              "Computer Processing Unit",
              "Central Processing Unit",
              "Computer Personal Unit",
              "Central Personal Unit"
            ],
            correctAnswer: 1
          },
          {
            question: "Which of these is NOT a programming language?",
            options: [
              "Python",
              "Java",
              "Excel",
              "JavaScript"
            ],
            correctAnswer: 2
          }
        ]
      }
    ],
    assignments: [
      {
        id: 1,
        title: "Upload Assignment",
        description: "Create a simple program that calculates the average of a list of numbers.",
        dueDate: "2025-04-15",
        points: 100
      },
      
    ],
    submit_assignments: [
      {
        id: 1,
        title: "Upload Assignment",
        description: "Create a simple program that calculates the average of a list of numbers.",
        dueDate: "2025-04-15",
        points: 100
      },
      
    ]


  },

  {
    id: 2,
    title: "Web Development Fundamentals",
    instructor: "Prof. Jessica Lee",
    description: "Learn the core concepts of web development including HTML, CSS, and JavaScript.",
    department: "Computer Science",
    level: "Intermediate",
    duration: "10 weeks",
    enrolled: 876,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=500",
    curriculum: [
      {
        week: 1,
        topic: "HTML Basics",
        details: [
          "Introduction to HTML",
          "Document structure",
          "Elements and attributes",
          "Forms and validation"
        ]
      },
      {
        week: 2,
        topic: "CSS Fundamentals",
        details: [
          "Styling web pages",
          "Selectors and properties",
          "Layout techniques",
          "Responsive design"
        ]
      },
      {
        week: 3,
        topic: "JavaScript Essentials",
        details: [
          "JavaScript syntax",
          "DOM manipulation",
          "Event handling",
          "Asynchronous programming"
        ]
      }
    ],
    videos: [
      {
        id: 1,
        title: "Building Your First Webpage",
        duration: "38:45",
        url: "https://example.com/web-dev-video1",
        description: "Learn how to create your first HTML page from scratch"
      },
      {
        id: 2,
        title: "CSS Styling Techniques",
        duration: "52:10",
        url: "https://example.com/web-dev-video2",
        description: "Explore various CSS styling methods to enhance your webpages"
      }
    ],
    documents: [
      {
        id: 1,
        title: "HTML Cheat Sheet",
        type: "PDF",
        url: "https://example.com/html-cheatsheet.pdf",
        size: "1.8 MB"
      },
      {
        id: 2,
        title: "CSS Reference Guide",
        type: "PDF",
        url: "https://example.com/css-guide.pdf",
        size: "2.3 MB"
      }
    ],
    codeRepositories: [
      {
        id: 1,
        title: "Personal Portfolio Project",
        description: "Build a simple personal portfolio website",
        language: "HTML/CSS/JavaScript",
        url: "https://github.com/example/portfolio-project",
        code: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        header {
            background-color: #333;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>My Portfolio</h1>
    </header>
    <div class="container">
        <h2>About Me</h2>
        <p>I am a web developer passionate about creating beautiful websites.</p>
    </div>
    <script>
        console.log("Portfolio website loaded!");
    </script>
</body>
</html>
        `
      }
    ],
    quizzes: [
      {
        id: 1,
        title: "HTML and CSS Basics Quiz",
        totalQuestions: 3,
        passingScore: 2,
        questions: [
          {
            question: "Which HTML tag is used to create a paragraph?",
            options: [
              "<paragraph>",
              "<p>",
              "<para>",
              "<text>"
            ],
            correctAnswer: 1
          },
          {
            question: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Creative Style Sheets",
              "Cascading Style Sheets",
              "Colorful Style Sheets"
            ],
            correctAnswer: 2
          },
          {
            question: "Which property is used to change the text color in CSS?",
            options: [
              "text-color",
              "font-color",
              "color",
              "text-style"
            ],
            correctAnswer: 2
          }
        ]
      }
    ],
    assignments: [
      {
        id: 1,
        title: "Personal Portfolio Website",
        description: "Build a personal portfolio website using HTML, CSS, and JavaScript.",
        dueDate: "2025-04-20",
        points: 150
      },
      {
        id: 2,
        title: "Interactive Web Form",
        description: "Create a web form with client-side validation using JavaScript.",
        dueDate: "2025-05-05",
        points: 100
      }
    ]
  }
];

export const getCoursesForInstructor = (instructorName: string) => {
  return coursesData.filter(course => course.instructor === instructorName);
};

export const getCourseById = (id: number) => {
  return coursesData.find(course => course.id === id);
};

export const getAssignmentsByCourseId = (courseId: number) => {
  const course = getCourseById(courseId);
  return course ? course.assignments : [];
};

export const getVideoByCourseId = (courseId: number) => {
  const course = getCourseById(courseId);
  return course ? course.videos : [];
};

export const getDocumentsByCourseId = (courseId: number) => {
  const course = getCourseById(courseId);
  return course ? course.documents : [];
};

export const getQuizzesByCourseId = (courseId: number) => {
  const course = getCourseById(courseId);
  return course ? course.quizzes : [];
};

export const getCodeRepositoriesByCourseId = (courseId: number) => {
  const course = getCourseById(courseId);
  return course ? course.codeRepositories : [];
};
