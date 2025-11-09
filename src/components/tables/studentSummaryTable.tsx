"use client";

import React from "react";

export type StudentSummaryData = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
  courseName?: string;
  subjectIds: string[];
  subjectNames?: string[];
};

type Props = {
  data: StudentSummaryData[];
};

export default function StudentSummaryTable({ data }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Enrolled Students</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-sm align-middle">
            <thead>
              <tr>
                <th style={{ minWidth: 180 }}>Name</th>
                <th style={{ minWidth: 220 }}>Email</th>
                <th style={{ minWidth: 160 }}>Course</th>
                <th>Subjects</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const fullName = `${row.firstName} ${row.lastName}`.trim();
                const courseText = row.courseName ?? row.courseId;
                const subjects =
                  row.subjectNames && row.subjectNames.length > 0
                    ? row.subjectNames.join(", ")
                    : row.subjectIds.join(", ");

                return (
                  <tr key={idx}>
                    <td>{fullName}</td>
                    <td>{row.email}</td>
                    <td>{courseText}</td>
                    <td>{subjects}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-muted mt-2 text-sm">
          Data is stored only in component state (no backend).
        </p>
      </div>
    </div>
  );
}