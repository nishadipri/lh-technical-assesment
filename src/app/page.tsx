"use client";

import React, { useMemo, useState } from "react";
import StudentEnrollForm, {
  FormValues,
} from "../components/forms/studentEnrollForm";
import StudentSummaryTable, {
  StudentSummaryData,
} from "../components/tables/studentSummaryTable";
import StudentEditModal from "../components/edit/studentEditModal";
import useFetchCourses from "../hooks/fetchCourses";
import { getSubjectNames } from "../data/courses";

export default function Home() {
  const [students, setStudents] = useState<StudentSummaryData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const { courses: fetchedCourses } = useFetchCourses(2000);

  const resolveNames = (data: FormValues): StudentSummaryData => {
    const selectedCourse = fetchedCourses.find((c) => c.id === data.courseId);
    
    // Use the helper function to get subject names from IDs
    const subjectNames = getSubjectNames(data.subjectIds);

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
    // Check for duplicate email
    const emailExists = students.some(
      (student) => student.email.toLowerCase() === data.email.toLowerCase()
    );
    
    if (emailExists) {
      throw new Error(`A student with email "${data.email}" is already enrolled.`);
    }
    
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

      subjectIds: s.subjectIds,
    };
  }, [editIndex, students]);

  const handleUpdate = (data: FormValues) => {
    if (editIndex === null) return;
    
    // Check for duplicate email (excluding the current student being edited)
    const emailExists = students.some(
      (student, index) => 
        index !== editIndex && 
        student.email.toLowerCase() === data.email.toLowerCase()
    );
    
    if (emailExists) {
      throw new Error(`A student with email "${data.email}" is already enrolled.`);
    }
    
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
          {/* Reused form for enrolling (create) */}
          <StudentEnrollForm
            onSubmit={handleEnroll}
            submitLabel="Enroll"
            instanceIdPrefix="enroll"
          />

          {/* Table with Edit action */}
          <StudentSummaryTable
            data={students}
            onEdit={(i) => setEditIndex(i)}
          />
        </div>
      </div>

      {/* Reused form inside a modal for editing */}
      <StudentEditModal
        open={editIndex !== null && !!editingInitialValues}
        initialValues={
          editingInitialValues || {
            firstName: "",
            lastName: "",
            email: "",
            courseId: "",

            subjectIds: [],
          }
        }
        onClose={() => setEditIndex(null)}
        onUpdate={handleUpdate}
        instanceIdPrefix={`edit-${editIndex ?? 0}`}
      />
    </div>
  );
}
