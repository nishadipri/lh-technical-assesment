"use client";

import React, { useState } from "react";
import StudentEnrollForm, { FormValues } from "../components/StudentEnrollForm";
import StudentSummaryTable, {
  StudentSummaryData,
} from "../components/StudentSummaryTable";
import useFetchCourses from "../hooks/fetchCourses";

export default function Home() {
  const [submitted, setSubmitted] = useState<StudentSummaryData | null>(null);

  // Fetch courses to resolve course and subject names for display
  const { courses: fetchedCourses } = useFetchCourses(2000);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <StudentEnrollForm
            onSubmit={(data) => {
              // Resolve course and subject names for nicer display
              const selectedCourse = fetchedCourses.find(
                (c) => c.id === data.courseId
              );

              const subjectNames =
                selectedCourse?.subjects
                  .filter((s: any) => data.subjectIds.includes(s.id))
                  .map((s: any) => s.name) ?? [];

              setSubmitted({
                ...data,
                courseName: selectedCourse?.name,
                subjectNames,
              });
            }}
          />

          {submitted && <StudentSummaryTable data={submitted} />}
        </div>
      </div>
    </div>
  );
}