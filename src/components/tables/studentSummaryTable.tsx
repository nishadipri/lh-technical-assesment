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
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden mb-5">
      <div className="card-header bg-secondary text-white py-3">
        <h2 className="h6 mb-0 tracking-wide">Enrolled Students</h2>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle text-sm">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const fullName = `${row.firstName} ${row.lastName}`.trim();
                const courseText = row.courseName ?? row.courseId;
                const subjects =
                  (row.subjectNames?.length
                    ? row.subjectNames
                    : row.subjectIds) || [];

                return (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="py-2 px-3 text-muted small">{idx + 1}</td>
                    <td className="py-2 px-3 fw-medium">{fullName}</td>
                    <td className="py-2 px-3">
                      <span className="text-primary">{row.email}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-3 py-2">
                        {courseText}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="d-flex flex-wrap gap-2">
                        {subjects.map((s: string, sIdx: number) => (
                          <span
                            key={`${s}-${sIdx}`}
                            className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle rounded-pill px-3 py-2"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {data.length === 0 && (
              <tfoot>
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No students enrolled yet.
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
      <div className="card-footer bg-white py-2 px-3">
        <p className="mb-0 text-muted text-xs">
          Stored only in component state (no backend).
        </p>
      </div>
    </div>
  );
}