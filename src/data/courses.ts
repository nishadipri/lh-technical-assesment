export type SubjectType = {
    id: string;
    name: string;
}

export type CourseType = {
  name: string;
  subjects: SubjectType[];
  id : string
};


export const courses = [
  {
    name: "Computer Science",
    id : "cs",
    subjects: [
      {
        name: "Data Structures and Algorithms",
        id : "cs101",
      },
      {
        name: "Operating Systems",
        id : "cs102",
      },
      {
        name: "Computer Networks",
        id : "cs103",
      },
       {
        name: "Database Systems",
        id : "cs104",
      },
    ],
  },
  {
    name: "Business",
    id : "bus",
    subjects: [
      {
        name: "Economics",
        id : "bus101",
      },
      {
        name: "Marketing",
        id : "bus102",
      },
      {
        name: "Finance",
        id : "bus103",
      },
      {
        name: "Management",
        id : "bus104",
      },

      {
        name: "Leadership",
        id : "bus105",
      },
    ],
  },
  {
    name: "Engineering",
    id : "eng",
    subjects: [
      {
        name: "Thermodynamics",
        id : "eng101",
      },
      {
        name: "Fluid Mechanics",
        id : "eng102",
      },
      {
        name: "Structural Analysis",
        id : "eng103",
      },
      {
        name: "Control Systems",
        id : "eng104",
      },
    ],
  },
];
