export type Course = {
  name: string;
  subjects: { name: string }[];
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
    ],
  },
];
