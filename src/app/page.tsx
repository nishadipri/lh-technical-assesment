"use client";

import React, { useState } from "react";
import StudentEnrollForm ,{ FormValues} from "../components/forms/studentEnrollForm";
import StudentSummaryTable, {
  StudentSummaryData,
} from "../components/tables/studentSummaryTable";
import useFetchCourses from "../hooks/fetchCourses";

export default function Home() {
  // Component state only: store all enrolled students
  const [students, setStudents] = useState<StudentSummaryData[]>([]);

  // Fetch to resolve names for display (no backend)
  const { courses: fetchedCourses } = useFetchCourses(2000);

  const resolveNames = (data: FormValues): StudentSummaryData => {
    const selectedCourse = fetchedCourses.find((c) => c.id === data.courseId);
    const subjectNames =
      selectedCourse?.subjects
        .filter((s: any) => data.subjectIds.includes(s.id))
        .map((s: any) => s.name) ?? [];

    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      courseId: data.courseId,
      courseName: selectedCourse?.name,
      subjectIds: data.subjectIds,
      subjectNames,
    };
  };

  const handleEnroll = (data: FormValues) => {
    const summary = resolveNames(data);
    setStudents((prev) => [...prev, summary]); // append to the table
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* Enrollment form */}
          <StudentEnrollForm onSubmit={handleEnroll} />

          {/* Enrolled students table below the form */}
          {students.length > 0 && <StudentSummaryTable data={students} />}
        </div>
      </div>
    </div>
  );
}