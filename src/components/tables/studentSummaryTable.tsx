"use client";

import React from "react";

export type StudentSummaryData = {
  firstName: string;
  lastName: string;
  email: string;
  courseId: string;
  courseName?: string;
  startDate?: string;
  notes?: string;
  subjectIds: string[];
  subjectNames?: string[];
};

type Props = {
  data: StudentSummaryData;
};

export default function StudentSummaryTable({ data }: Props) {
  const {
    firstName,
    lastName,
    email,
    courseName,
    courseId,
    startDate,
    notes,
    subjectNames,
    subjectIds,
  } = data;

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body p-4">
        <h2 className="h5 mb-3">Submitted Student Details</h2>
        <div className="table-responsive">
          <table className=" table table-bordered table-striped table-sm align-middle">
            <tbody>
              <tr>
                <th style={{ width: 220 }}>First name</th>
                <td>{firstName}</td>
              </tr>
              <tr>
                <th>Last name</th>
                <td>{lastName}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{email}</td>
              </tr>
              <tr>
                <th>Course</th>
                <td>
                  {courseName? (
                    <>
                      <span className="fw-semibold">{courseName}</span>
                      <span className="text-muted ms-2">(ID: {courseId})</span>
                    </>
                  ) : (
                    courseId
                  )}
                </td>
              </tr>
              <tr>
                <th>Start date</th>
                <td>{startDate || "-"}</td>
              </tr>
              <tr>
                <th>Notes</th>
                <td>{notes || "-"}</td>
              </tr>
              <tr>
                <th>Subjects</th>
                <td>
                  {subjectNames && subjectNames.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {subjectNames.map((name, idx) => (
                        <span
                          key={`${name}-${idx}`}
                          className="badge text-bg-primary"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted">
                      {subjectIds && subjectIds.length > 0
                        ? subjectIds.join(", ")
                        : "-"}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-muted mt-2 text-sm">
          This summary reflects the data you just submitted.
        </p>
      </div>
    </div>
  );
}