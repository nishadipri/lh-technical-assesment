export type SubjectType = {
  id: string;
  name: string;
  description?: string;
}

export type CourseType = {
  id: string;
  name: string;
  subjectIds: string[]; // References to subject IDs instead of embedded objects
  description?: string;
};

// ============================================
// NORMALIZED DATA STRUCTURE
// Subjects are defined once and shared across courses
// ============================================

/**
 * All available subjects in the system.
 * Subjects can belong to multiple courses without duplication.
 */
export const subjects: Record<string, SubjectType> = {
  // Computer Science Subjects
  "sub-cs-101": {
    id: "sub-cs-101",
    name: "Data Structures and Algorithms",
    description: "Fundamental data structures and algorithmic techniques"
  },
  "sub-cs-102": {
    id: "sub-cs-102",
    name: "Operating Systems",
    description: "Process management, memory, and file systems"
  },
  "sub-cs-103": {
    id: "sub-cs-103",
    name: "Computer Networks",
    description: "Network protocols, architecture, and security"
  },
  "sub-cs-104": {
    id: "sub-cs-104",
    name: "Database Systems",
    description: "Relational databases, SQL, and data modeling"
  },
  "sub-cs-105": {
    id: "sub-cs-105",
    name: "Software Engineering",
    description: "Software development lifecycle and best practices"
  },
  
  // Business Subjects
  "sub-bus-101": {
    id: "sub-bus-101",
    name: "Economics",
    description: "Micro and macroeconomic principles"
  },
  "sub-bus-102": {
    id: "sub-bus-102",
    name: "Marketing",
    description: "Marketing strategies and consumer behavior"
  },
  "sub-bus-103": {
    id: "sub-bus-103",
    name: "Finance",
    description: "Corporate finance and investment analysis"
  },
  "sub-bus-104": {
    id: "sub-bus-104",
    name: "Management",
    description: "Organizational behavior and strategic management"
  },
  "sub-bus-105": {
    id: "sub-bus-105",
    name: "Leadership",
    description: "Leadership theories and team dynamics"
  },
  
  // Engineering Subjects
  "sub-eng-101": {
    id: "sub-eng-101",
    name: "Thermodynamics",
    description: "Energy systems and thermal processes"
  },
  "sub-eng-102": {
    id: "sub-eng-102",
    name: "Fluid Mechanics",
    description: "Fluid behavior and flow analysis"
  },
  "sub-eng-103": {
    id: "sub-eng-103",
    name: "Structural Analysis",
    description: "Stress, strain, and structural design"
  },
  "sub-eng-104": {
    id: "sub-eng-104",
    name: "Control Systems",
    description: "Feedback systems and automation"
  },
  
  // Shared/Cross-disciplinary Subjects
  "sub-shared-101": {
    id: "sub-shared-101",
    name: "Mathematics",
    description: "Advanced mathematics and calculus"
  },
  "sub-shared-102": {
    id: "sub-shared-102",
    name: "Statistics",
    description: "Statistical methods and data analysis"
  },
  "sub-shared-103": {
    id: "sub-shared-103",
    name: "Project Management",
    description: "Planning, execution, and project delivery"
  },
  "sub-shared-104": {
    id: "sub-shared-104",
    name: "Technical Writing",
    description: "Documentation and professional communication"
  },
  "sub-shared-105": {
    id: "sub-shared-105",
    name: "English",
    description: "Academic writing and literature analysis"
  },
  "sub-shared-106": {
    id: "sub-shared-106",
    name: "Leadership",
    description: "Leadership principles and team management"
  },
  "sub-shared-107": {
    id: "sub-shared-107",
    name: "Communication Strategies",
    description: "Effective communication and presentation skills"
  },
};

/**
 * Courses with references to subjects.
 * Multiple courses can reference the same subject without duplication.
 */
export const courses: CourseType[] = [
  {
    id: "cs",
    name: "Computer Science",
    description: "Software development and computer systems",
    subjectIds: [
      "sub-cs-101",      // Data Structures and Algorithms
      "sub-cs-102",      // Operating Systems
      "sub-cs-103",      // Computer Networks
      "sub-cs-104",      // Database Systems
      "sub-cs-105",      // Software Engineering
      "sub-shared-101",  // Mathematics (shared)
      "sub-shared-102",  // Statistics (shared)
      "sub-shared-104",  // Technical Writing (shared)
      "sub-shared-105",  // English (shared)
      "sub-shared-106",  // Leadership (shared)
      "sub-shared-107",  // Communication Strategies (shared)
    ],
  },
  {
    id: "bus",
    name: "Business",
    description: "Business administration and management",
    subjectIds: [
      "sub-bus-101",     // Economics
      "sub-bus-102",     // Marketing
      "sub-bus-103",     // Finance
      "sub-bus-104",     // Management
      "sub-bus-105",     // Leadership
      "sub-shared-102",  // Statistics (shared)
      "sub-shared-103",  // Project Management (shared)
      "sub-shared-104",  // Technical Writing (shared)
      "sub-shared-105",  // English (shared)
      "sub-shared-106",  // Leadership (shared)
      "sub-shared-107",  // Communication Strategies (shared)
    ],
  },
  {
    id: "eng",
    name: "Engineering",
    description: "Mechanical and systems engineering",
    subjectIds: [
      "sub-eng-101",     // Thermodynamics
      "sub-eng-102",     // Fluid Mechanics
      "sub-eng-103",     // Structural Analysis
      "sub-eng-104",     // Control Systems
      "sub-shared-101",  // Mathematics (shared)
      "sub-shared-102",  // Statistics (shared)
      "sub-shared-103",  // Project Management (shared)
      "sub-shared-104",  // Technical Writing (shared)
      "sub-shared-105",  // English (shared)
      "sub-shared-106",  // Leadership (shared)
      "sub-shared-107",  // Communication Strategies (shared)
    ],
  },
];

/**
 * Helper function to get subjects for a specific course
 */
export const getSubjectsForCourse = (courseId: string): SubjectType[] => {
  const course = courses.find(c => c.id === courseId);
  if (!course) return [];
  
  return course.subjectIds
    .map(subjectId => subjects[subjectId])
    .filter(Boolean); // Filter out any undefined subjects
};

/**
 * Helper function to get subject by ID
 */
export const getSubjectById = (subjectId: string): SubjectType | undefined => {
  return subjects[subjectId];
};

/**
 * Helper function to get subject names from IDs
 */
export const getSubjectNames = (subjectIds: string[]): string[] => {
  return subjectIds
    .map(id => subjects[id]?.name)
    .filter(Boolean) as string[];
};

/**
 * Helper function to check if a subject belongs to a course
 */
export const isSubjectInCourse = (subjectId: string, courseId: string): boolean => {
  const course = courses.find(c => c.id === courseId);
  return course?.subjectIds.includes(subjectId) ?? false;
};
