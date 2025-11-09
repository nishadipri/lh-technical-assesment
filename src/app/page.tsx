"use client";

import React, { useMemo, useState } from "react";
import StudentEnrollForm, { FormValues } from "../components/forms/studentEnrollForm";
import StudentSummaryTable, {
  StudentSummaryData,
} from "../components/tables/studentSummaryTable";
import StudentEditModal from "../components/edit/studentEditModal";
import useFetchCourses from "../hooks/fetchCourses";

export default function Home() {
  const [students, setStudents] = useState<StudentSummaryData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const { courses: fetchedCourses } = useFetchCourses(2000);

  const resolveNames = (data: FormValues): StudentSummaryData => {
    const selectedCourse = fetchedCourses.find((c) => c.id === data.courseId);
    const subjectNames =
      selectedCourse?.subjects
        .filter((s:any) => data.subjectIds.includes(s.id))
        .map((s:any) => s.name) ?? [];

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
    setStudents((prev) => [...prev, summary]);
  };

  const editingInitialValues: FormValues | null = useMemo(() => {
    if (editIndex === null) return null;
    const s = students[editIndex];
    if (!s) return null;
    return {
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      courseId: s.courseId,
      startDate: "", // keep optional; not shown in table but preserved in modal state if you wish to store it separately
      notes: "",
      subjectIds: s.subjectIds,
    };
  }, [editIndex, students]);

  const handleUpdate = (data: FormValues) => {
    if (editIndex === null) return;
    const updated = resolveNames(data);
    setStudents((prev) =>
      prev.map((row, i) => (i === editIndex ? updated : row))
    );
    setEditIndex(null);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">
          {/* Enrollment form */}
          <StudentEnrollForm onSubmit={handleEnroll} />

          {/* Enrolled students table with Edit actions */}
          <StudentSummaryTable data={students} onEdit={(i) => setEditIndex(i)} />
        </div>
      </div>

      {/* Edit modal */}
      <StudentEditModal
        open={editIndex !== null && !!editingInitialValues}
        initialValues={
          editingInitialValues || {
            firstName: "",
            lastName: "",
            email: "",
            courseId: "",
            startDate: "",
            notes: "",
            subjectIds: [],
          }
        }
        onClose={() => setEditIndex(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}